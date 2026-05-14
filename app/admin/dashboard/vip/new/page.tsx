import Link from "next/link";
import VipForm from "../vip-form";

export default function NewVipPage() {
  return (
    <main className="min-h-screen bg-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/dashboard/vip"
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 transition hover:text-neutral-700"
        >
          ← Manage VIP Contents
        </Link>

        <p className="mt-3 text-sm uppercase tracking-[0.2em] text-neutral-500">PPM Admin</p>

        <h1 className="mt-1 text-3xl font-semibold text-neutral-900">Create VIP Post</h1>

        <p className="mt-1 text-sm text-neutral-500">
          Add a new VIP content article. You can save it as a draft or publish it immediately.
        </p>

        <VipForm />
      </div>
    </main>
  );
}
