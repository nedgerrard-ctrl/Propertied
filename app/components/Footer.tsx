import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0f0c0a]">
      <div className="mx-auto max-w-7xl px-6 py-8 text-center">

        <p className="text-[12px] tracking-[0.08em] text-[#4a3f37]">
          © 2026 Property Project Marketing Pty Ltd
        </p>

        <div className="mt-4 flex justify-center gap-6 text-[12px] uppercase tracking-[0.14em] text-[#4a3f37]">

          {/* Internal */}
          <Link href="/contact">Contact Us</Link>

          {/* External */}
          <a href="https://facebook.com" target="_blank">Facebook</a>
          <a href="https://twitter.com" target="_blank">Twitter</a>
          <a href="https://linkedin.com" target="_blank">LinkedIn</a>

        </div>
      </div>
    </footer>
  );
}