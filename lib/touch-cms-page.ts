import CmsPageConfig from "@/models/CmsPageConfig";

export async function touchCmsPage(slug: string) {
  await CmsPageConfig.findOneAndUpdate(
    { slug },
    { $set: { contentUpdatedAt: new Date() } }
  );
}
