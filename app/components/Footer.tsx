export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[#ddd3c6] bg-[#efe8dd]">
      <div className="mx-auto max-w-7xl px-6 py-8 text-center">
        <p className="text-[12px] tracking-[0.08em] text-[#5f554b]">
          © 2026 Property Project Marketing Pty Ltd
        </p>

        <div className="mt-4 flex justify-center gap-6 text-[12px] uppercase tracking-[0.14em] text-[#5f554b]">
          <a href="#" className="transition hover:text-[#1f1a17]">
            Facebook
          </a>
          <a href="#" className="transition hover:text-[#1f1a17]">
            Twitter
          </a>
          <a href="#" className="transition hover:text-[#1f1a17]">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}