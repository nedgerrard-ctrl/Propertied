import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";

export default async function PagesList() {
  await connectDB();

  const pages = await Page.find().sort({ createdAt: -1 }).lean();

  return (
    <main className="min-h-screen bg-[#efefef] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#8b7e70]">
              PPM Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#1f1a17]">
              Pages
            </h1>
          </div>

          <Link
            href="/admin/dashboard/pages/new"
            className="border border-[#5f5245] bg-[#2f2a24] px-4 py-2 text-sm text-white"
          >
            Add Page
          </Link>
        </div>

        <div className="rounded-xl border border-[#ddd3c7] bg-white">
          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="px-6 py-4 text-xs uppercase text-[#8b7e70]">
                  Title
                </th>
                <th className="px-6 py-4 text-xs uppercase text-[#8b7e70]">
                  Slug
                </th>
                <th className="px-6 py-4 text-xs uppercase text-[#8b7e70]">
                  Status
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>

            <tbody>
              {pages.map((page: any) => (
                <tr key={page._id} className="border-b">
                  <td className="px-6 py-4">{page.title}</td>
                  <td className="px-6 py-4 text-sm text-[#6f655d]">
                    {page.slug}
                  </td>
                  <td className="px-6 py-4">
                    {page.status === "draft" ? (
                      <span className="text-yellow-600">Draft</span>
                    ) : (
                      <span className="text-green-600">Published</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/dashboard/pages/${page._id}`}
                      className="text-blue-600"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pages.length === 0 && (
            <p className="p-6 text-sm text-[#8b7e70]">
              No pages created yet.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}