"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Invalid email or password.");
      return;
    }

    window.location.href = "/admin/dashboard";
  }

  return (
    <main className="min-h-screen bg-neutral-100 px-6 py-12">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
          <section className="hidden bg-neutral-900 p-10 text-white lg:block">
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">
              PPM Internal
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">
              Admin login for internal staff only.
            </h1>
            <p className="mt-6 max-w-md text-neutral-300">
              Manage enquiries, update blog content, and review admin stats.
            </p>
          </section>

          <section className="p-8 sm:p-10">
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              PPM
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-neutral-900">
              Admin Login
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Sign in to access the internal dashboard.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-neutral-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@ppm.com.au"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-neutral-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
                  required
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-neutral-900 px-4 py-3 font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}