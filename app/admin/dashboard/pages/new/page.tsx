import PageForm from "../page-form";

export default function NewPageScreen() {
  return (
    <main className="min-h-screen bg-[#efefef] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8b7e70]">
            PPM Admin
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-[#1f1a17]">
            Create New Guide Page
          </h1>

          <p className="mt-2 max-w-2xl text-[14px] leading-7 text-[#6f655d]">
            Use this form to create a text-only informational guide page.
          </p>
        </div>

        <PageForm />
      </div>
    </main>
  );
}