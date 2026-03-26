"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8f5f2] text-center px-6">
      
      {/* Logo / Title */}
      <h1 className="text-6xl font-light text-[#2f2a24] mb-4">
        404
      </h1>

      <h2 className="text-2xl font-medium text-[#2f2a24] mb-2">
        Page Not Found
      </h2>

      <p className="text-gray-600 max-w-md mb-8">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-[#2f2a24] text-[#000000] rounded-md hover:bg-[#444] transition"
        >
          Go Home
        </Link>

        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-[#2f2a24] text-[#2f2a24] rounded-md hover:bg-[#2f2a24] hover:text-white transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}