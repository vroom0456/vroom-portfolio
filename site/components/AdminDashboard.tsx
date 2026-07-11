"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";

export function AdminDashboard({
  initialCategories,
  driveReady,
}: {
  initialCategories: Category[];
  driveReady: boolean;
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const router = useRouter();

  async function handleUpload(category: Category, file: File) {
    setBusySlug(category.slug);
    setBanner(null);

    const form = new FormData();
    form.append("categoryId", category.id);
    form.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json();

    if (!res.ok) {
      setBanner(json.error ?? "Upload failed.");
    } else {
      setCategories((prev) =>
        prev.map((c) => (c.slug === category.slug ? { ...c, photos: [json.photo, ...c.photos] } : c))
      );
    }
    setBusySlug(null);
  }

  async function handleDelete(category: Category, photoId: string) {
    if (!confirm("Remove this frame from the gallery? This can't be undone.")) return;
    setBusySlug(category.slug);

    const res = await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId: photoId }),
    });

    if (res.ok) {
      setCategories((prev) =>
        prev.map((c) =>
          c.slug === category.slug ? { ...c, photos: c.photos.filter((p) => p.id !== photoId) } : c
        )
      );
    } else {
      const json = await res.json().catch(() => ({}));
      setBanner(json.error ?? "Couldn't delete that frame.");
    }
    setBusySlug(null);
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setAddingCat(true);
    setBanner(null);

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCatName.trim() }),
    });
    const json = await res.json();

    if (!res.ok) {
      setBanner(json.error ?? "Couldn't create that category.");
    } else {
      setCategories((prev) => [...prev, json.category]);
      setNewCatName("");
    }
    setAddingCat(false);
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="eyebrow mb-3">Admin</p>
          <h1 className="font-display italic text-4xl">Manage your frames</h1>
        </div>
        <div className="flex items-center gap-6">
          <a href="/" className="font-mono text-[11px] uppercase tracking-widest2 text-muted hover:text-gold transition-colors">
            View site
          </a>
          <button onClick={signOut} className="font-mono text-[11px] uppercase tracking-widest2 text-muted hover:text-gold transition-colors">
            Sign out
          </button>
        </div>
      </div>

      {!driveReady && (
        <div className="mt-8 border border-gold/40 bg-gold/5 px-5 py-4 text-sm text-ink/90">
          You&apos;re running on the seed photos from your PDF right now — uploads and
          new categories are disabled until Google Drive is connected. Follow{" "}
          <code className="font-mono text-gold">SETUP.md</code> to wire it up.
        </div>
      )}

      {banner && (
        <div className="mt-8 border border-rust/50 bg-rust/10 px-5 py-4 text-sm text-ink/90">
          {banner}
        </div>
      )}

      <form onSubmit={handleAddCategory} className="mt-10 flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[220px]">
          <label className="font-mono text-[11px] uppercase tracking-widest2 text-muted">
            New category
          </label>
          <input
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="e.g. Golden Hour"
            disabled={!driveReady}
            className="mt-2 w-full bg-surface border border-line px-4 py-3 text-ink outline-none focus:border-gold transition-colors disabled:opacity-40"
          />
        </div>
        <button
          type="submit"
          disabled={!driveReady || addingCat || !newCatName.trim()}
          className="border border-line px-5 py-3 font-mono text-[11px] uppercase tracking-widest2 hover:border-gold hover:text-gold transition-colors disabled:opacity-40"
        >
          {addingCat ? "Creating…" : "Add category"}
        </button>
      </form>

      <div className="mt-16 space-y-16">
        {categories.map((cat) => (
          <div key={cat.slug}>
            <div className="flex items-baseline justify-between mb-5 border-b border-line pb-4">
              <h2 className="font-display italic text-2xl">{cat.name}</h2>
              <span className="font-mono text-[11px] uppercase tracking-widest2 text-muted">
                {cat.photos.length} frames
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {cat.photos.map((photo) => (
                <div key={photo.id} className="relative aspect-[3/4] group border border-line">
                  <Image src={photo.url} alt={photo.name} fill sizes="200px" className="object-cover" />
                  <button
                    onClick={() => handleDelete(cat, photo.id)}
                    disabled={!driveReady || busySlug === cat.slug}
                    className="absolute inset-0 bg-bg/0 group-hover:bg-bg/70 flex items-center justify-center text-transparent group-hover:text-rust font-mono text-[11px] uppercase tracking-widest2 transition-all disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {/* empty slot — click to upload into this category */}
              <button
                onClick={() => fileInputs.current[cat.slug]?.click()}
                disabled={!driveReady || busySlug === cat.slug}
                className="relative aspect-[3/4] border border-dashed border-line hover:border-gold flex items-center justify-center text-muted hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="font-mono text-[11px] uppercase tracking-widest2 text-center px-2">
                  {busySlug === cat.slug ? "Uploading…" : "+ Add frame"}
                </span>
              </button>
              <input
                ref={(el) => {
                  fileInputs.current[cat.slug] = el;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(cat, file);
                  e.target.value = "";
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
