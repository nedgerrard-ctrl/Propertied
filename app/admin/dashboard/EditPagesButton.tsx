"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const pages = [
  { label: "About Us", href: "/admin/dashboard/content/about" },
];

export default function EditPagesButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 border border-[#5f5245] px-4 py-2 text-sm text-[#1f1a17] hover:bg-neutral-200 transition"
      >
        Edit Pages
        <svg
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-48 rounded border border-neutral-200 bg-white shadow-lg z-10">
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition"
            >
              {page.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
