"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("That password doesn't match. Try again.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg text-ink px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <p className="eyebrow mb-3">Admin</p>
        <h1 className="font-display italic text-4xl mb-8">Sign in to manage frames</h1>

        <label htmlFor="password" className="font-mono text-[11px] uppercase tracking-widest2 text-muted">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full bg-surface border border-line px-4 py-3 text-ink outline-none focus:border-gold transition-colors"
        />

        {error && <p className="mt-3 text-sm text-rust">{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-6 w-full border border-line py-3 font-mono text-[11px] uppercase tracking-widest2 hover:border-gold hover:text-gold transition-colors disabled:opacity-40"
        >
          {loading ? "Checking…" : "Sign in"}
        </button>

        <a href="/" className="mt-8 block text-center font-mono text-[11px] uppercase tracking-widest2 text-muted hover:text-gold transition-colors">
          &larr; Back to site
        </a>
      </form>
    </main>
  );
}
