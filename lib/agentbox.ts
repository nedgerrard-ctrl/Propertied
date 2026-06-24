const AGENTBOX_API_KEY = process.env.AGENTBOX_API_KEY ?? "";
const AGENTBOX_CLIENT_ID = process.env.AGENTBOX_CLIENT_ID ?? "";
const AGENTBOX_BASE_URL = "https://api.agentboxcrm.com.au";

export type AgentboxEnquiryData = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  comment: string;
  listingId?: string;
};

export async function submitEnquiryToAgentbox(
  data: AgentboxEnquiryData
): Promise<string | null> {
  if (!AGENTBOX_API_KEY || !AGENTBOX_CLIENT_ID) {
    console.warn("Agentbox credentials not configured — skipping CRM sync");
    return null;
  }

  const payload = {
    enquiry: {
      attachedContact: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile,
        actions: {
          addDefaultContactClasses: true,
          addDefaultSubscriptions: true,
        },
      },
      comment: data.comment,
      ...(data.listingId ? { attachedListing: { id: data.listingId } } : {}),
    },
  };

  try {
    const response = await fetch(
      `${AGENTBOX_BASE_URL}/enquiries?version=2`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-ID": AGENTBOX_CLIENT_ID,
          "X-API-Key": AGENTBOX_API_KEY,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(`Agentbox API error ${response.status}:`, text);
      return null;
    }

    const result = await response.json();
    console.log("Agentbox API response:", JSON.stringify(result, null, 2));
    const id = result?.enquiry?.id ?? null;
    return id !== null ? String(id) : null;
  } catch (error) {
    console.error("Failed to submit enquiry to Agentbox:", error);
    return null;
  }
}
