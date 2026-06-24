"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f5f2]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-xl">
          <div className="text-5xl mb-4">🔒</div>

          <p className="text-sm tracking-[0.25em] uppercase text-gray-500 mb-3">
            Restricted
          </p>

          <h1 className="text-3xl md:text-5xl font-light text-[#2f2a24] mb-4">
            Access Denied
          </h1>

          <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
            You do not have permission to view this page. Please log in with an
            account that has the required access.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-6 py-3 bg-[#2f2a24] text-white rounded-md hover:bg-[#444] transition"
            >
              Login
            </Link>

            <Link
              href="/"
              className="px-6 py-3 border border-[#2f2a24] text-[#2f2a24] rounded-md hover:bg-[#2f2a24] hover:text-white transition"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}