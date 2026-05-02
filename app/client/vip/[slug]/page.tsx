import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug } from "../articles";

type Props = { params: Promise<{ slug: string }> };

export default async function VipArticlePage({ params }: Props) {
  const session = await auth();

  const isAdmin = session?.user?.role === "admin";
  const isApprovedExistingClient =
    session?.user?.role === "client" &&
    session?.user?.userType === "existing_client" &&
    !session?.user?.pendingApproval;

  if (!isAdmin && !isApprovedExistingClient) {
    notFound();
  }

  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="flex-1 min-h-screen bg-[#f9f6f1]">
      {/* Hero image */}
      <div
        className="h-64 w-full md:h-80"
        style={{ background: article.imageCss }}
      />

      {/* Article content */}
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Link
          href="/client/vip"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a6e4b] hover:text-[#5c3d1e] transition-colors"
        >
          ← Back to VIP Content
        </Link>

        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8a6e4b]">
            {article.category} · {article.date}
          </p>
          <div className="mt-3 h-px w-10 bg-[#c9b99a]" />
          <h1 className="mt-4 text-3xl font-light leading-snug text-[#1f1a17] md:text-4xl">
            {article.title}
          </h1>
          <p className="mt-5 text-[15px] leading-8 text-[#6c6258] font-light">
            {article.excerpt}
          </p>
        </div>

        <div className="my-8 h-px bg-[#e3d8ca]" />

        <div className="space-y-7">
          {article.content.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h2 className="mb-3 text-[15px] font-semibold text-[#1f1a17]">
                  {section.heading}
                </h2>
              )}
              <p className="text-[14px] leading-8 text-[#4a423b]">{section.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[#e3d8ca] pt-6">
          <Link
            href="/client/vip"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a6e4b] hover:text-[#5c3d1e] transition-colors"
          >
            ← Back to VIP Content
          </Link>
        </div>
      </div>
    </main>
  );
}
