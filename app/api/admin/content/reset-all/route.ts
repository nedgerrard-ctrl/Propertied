import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";

// Lazy-import every content model and delete all documents in each.
// After this runs, all public pages fall back to their code defaults.
const MODELS = [
  () => import("@/models/LandingContent"),
  () => import("@/models/AboutContent"),
  () => import("@/models/BuyerContent"),
  () => import("@/models/DeveloperContent"),
  () => import("@/models/InsightsContent"),
  () => import("@/models/OurPeopleContent"),
  () => import("@/models/ResourcesContent"),
  () => import("@/models/TestimonialContent"),
  () => import("@/models/FooterContent"),
  () => import("@/models/OffThePlanExplainerContent"),
  () => import("@/models/PastProjectsContent"),
  () => import("@/models/FullDisclaimerContent"),
  () => import("@/models/PrivacyPolicyContent"),
  () => import("@/models/BlogPageContent"),
];

export async function DELETE() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  const results: { model: string; deleted: number; error?: string }[] = [];

  for (const loader of MODELS) {
    const mod = await loader();
    const Model = mod.default;
    const name = Model.modelName;
    try {
      const res = await Model.deleteMany({});
      results.push({ model: name, deleted: res.deletedCount });
    } catch (err) {
      results.push({ model: name, deleted: 0, error: String(err) });
    }
  }

  return NextResponse.json({ ok: true, results });
}
