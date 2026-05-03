import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AccountRejectedPage() {
  const session = await auth();

  const accountStatus = (session?.user as { accountStatus?: string } | undefined)?.accountStatus;
  if (!session || accountStatus !== "rejected") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f1ea] px-6">
      <div className="w-full max-w-md rounded-2xl border border-[#ddd5c8] bg-white px-10 py-12 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg viewBox="0 0 20 20" className="h-8 w-8 fill-red-600">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-10.5a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0v-4Zm0 7a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" clipRule="evenodd" />
          </svg>
        </div>

        <h2 className="text-[1.6rem] font-medium tracking-tight text-[#2f2923]">
          Existing Client Request Not Approved
        </h2>

        <p className="mt-4 text-[14px] leading-7 text-[#6e655c]">
          Unfortunately, we were unable to verify you as an existing PPM client at this time.
          You still have access to the portal as a standard buyer/investor account.
        </p>

        <p className="mt-3 text-[14px] leading-7 text-[#6e655c]">
          If you believe this is an error or would like to discuss your account, please contact the PPM team directly.
        </p>

        <div className="mt-3 inline-block rounded-lg border border-[#e8ddd0] bg-[#faf8f4] px-4 py-3 text-[13px] text-[#5c4a38]">
          <span className="font-medium">Email:</span>{" "}
          <a href="mailto:info@ppm.com.au" className="underline underline-offset-4 hover:text-[#2f2923]">
            info@ppm.com.au
          </a>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/client/dashboard"
            className="w-full rounded-xl bg-[#2f2923] px-4 py-3.5 text-[15px] font-medium text-[#f4f1ea] transition hover:bg-[#3d342c] text-center"
          >
            Continue to my portal
          </Link>
          <Link
            href="/contact"
            className="w-full rounded-xl border border-[#c8bfb4] bg-white px-4 py-3.5 text-[15px] font-medium text-[#2f2923] transition hover:border-[#2f2923] text-center"
          >
            Contact PPM
          </Link>
        </div>
      </div>
    </div>
  );
}
