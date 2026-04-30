const WEBFLOW_API_BASE = "https://api.webflow.com/v2";
const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN!;
const WEBFLOW_COLLECTION_ID = process.env.WEBFLOW_COLLECTION_ID!;

type WebflowFieldData = Record<string, unknown>;

async function webflowFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${WEBFLOW_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${WEBFLOW_API_TOKEN}`,
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

export function mapPageToWebflowFieldData(page: {
  title: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroSummary?: string;
  body?: string;
  ctaTitle?: string;
  ctaText?: string;
  ctaLink?: string;
  navLabel?: string;
  pageGroup?: string;
  statusLabel?: string;
  templateKey?: string;
  showInNavbar?: boolean;
  sortOrder?: number;
  featuredImage?: string;
}): WebflowFieldData {
  return {
    name: page.title,
    slug: page.slug,
    "page-title": page.title,
    "seo-title": page.seoTitle || "",
    "seo-description": page.seoDescription || "",
    "hero-eyebrow": page.heroEyebrow || "",
    "hero-title": page.heroTitle || "",
    "hero-summary": page.heroSummary || "",
    body: page.body || "",
    "cta-title": page.ctaTitle || "",
    "cta-text": page.ctaText || "",
    "cta-link": page.ctaLink || "",
    "nav-label": page.navLabel || "",
    "page-group": page.pageGroup || "insights",
    "status-label": page.statusLabel || "",
    "template-key": page.templateKey || "simple-info-page",
    "show-in-navbar": page.showInNavbar || false,
    "sort-order": page.sortOrder || 100,
    "featured-image": page.featuredImage || "",
  };
}

export async function createStagedPage(fieldData: WebflowFieldData) {
  return webflowFetch<{
    items: Array<{ id: string; fieldData: Record<string, unknown> }>;
  }>(`/collections/${WEBFLOW_COLLECTION_ID}/items`, {
    method: "POST",
    body: JSON.stringify({
      items: [{ fieldData }],
    }),
  });
}

export async function updateStagedPage(itemId: string, fieldData: WebflowFieldData) {
  return webflowFetch<{
    items: Array<{ id: string; fieldData: Record<string, unknown> }>;
  }>(`/collections/${WEBFLOW_COLLECTION_ID}/items`, {
    method: "PATCH",
    body: JSON.stringify({
      items: [{ id: itemId, fieldData }],
    }),
  });
}

export async function publishPageItems(itemIds: string[]) {
  return webflowFetch<unknown>(
    `/collections/${WEBFLOW_COLLECTION_ID}/items/publish`,
    {
      method: "POST",
      body: JSON.stringify({
        itemIds,
      }),
    }
  );
}