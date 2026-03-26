import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend =
  resendApiKey && resendApiKey.trim().length > 0
    ? new Resend(resendApiKey)
    : null;

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailParams) {
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const from = process.env.EMAIL_FROM;
  if (!from) {
    throw new Error("EMAIL_FROM is not configured.");
  }

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(error.message || "Failed to send email.");
  }

  return data;
}