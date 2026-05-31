import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import VipPost from "@/models/VipPost";
import { formatBlogDate } from "@/lib/blog-utils";

export default async function VipPage() {
  const session = await auth();

  const isAdmin = session?.user?.role === "admin";
  const isApprovedExistingClient =
    session?.user?.role === "client" &&
    session?.user?.userType === "existing_client" &&
    !session?.user?.pendingApproval;

  if (!isAdmin && !isApprovedExistingClient) {
    notFound();
  }

  await connectDB();

  const raw = await VipPost.find({ status: "published" })
    .sort({ publishDate: -1, createdAt: -1 })
    .lean();

  const articles = raw.map((p: any) => ({
    _id: String(p._id),
    slug: p.slug as string,
    title: p.title as string,
    description: p.description as string,
    image: (p.image as string) || "",
    category: (p.category as string) || "VIP Insights",
    date: formatBlogDate(p.publishDate),
  }));

  const [featured, ...rest] = articles;

  const fallbackGradient = "linear-gradient(140deg, #e8ddd0 0%, #d4c9bb 100%)";

  return (
    <main className="flex-1 min-h-screen bg-[#f9f6f1]">
      {/* Page header */}
      <div className="border-b border-[#e8ddd0] bg-white px-8 py-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-neutral-900">VIP Content</h1>
          <span className="rounded-full border border-[#c9b99a] bg-[#f3ede4] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a6e4b]">
            Exclusive Access
          </span>
        </div>
        <p className="mt-0.5 text-sm text-neutral-500">
          Insights and updates for existing PPM clients.
        </p>
      </div>

      <div className="px-8 py-8 space-y-6">
        {articles.length === 0 ? (
          <div className="rounded-sm border border-[#e3d8ca] bg-white px-10 py-20 text-center text-sm text-[#6c6258]">
            No VIP content available yet.
          </div>
        ) : (
          <>
            {/* Featured article */}
            <Link
              href={`/client/vip/${featured.slug}`}
              className="group flex min-h-[340px] overflow-hidden rounded-sm border border-[#e3d8ca] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
            >
              <div className="relative w-[58%] shrink-0 overflow-hidden">
                {featured.image ? (
                  <img
                    src={featured.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0" style={{ background: fallbackGradient }} />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-center px-10 py-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a6e4b]">
                  {featured.category} · {featured.date}
                </p>
                <div className="mt-3 h-px w-8 bg-[#c9b99a]" />
                <h2 className="mt-4 text-2xl font-light leading-snug text-[#1f1a17] group-hover:text-[#5c3d1e] transition-colors md:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-4 text-[14px] leading-7 text-[#6c6258]">
                  {featured.description}
                </p>
                <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a6e4b]">
                  Read Article →
                </p>
              </div>
            </Link>

            {/* Grid — remaining articles */}
            {rest.length > 0 && (
              <div className="grid grid-cols-2 gap-5">
                {rest.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/client/vip/${article.slug}`}
                    className="group overflow-hidden rounded-sm border border-[#e3d8ca] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
                  >
                    {article.image ? (
                      <img
                        src={article.image}
                        alt=""
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div
                        className="h-48 w-full"
                        style={{ background: fallbackGradient }}
                      />
                    )}
                    <div className="px-6 py-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a6e4b]">
                        {article.category} · {article.date}
                      </p>
                      <h3 className="mt-2 text-[15px] font-medium leading-snug text-[#1f1a17] group-hover:text-[#5c3d1e] transition-colors">
                        {article.title}
                      </h3>
                      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a6e4b]">
                        Read →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
