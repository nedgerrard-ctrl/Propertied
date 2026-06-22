"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("nedgerrard@gmail.com");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        setLoading(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f1ea", fontFamily: "sans-serif" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "48px 40px", maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <h2 style={{ color: "#2f2923", marginBottom: 8 }}>Admin account created</h2>
          <p style={{ color: "#6e655c", marginBottom: 32 }}>You can now sign in with your credentials.</p>
          <button
            onClick={() => router.push("/login")}
            style={{ background: "#2f2923", color: "white", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, cursor: "pointer", width: "100%" }}
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f1ea", fontFamily: "sans-serif" }}>
      <div style={{ background: "white", borderRadius: 16, padding: "48px 40px", maxWidth: 400, width: "100%", boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
        <h1 style={{ color: "#2f2923", marginBottom: 8, fontSize: 24 }}>Create admin account</h1>
        <p style={{ color: "#6e655c", marginBottom: 32, fontSize: 14 }}>One-time setup. This page will stop working once the account is created.</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#4d453d" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #c8bfb4", fontSize: 15, color: "#2f2923", background: "#fbfaf7", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#4d453d" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Min 8 chars, uppercase, number, symbol"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #c8bfb4", fontSize: 15, color: "#2f2923", background: "#fbfaf7", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#4d453d" }}>Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #c8bfb4", fontSize: 15, color: "#2f2923", background: "#fbfaf7", boxSizing: "border-box" }}
            />
          </div>

          {error && (
            <div style={{ background: "#f7e9e6", border: "1px solid #d4b7b0", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#8a3d31" }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 12, fontSize: 12, color: "#9a8f83" }}>
            Password must include: 8+ characters · uppercase · lowercase · number · symbol (e.g. !)
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "#2f2923", color: "white", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Creating account…" : "Create admin account"}
          </button>
        </form>
      </div>
    </div>
  );
}
