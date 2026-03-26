"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const session = await getSession();

      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard");
      }
    }

    checkSession();
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      setLoading(false);
      setError("Invalid email or password.");
      return;
    }

    const session = await getSession();
    const role = session?.user?.role;

    if (role === "admin") {
      window.location.href = "/admin/dashboard";
      return;
    }

    if (role === "client") {
      window.location.href = "/client/dashboard";
      return;
    }

    setLoading(false);
    setError("Your account does not have a valid role.");
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#2f2923]">
      <Navbar />

      <section className="flex min-h-[calc(100vh-170px)] items-center justify-center px-6 py-14">
        <div className="w-full max-w-[620px] rounded-[28px] border border-[#d8d0c4] bg-[#fbfaf7] shadow-[0_10px_30px_rgba(47,41,35,0.06)]">
          <div className="px-8 pb-10 pt-10 sm:px-14">
            <div className="mb-10 text-center">
              <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-[#9a8f83]">
                Property Project Marketing
              </p>
              <h1 className="mt-5 text-4xl font-medium tracking-tight text-[#2f2923] sm:text-5xl">
                Sign in
              </h1>
              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#6e655c] sm:text-base">
                Access your account to continue to your portal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#4d453d]"
                >
                  Email address
                </label>
                <div className="rounded-2xl border border-[#8e857a] bg-[#fbfaf7] px-4 py-3">
                  <input
                    id="email"
                    type="email"
                    placeholder="hello@propertyprojectmarketing.com.au"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-[15px] text-[#2f2923] outline-none placeholder:text-[#a49a8d]"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#4d453d]"
                >
                  Password
                </label>
                <div className="rounded-2xl border border-[#8e857a] bg-[#fbfaf7] px-4 py-3">
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-[15px] text-[#2f2923] outline-none placeholder:text-[#a49a8d]"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#6e655c] underline underline-offset-4 hover:text-[#2f2923]"
                >
                  Forgot password?
                </Link>
              </div>

              {error ? (
                <div className="rounded-2xl border border-[#d4b7b0] bg-[#f7e9e6] px-4 py-3 text-sm text-[#8a3d31]">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl border border-[#2f2923] bg-[#2f2923] px-4 py-3 text-base font-medium text-[#fbfaf7] transition hover:bg-[#453d35] hover:border-[#453d35] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Continue"}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#ddd5c8]" />
              <span className="text-sm font-medium uppercase tracking-[0.18em] text-[#8f867a]">
                Portal access
              </span>
              <div className="h-px flex-1 bg-[#ddd5c8]" />
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-[#d8d0c4] bg-[#f7f3ec] px-5 py-4 text-sm text-[#6e655c]">
                Use your registered email and password to sign in.
              </div>
              <div className="rounded-2xl border border-[#d8d0c4] bg-[#f7f3ec] px-5 py-4 text-sm text-[#6e655c]">
                Access will depend on your account role and permissions.
              </div>
            </div>
          </div>

          <div className="border-t border-[#ddd5c8] bg-[#f3eee6] px-8 py-6 text-center sm:px-14">
            <p className="text-sm leading-6 text-[#7a7166]">
              By continuing, you agree to our Terms of Use and Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}