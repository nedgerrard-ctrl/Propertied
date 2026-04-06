"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { projects, type Project } from "@/lib/projects-data";

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildBuyerEnquiryHref(project: Project) {
  const params = new URLSearchParams({
    projectName: project.name,
    suburb: project.suburb,
    state: project.state,
    propertyType: project.type,
    propertyInterest: "off-plan",
    bedrooms: project.bedrooms,
    priceFrom: project.priceFrom,
  });

  return `/contact/buyers-investors?${params.toString()}`;
}

// ── Project detail slide-over ────────────────────────────────────────────────

function ProjectDetailPanel({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/30" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-40 flex w-full max-w-lg flex-col overflow-y-auto bg-[#fbf8f3] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#e3d8ca] px-7 py-6">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#8a7b6d]">
              {project.suburb}, {project.state} &nbsp;·&nbsp; {project.type}
            </p>
            <h2 className="mt-1.5 text-2xl font-semibold text-[#1f1a17]">
              {project.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 rounded p-1.5 text-[#8a7b6d] hover:bg-[#e3d8ca] hover:text-[#1f1a17]"
            aria-label="Close"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-7 px-7 py-7">
          {/* Image */}
          <div className="overflow-hidden rounded-sm bg-[#e3dbd0]">
            <img
              src={project.image}
              alt={project.name}
              className="h-52 w-full object-cover"
            />
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Bedrooms", value: project.bedrooms },
              { label: "Price", value: project.priceFrom },
              { label: "Status", value: project.status },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-sm border border-[#e3d8ca] bg-white px-4 py-3 text-center"
              >
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#8a7b6d]">
                  {s.label}
                </p>
                <p className="mt-1 text-[13px] font-semibold text-[#1f1a17]">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Description */}
          <section>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a7b6d]">
              About This Project
            </p>
            <p className="text-[13px] leading-7 text-[#4a4038]">
              {project.description}
            </p>
          </section>

          <hr className="border-[#e3d8ca]" />

          {/* Highlights */}
          <section>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a7b6d]">
              Key Highlights
            </p>
            <ul className="space-y-2">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-[13px] text-[#4a4038]">
                  <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#8a7b6d]" />
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <hr className="border-[#e3d8ca]" />

          {/* CTA */}
          <Link
            href={buildBuyerEnquiryHref(project)}
            className="flex w-full items-center justify-center rounded-sm bg-[#2f2a24] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1f1a17]"
          >
            Enquire About This Project
          </Link>
        </div>
      </aside>
    </>
  );
}

// ── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  onViewDetails,
}: {
  project: Project;
  onViewDetails: (p: Project) => void;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-sm border border-[#dfd4c7] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      {/* Image */}
      <div className="relative overflow-hidden bg-[#e3dbd0]">
        <img
          src={project.image}
          alt={project.name}
          className="h-52 w-full object-cover"
        />
        <span
          className={`absolute right-3 top-3 rounded-sm px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] ${
            project.status === "Current"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {project.status}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8a7b6d]">
          {project.suburb}, {project.state} &nbsp;·&nbsp; {project.type}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-[#1f1a17]">
          {project.name}
        </h3>

        {/* Quick info */}
        <div className="mt-4 flex gap-5 text-[12px] text-[#6c6258]">
          <span>
            <span className="font-medium text-[#1f1a17]">{project.bedrooms}</span> bed
          </span>
          <span className="font-medium text-[#1f1a17]">{project.priceFrom}</span>
        </div>

        {/* Excerpt */}
        <p className="mt-4 flex-1 text-[13px] leading-6 text-[#6c6258] line-clamp-3">
          {project.description}
        </p>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => onViewDetails(project)}
            className="flex-1 rounded-sm border border-[#cfc2b2] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#5b5147] transition hover:border-[#5f5245] hover:text-[#1f1a17]"
          >
            View Details
          </button>
          <Link
            href={buildBuyerEnquiryHref(project)}
            className="flex-1 rounded-sm bg-[#2f2a24] px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#1f1a17]"
          >
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function BuyersPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <main className="min-h-screen w-full bg-[#f6f2eb] text-[#1f1a17]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="border-b border-[#e3d8ca] bg-[#fbf8f3]">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
            For Buyers
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-light text-[#1f1a17] md:text-5xl">
            Find your next property with PPM
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-[#6c6258]">
            Whether you are an investor building a portfolio or searching for your
            first home, we source, guide, and support you through every step of
            the buying process.
          </p>
          <div className="mt-10">
            <Link
              href="/contact/buyers-investors"
              className="inline-flex items-center gap-2 rounded-sm bg-[#2f2a24] px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#1f1a17]"
            >
              Register Interest
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* ── Investor vs Owner-Occupier ── */}
        <section>
          <div className="mb-10 text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
              Who We Work With
            </p>
            <h2 className="mt-3 text-3xl font-light text-[#1f1a17] md:text-4xl">
              Tailored guidance for every buyer
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Investors */}
            <div className="rounded-sm border border-[#e3d8ca] bg-[#fbf8f3] px-8 py-9">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-sm bg-[#2f2a24]">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
                  <path d="M3 13h2v8H3v-8Zm4-4h2v12H7V9Zm4-4h2v16h-2V5Zm4 2h2v14h-2V7Zm4-4h2v18h-2V3Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1f1a17]">For Investors</h3>
              <p className="mt-3 text-[13px] leading-7 text-[#5b5147]">
                PPM provides access to off-the-plan and established investment
                opportunities across Melbourne, selected for yield potential,
                capital growth fundamentals, and developer quality. Our
                end-to-end model means we can source your property, manage it
                through Online Property Services, and advise on the right time
                to resell — all under one roof.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  "Access to exclusive off-the-plan developments",
                  "Independent advice — not tied to any single developer",
                  "FIRB guidance for overseas buyers",
                  "Ongoing portfolio management via Online Property Services",
                  "Advice on resale timing and reinvestment strategy",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[13px] text-[#4a4038]">
                    <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#8a7b6d]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Owner-Occupiers */}
            <div className="rounded-sm border border-[#e3d8ca] bg-[#fbf8f3] px-8 py-9">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-sm bg-[#2f2a24]">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1f1a17]">For Owner-Occupiers</h3>
              <p className="mt-3 text-[13px] leading-7 text-[#5b5147]">
                Buying your own home is one of the most significant decisions
                you will make. PPM gives you access to quality developments
                before they reach the broader market, with independent guidance
                throughout the purchase process — from shortlisting and contract
                review coordination through to settlement. We work for you, not
                the developer.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  "Access to new builds and off-the-plan apartments and townhouses",
                  "Lock in today's price — settle on completion",
                  "New build warranty on all fixtures and fittings",
                  "Modern energy ratings and high-spec inclusions",
                  "Guided support from enquiry through to settlement",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[13px] text-[#4a4038]">
                    <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#8a7b6d]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Current Projects ── */}
        <section className="mt-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
                Featured &amp; Current
              </p>
              <h2 className="mt-3 text-3xl font-light text-[#1f1a17] md:text-4xl">
                Available projects
              </h2>
            </div>
            <Link
              href="/contact/buyers-investors"
              className="hidden shrink-0 border border-[#2f2a24] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2f2a24] transition hover:bg-[#2f2a24] hover:text-white sm:inline-block"
            >
              Register Interest
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={setSelectedProject}
              />
            ))}
          </div>
        </section>

        {/* ── Register Interest CTA ── */}
        <section className="mt-20 rounded-sm border border-[#e3d8ca] bg-[#2f2a24] px-8 py-14 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#c4b49f]">
            Get In Touch
          </p>
          <h2 className="mx-auto mt-4 max-w-xl text-3xl font-light text-white">
            Ready to start your property search?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[14px] leading-7 text-[#c4b49f]">
            Register your interest and one of our advisers will be in touch to
            discuss your goals, budget, and the opportunities currently
            available.
          </p>
          <Link
            href="/contact/buyers-investors"
            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-white px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1f1a17] transition hover:bg-[#f0e8dd]"
          >
            Register Interest
          </Link>
        </section>
      </div>

      <Footer />

      {/* Detail slide-over */}
      {selectedProject && (
        <ProjectDetailPanel
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </main>
  );
}