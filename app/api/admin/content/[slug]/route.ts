import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";

// ─── Model map ────────────────────────────────────────────────────────────────
// Maps URL slug → Mongoose model name (lazy-imported to avoid edge issues)
const MODEL_MAP: Record<string, () => Promise<{ default: import("mongoose").Model<Record<string, unknown>> }>> = {
  landing:                  () => import("@/models/LandingContent"),
  about:                    () => import("@/models/AboutContent"),
  buyer:                    () => import("@/models/BuyerContent"),
  developer:                () => import("@/models/DeveloperContent"),
  insights:                 () => import("@/models/InsightsContent"),
  "our-people":             () => import("@/models/OurPeopleContent"),
  resources:                () => import("@/models/ResourcesContent"),
  testimonial:              () => import("@/models/TestimonialContent"),
  footer:                   () => import("@/models/FooterContent"),
  "off-the-plan-explainer": () => import("@/models/OffThePlanExplainerContent"),
  "past-projects":          () => import("@/models/PastProjectsContent"),
  "full-disclaimer":        () => import("@/models/FullDisclaimerContent"),
  "privacy-policy":         () => import("@/models/PrivacyPolicyContent"),
  blog:                     () => import("@/models/BlogPageContent"),
};

// ─── Auth guard ───────────────────────────────────────────────────────────────
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function getModel(slug: string) {
  const loader = MODEL_MAP[slug];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}

// ─── GET — return current content (or {} if not yet saved) ────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { slug } = await params;
  const Model = await getModel(slug);
  if (!Model) return NextResponse.json({ error: "Unknown page" }, { status: 404 });

  await connectDB();
  const doc = await Model.findOne().lean();
  return NextResponse.json(doc ?? {});
}

// ─── PATCH — upsert content fields ────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { slug } = await params;
  const Model = await getModel(slug);
  if (!Model) return NextResponse.json({ error: "Unknown page" }, { status: 404 });

  let updates: Record<string, unknown>;
  try {
    updates = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Strip internal Mongoose/MongoDB fields from the payload
  const { _id, __v, createdAt, updatedAt, ...safeUpdates } = updates as Record<string, unknown> & {
    _id?: unknown; __v?: unknown; createdAt?: unknown; updatedAt?: unknown;
  };
  void _id; void __v; void createdAt; void updatedAt;

  await connectDB();
  await Model.findOneAndUpdate({}, { $set: safeUpdates }, { upsert: true, new: true });
  return NextResponse.json({ ok: true });
}

// ─── DELETE — remove content doc → page reverts to code defaults ──────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { slug } = await params;
  const Model = await getModel(slug);
  if (!Model) return NextResponse.json({ error: "Unknown page" }, { status: 404 });

  await connectDB();
  await Model.deleteMany({});
  return NextResponse.json({ ok: true, message: `${slug} content reset to defaults.` });
}
