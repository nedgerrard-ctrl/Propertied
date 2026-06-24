// eslint-disable-next-line @typescript-eslint/no-require-imports
const docusign = require("docusign-esign");
import { createPrivateKey, type KeyObject } from "crypto";

const SCOPES = ["signature", "impersonation"];

function getPrivateKey(): KeyObject {
  const raw = process.env.DOCUSIGN_PRIVATE_KEY ?? "";
  // .env.local may store newlines as literal \n — convert them back
  const pem = raw.replace(/\\n/g, "\n").trim();

  if (!pem) {
    throw new Error("DOCUSIGN_PRIVATE_KEY is not set in environment variables.");
  }

  try {
    return createPrivateKey(pem);
  } catch (e) {
    throw new Error(
      "DOCUSIGN_PRIVATE_KEY is not a valid RSA private key. " +
      "Ensure the full PEM is present and newlines are encoded as \\n in .env.local. " +
      `Detail: ${e instanceof Error ? e.message : String(e)}`
    );
  }
}

interface TokenResult {
  accessToken: string;
  basePath: string;
  accountId: string;
}

async function getAccessToken(): Promise<TokenResult> {
  const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY ?? "";
  const userId = process.env.DOCUSIGN_USER_ID ?? "";
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID ?? "";
  const oauthBasePath = process.env.DOCUSIGN_OAUTH_BASE_PATH ?? "account-d.docusign.com";
  const basePath = process.env.DOCUSIGN_BASE_PATH ?? "https://demo.docusign.net/restapi";
  if (!integrationKey || !userId || !accountId) {
    throw new Error(
      "DocuSign credentials are not configured. Set DOCUSIGN_INTEGRATION_KEY, DOCUSIGN_USER_ID, and DOCUSIGN_ACCOUNT_ID."
    );
  }

  // getPrivateKey() throws its own descriptive error if the key is missing or malformed
  const privateKey = getPrivateKey();

  const dsApi = new docusign.ApiClient();
  dsApi.setOAuthBasePath(oauthBasePath);

  let results;
  try {
    results = await dsApi.requestJWTUserToken(
      integrationKey,
      userId,
      SCOPES,
      privateKey,   // KeyObject — jsonwebtoken accepts this for RS256
      3600
    );
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = (e as any)?.response?.body ?? (e as any)?.response?.data;
    if (body?.error === "consent_required") {
      const consentUrl =
        `https://${oauthBasePath}/oauth/auth?response_type=code` +
        `&scope=signature+impersonation` +
        `&client_id=${integrationKey}` +
        `&redirect_uri=https://developers.docusign.com/platform/auth/consent`;
      throw new Error(
        `DocuSign consent not yet granted. Open this URL once in your browser, click Accept, then retry:\n${consentUrl}`
      );
    }
    const detail = body ? JSON.stringify(body) : String(e);
    throw new Error(`DocuSign JWT authentication failed: ${detail}`);
  }

  const accessToken: string = results.body.access_token;
  return { accessToken, basePath, accountId };
}

export interface SendEnvelopeArgs {
  signerName: string;
  signerEmail: string;
  documentTitle: string;
  pdfBytes: Buffer;
}

export async function sendDocuSignEnvelope(args: SendEnvelopeArgs): Promise<string> {
  const { accessToken, basePath, accountId } = await getAccessToken();

  const dsApi = new docusign.ApiClient();
  dsApi.setBasePath(basePath);
  dsApi.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

  const envelopesApi = new docusign.EnvelopesApi(dsApi);
  const envelope = buildEnvelope(args);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = await envelopesApi.createEnvelope(accountId, {
    envelopeDefinition: envelope,
  });

  // SDK resolves with { body: EnvelopeSummary } in promise mode
  const envelopeId: string | undefined =
    result?.body?.envelopeId ?? result?.envelopeId ?? result?.data?.envelopeId;

  if (!envelopeId) {
    throw new Error("DocuSign did not return an envelope ID. Check your account credentials.");
  }

  return envelopeId;
}

function buildEnvelope(args: SendEnvelopeArgs) {
  const { signerName, signerEmail, documentTitle, pdfBytes } = args;

  const document = docusign.Document.constructFromObject({
    documentBase64: pdfBytes.toString("base64"),
    name: documentTitle,
    fileExtension: "pdf",
    documentId: "1",
  });

  // Place the signHere tab near the bottom of page 1 (letter page: 612 × 792 pts)
  const signHere = docusign.SignHere.constructFromObject({
    documentId: "1",
    pageNumber: "1",
    recipientId: "1",
    tabLabel: "SignHere",
    xPosition: "100",
    yPosition: "650",
  });

  const signer = docusign.Signer.constructFromObject({
    email: signerEmail,
    name: signerName,
    recipientId: "1",
    routingOrder: "1",
    tabs: docusign.Tabs.constructFromObject({ signHereTabs: [signHere] }),
  });

  const envelope = new docusign.EnvelopeDefinition();
  envelope.emailSubject = `Please sign: ${documentTitle}`;
  envelope.documents = [document];
  envelope.recipients = docusign.Recipients.constructFromObject({ signers: [signer] });
  envelope.status = "sent";

  return envelope;
}
