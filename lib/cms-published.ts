import CmsPageConfig from "@/models/CmsPageConfig";

export async function assertCmsPagePublished(slug: string) {
  const page = await CmsPageConfig.findOne({ slug }).lean() as { published?: boolean; archived?: boolean } | null;
  if (page && (page.published === false || page.archived === true)) {
    const { notFound } = await import("next/navigation");
    notFound();
  }
}
