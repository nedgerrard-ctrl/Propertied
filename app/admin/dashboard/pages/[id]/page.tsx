import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";
import PageForm from "../page-form";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPageScreen({ params }: Props) {
  await connectDB();
  const { id } = await params;

  const page = await Page.findById(id).lean();
  if (!page) notFound();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Edit Page</h1>
      <PageForm
        pageId={String(page._id)}
        initialValues={{
          title: page.title || "",
          slug: page.slug || "",
          seoTitle: page.seoTitle || "",
          seoDescription: page.seoDescription || "",
          heroEyebrow: page.heroEyebrow || "",
          heroTitle: page.heroTitle || "",
          heroSummary: page.heroSummary || "",
          body: page.body || "",
          ctaTitle: page.ctaTitle || "",
          ctaText: page.ctaText || "",
          ctaLink: page.ctaLink || "",
          navLabel: page.navLabel || "",
          pageGroup: page.pageGroup || "insights",
          statusLabel: page.statusLabel || "",
          showInNavbar: !!page.showInNavbar,
          sortOrder: page.sortOrder || 100,
          featuredImage: page.featuredImage || "",
        }}
      />
    </main>
  );
}