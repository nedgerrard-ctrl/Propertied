"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { footerDefaults, FooterContentData } from "@/lib/footer-defaults";

// ── Social media icons ────────────────────────────────────────────────────────

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Footer() {
  const [c, setC] = useState<FooterContentData>({ ...footerDefaults });

  useEffect(() => {
    fetch("/api/public/footer")
      .then((r) => r.json())
      .then((res: { success?: boolean; content?: FooterContentData }) => {
        if (res?.content) setC(res.content)
      })
      .catch(() => {/* keep defaults on error */});
  }, []);

  const hasSocial = c.youtubeUrl || c.instagramUrl || c.facebookUrl;

  // Render multi-line text (newlines → <br>)
  function lines(text: string | undefined | null) {
    if (!text) return null
    return text.split("\n").map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
  }

  const services = [
    { label: c.service1Label, href: c.service1Href },
    { label: c.service2Label, href: c.service2Href },
    { label: c.service3Label, href: c.service3Href },
    { label: c.service4Label, href: c.service4Href },
  ].filter((s) => s.label && s.href);

  const company = [
    { label: c.company1Label, href: c.company1Href },
    { label: c.company2Label, href: c.company2Href },
    { label: c.company3Label, href: c.company3Href },
    { label: c.company4Label, href: c.company4Href },
    { label: c.company5Label, href: c.company5Href },
  ].filter((s) => s.label && s.href);

  return (
    <footer id="site-footer" className="border-t border-white/[0.06] bg-[#0f0c0a]">
      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* Main footer columns */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Column 1: Brand */}
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#c8a96e]">
              {c.brandTagline}
            </p>
            <p className="mt-3 text-[11px] leading-[1.8] text-[#8a7b6d]">
              {lines(c.brandAddress)}
            </p>
            <p className="mt-3 text-[11px] leading-[1.8] text-[#8a7b6d]">
              {lines(c.brandLicence)}
            </p>
            <p className="mt-3 text-[11px] text-[#8a7b6d]">
              {c.brandLanguages}
            </p>

            {/* Social media icons */}
            {hasSocial && (
              <div className="mt-6 flex items-center gap-2">
                {c.youtubeUrl && (
                  <a
                    href={c.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-[#8a7b6d] transition-all hover:border-[#c8a96e]/40 hover:bg-[#c8a96e]/10 hover:text-[#c8a96e]"
                  >
                    <YouTubeIcon />
                  </a>
                )}
                {c.instagramUrl && (
                  <a
                    href={c.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-[#8a7b6d] transition-all hover:border-[#c8a96e]/40 hover:bg-[#c8a96e]/10 hover:text-[#c8a96e]"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {c.facebookUrl && (
                  <a
                    href={c.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-[#8a7b6d] transition-all hover:border-[#c8a96e]/40 hover:bg-[#c8a96e]/10 hover:text-[#c8a96e]"
                  >
                    <FacebookIcon />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Column 2: Services */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#8a7b6d] mb-5">
              Services
            </p>
            <ul className="space-y-3 text-[12px] text-[#8a7b6d]">
              {services.map((s, i) => (
                <li key={i}>
                  <Link href={s.href} className="hover:text-[#c8a96e] transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#8a7b6d] mb-5">
              Company
            </p>
            <ul className="space-y-3 text-[12px] text-[#8a7b6d]">
              {company.map((s, i) => (
                <li key={i}>
                  <Link href={s.href} className="hover:text-[#c8a96e] transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#8a7b6d] mb-5">
              Contact
            </p>
            <ul className="space-y-2 text-[12px] text-[#8a7b6d]">
              {c.contactSalesEmail && (
                <li>
                  <span className="text-[#6b5e54]">Sales:</span>{" "}
                  <a href={`mailto:${c.contactSalesEmail}`} className="hover:text-[#c8a96e] transition-colors">
                    {c.contactSalesEmail}
                  </a>
                </li>
              )}
              {c.contactManagementEmail && (
                <li>
                  <span className="text-[#6b5e54]">Management:</span>{" "}
                  <a href={`mailto:${c.contactManagementEmail}`} className="hover:text-[#c8a96e] transition-colors">
                    {c.contactManagementEmail}
                  </a>
                </li>
              )}
              {c.contactGeneralEmail && (
                <li>
                  <span className="text-[#6b5e54]">General:</span>{" "}
                  <a href={`mailto:${c.contactGeneralEmail}`} className="hover:text-[#c8a96e] transition-colors">
                    {c.contactGeneralEmail}
                  </a>
                </li>
              )}
              {c.contactPhone1 && (
                <li className="pt-1">
                  <a href={`tel:${c.contactPhone1.replace(/\s/g, "")}`} className="hover:text-[#c8a96e] transition-colors">
                    {c.contactPhone1}
                  </a>
                </li>
              )}
              {c.contactPhone2 && (
                <li>
                  <a href={`tel:${c.contactPhone2.replace(/\s/g, "")}`} className="hover:text-[#c8a96e] transition-colors">
                    {c.contactPhone2}
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Compliance line */}
        <div className="mt-12 border-t border-white/[0.06] pt-8">
          <p className="text-[10px] leading-[1.8] text-[#6b5e54] max-w-4xl">
            {c.complianceText}
          </p>
          <div className="mt-4 flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.16em] text-[#6b5e54]">
            <Link href="/full-disclaimer" className="hover:text-[#c8a96e] transition-colors">Full Disclaimer →</Link>
            <Link href="/privacy-policy" className="hover:text-[#c8a96e] transition-colors">Privacy Policy →</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
