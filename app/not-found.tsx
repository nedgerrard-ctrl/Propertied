"use client";

import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f5f2]">
      <Navbar blackBg />

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-xl">
          <p className="text-sm tracking-[0.25em] uppercase text-gray-500 mb-3">
            Error
          </p>

          <h1 className="text-6xl md:text-7xl font-light text-[#2f2a24] mb-4">
            404
          </h1>

          <h2 className="text-2xl md:text-3xl font-medium text-[#2f2a24] mb-4">
            Page Not Found
          </h2>

          <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
            The page you’re looking for may have been moved, deleted, or never
            existed in the first place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-[#2f2a24] text-white rounded-md hover:bg-[#444] transition"
            >
              Return Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 border border-[#2f2a24] text-[#2f2a24] rounded-md hover:bg-[#2f2a24] hover:text-white transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}