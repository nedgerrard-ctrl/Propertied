const WEBFLOW_API = "https://api.webflow.com/v2";

async function webflowFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.WEBFLOW_API_TOKEN}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Webflow API error ${res.status}: ${text}`);
  }

  return res.json();
}


export function mapPageToWebflow(page: any) {
  return {
    fieldData: {
      name: page.title,
      slug: page.slug,

      "page-title": page.title,
      subtitle: page.subtitle || "",

      "paragraph-1-title": page.paragraph1Title || "",
      "paragraph-1": page.paragraph1 || "",

      "paragraph-2-title": page.paragraph2Title || "",
      "paragraph-2": page.paragraph2 || "",

      "paragraph-3-title": page.paragraph3Title || "",
      "paragraph-3": page.paragraph3 || "",

      "paragraph-4-title": page.paragraph4Title || "",
      "paragraph-4": page.paragraph4 || "",
    },
  };
}

// Create item
export async function createWebflowItem(collectionId: string, page: any) {
  return webflowFetch(
    `${WEBFLOW_API}/collections/${collectionId}/items`,
    {
      method: "POST",
      body: JSON.stringify(mapPageToWebflow(page)),
    }
  );
}

// Update item
export async function updateWebflowItem(
  collectionId: string,
  itemId: string,
  page: any
) {
  return webflowFetch(
    `${WEBFLOW_API}/collections/${collectionId}/items/${itemId}`,
    {
      method: "PATCH",
      body: JSON.stringify(mapPageToWebflow(page)),
    }
  );
}

// Publish item
export async function publishWebflowItem(collectionId: string, itemId: string) {
  return webflowFetch(
    `${WEBFLOW_API}/collections/${collectionId}/items/publish`,
    {
      method: "POST",
      body: JSON.stringify({
        itemIds: [itemId],
      }),
    }
  );
}

export function mapPageToWebflowFieldData(page: any) {
  return {
    name: page.title,
    slug: page.slug,
    "page-title": page.title,
    subtitle: page.subtitle || "",
    "paragraph-1-title": page.paragraph1Title || "",
    "paragraph-1": page.paragraph1 || "",
    "paragraph-2-title": page.paragraph2Title || "",
    "paragraph-2": page.paragraph2 || "",
    "paragraph-3-title": page.paragraph3Title || "",
    "paragraph-3": page.paragraph3 || "",
    "paragraph-4-title": page.paragraph4Title || "",
    "paragraph-4": page.paragraph4 || "",
  };
}

export async function createStagedPage(fieldData: Record<string, unknown>) {
  const collectionId = process.env.WEBFLOW_COLLECTION_ID!;
  const result = await webflowFetch(
    `${WEBFLOW_API}/collections/${collectionId}/items`,
    {
      method: "POST",
      body: JSON.stringify({ fieldData }),
    }
  );
  return { items: [result] };
}

export async function updateStagedPage(
  itemId: string,
  fieldData: Record<string, unknown>
) {
  const collectionId = process.env.WEBFLOW_COLLECTION_ID!;
  return webflowFetch(
    `${WEBFLOW_API}/collections/${collectionId}/items/${itemId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ fieldData }),
    }
  );
}

export async function publishPageItems(itemIds: string[]) {
  const collectionId = process.env.WEBFLOW_COLLECTION_ID!;
  return webflowFetch(
    `${WEBFLOW_API}/collections/${collectionId}/items/publish`,
    {
      method: "POST",
      body: JSON.stringify({ itemIds }),
    }
  );
}