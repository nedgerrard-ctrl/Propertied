import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[#ddd3c6] bg-[#efe8dd]">
      <div className="mx-auto max-w-7xl px-6 py-8 text-center">

        <p className="text-[12px] tracking-[0.08em] text-[#5f554b]">
          © 2026 Property Project Marketing Pty Ltd
        </p>

        <div className="mt-4 flex justify-center gap-6 text-[12px] uppercase tracking-[0.14em] text-[#5f554b]">

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