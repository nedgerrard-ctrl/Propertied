import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";
import PageInlineEditor from "../page-inline-editor";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPageScreen({ params }: Props) {
  await connectDB();
  const { id } = await params;

  const page = await Page.findById(id).lean() as any;
  if (!page) notFound();

  return (
    <PageInlineEditor
      initialData={{
        _id: String(page._id),
        title: page.title || "",
        slug: page.slug || "",
        status: page.status || "draft",
        templateKey: page.templateKey || "text-only",
        heroEyebrow: page.heroEyebrow || "",
        heroTitle: page.heroTitle || "",
        heroSummary: page.heroSummary || "",
        body: page.body || "",
        sections: page.sections || [],
        ctaTitle: page.ctaTitle || "",
        ctaText: page.ctaText || "",
        ctaLink: page.ctaLink || "",
      }}
    />
  );
}
