"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Login failed.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 grid-texture">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-[var(--line)] rounded-lg p-8 bg-[var(--bg-raised)]"
      >
        <div className="finding-id mb-2">restricted-access.md</div>
        <h1 className="text-xl font-[700] mb-6">Admin login</h1>

        <label className="block font-mono-ui text-xs text-[var(--ink-dim)] mb-2">
          password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full bg-transparent border border-[var(--line)] rounded px-3 py-2 mb-4 font-mono-ui text-sm focus:border-[var(--amber)] outline-none"
        />

        {error && (
          <p className="severity-critical text-xs px-3 py-2 rounded border mb-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded border border-[var(--amber)] text-[var(--amber)] font-mono-ui text-sm hover:bg-[var(--amber)] hover:text-[#0a0d0c] transition-colors disabled:opacity-50"
        >
          {loading ? "checking..." : "log in →"}
        </button>
      </form>
    </main>
  );
}
