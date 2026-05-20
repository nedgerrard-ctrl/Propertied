import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0f0c0a]">
      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* Main footer columns */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Column 1: Brand */}
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#c8a96e]">
              PPM · Property Project Marketing
            </p>
            <p className="mt-3 text-[11px] leading-[1.8] text-[#4a3f37]">
              Property Project Marketing Pty Ltd<br />
              T/A Online Property Services<br />
              Level 7, 570 St Kilda Road<br />
              Melbourne, Victoria 3004
            </p>
            <p className="mt-3 text-[11px] leading-[1.8] text-[#4a3f37]">
              ABN 99 162 429 558<br />
              Estate Agents Licence No. 074846L
            </p>
            <p className="mt-3 text-[11px] text-[#4a3f37]">
              Languages: English · 中文 · 한국어
            </p>
          </div>

          {/* Column 2: Services */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b5e54] mb-5">
              Services
            </p>
            <ul className="space-y-3 text-[12px] text-[#4a3f37]">
              <li><Link href="/buyers/investors" className="hover:text-[#c8a96e] transition-colors">Off-the-Plan Sales</Link></li>
              <li><Link href="/buyers/investors" className="hover:text-[#c8a96e] transition-colors">Property Management</Link></li>
              <li><Link href="/buyers/investors" className="hover:text-[#c8a96e] transition-colors">Resale</Link></li>
              <li><Link href="/developer" className="hover:text-[#c8a96e] transition-colors">Developer Services</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b5e54] mb-5">
              Company
            </p>
            <ul className="space-y-3 text-[12px] text-[#4a3f37]">
              <li><Link href="/about" className="hover:text-[#c8a96e] transition-colors">About PPM</Link></li>
              <li><Link href="/about" className="hover:text-[#c8a96e] transition-colors">Our People</Link></li>
              <li><Link href="/blog" className="hover:text-[#c8a96e] transition-colors">Insights</Link></li>
              <li><Link href="/contact" className="hover:text-[#c8a96e] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b5e54] mb-5">
              Contact
            </p>
            <ul className="space-y-2 text-[12px] text-[#4a3f37]">
              <li>
                <span className="text-[#6b5e54]">Sales:</span>{" "}
                <a href="mailto:sales@onlinepropertyservices.com.au" className="hover:text-[#c8a96e] transition-colors">
                  sales@onlinepropertyservices.com.au
                </a>
              </li>
              <li>
                <span className="text-[#6b5e54]">Management:</span>{" "}
                <a href="mailto:rental@onlinepropertyservices.com.au" className="hover:text-[#c8a96e] transition-colors">
                  rental@onlinepropertyservices.com.au
                </a>
              </li>
              <li>
                <span className="text-[#6b5e54]">General:</span>{" "}
                <a href="mailto:admin@onlinepropertyservices.com.au" className="hover:text-[#c8a96e] transition-colors">
                  admin@onlinepropertyservices.com.au
                </a>
              </li>
              <li className="pt-1">
                <a href="tel:0418520714" className="hover:text-[#c8a96e] transition-colors">0418 520 714</a>
              </li>
              <li>
                <a href="tel:0409522394" className="hover:text-[#c8a96e] transition-colors">0409 522 394</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Compliance line */}
        <div className="mt-12 border-t border-white/[0.06] pt-8">
          <p className="text-[10px] leading-[1.8] text-[#3a312b] max-w-4xl">
            PPM is a licensed real estate agency. Licence No. 074846L · ABN 99 162 429 558. PPM does not provide financial, legal or taxation advice. Tax information on this site relates to proposed 2026-27 Budget changes and is general information only. Seek independent professional advice before making any investment decision.
          </p>
          <div className="mt-4 flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.16em] text-[#4a3f37]">
            <Link href="/contact" className="hover:text-[#c8a96e] transition-colors">Full Disclaimer</Link>
            <Link href="/contact" className="hover:text-[#c8a96e] transition-colors">Privacy Policy</Link>
            <span>© 2026 Property Project Marketing Pty Ltd</span>
          </div>
        </div>

      </div>
    </footer>
  );
}