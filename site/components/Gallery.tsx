"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Category, Photo } from "@/lib/types";

type FlatPhoto = Photo & { categorySlug: string; categoryName: string };
type ViewMode = "grid" | "list";

export function Gallery({ categories }: { categories: Category[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [view, setView] = useState<ViewMode>("grid");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const allPhotos: FlatPhoto[] = useMemo(
    () =>
      categories.flatMap((c) =>
        c.photos.map((p) => ({ ...p, categorySlug: c.slug, categoryName: c.name }))
      ),
    [categories]
  );

  const visible = useMemo(
    () => (activeFilter === "all" ? allPhotos : allPhotos.filter((p) => p.categorySlug === activeFilter)),
    [allPhotos, activeFilter]
  );

  const active = openIndex !== null ? visible[openIndex] : null;

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setOpenIndex((prev) => {
        if (prev === null || visible.length === 0) return prev;
        return (prev + dir + visible.length) % visible.length;
      });
    },
    [visible.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, step]);

  return (
    <section id="work" className="mx-auto max-w-[1600px] px-6 sm:px-10 pb-10">
      {/* filter tabs */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-b border-line py-5 mb-10">
        <button
          onClick={() => setActiveFilter("all")}
          className={`text-sm transition-colors ${
            activeFilter === "all" ? "text-ink" : "text-muted hover:text-ink"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActiveFilter(c.slug)}
            className={`text-sm transition-colors ${
              activeFilter === c.slug ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {c.name}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2">
          <button
            onClick={() => setView("grid")}
            className={view === "grid" ? "text-ink" : "text-muted hover:text-ink transition-colors"}
          >
            Grid
          </button>
          <span className="text-line">/</span>
          <button
            onClick={() => setView("list")}
            className={view === "list" ? "text-ink" : "text-muted hover:text-ink transition-colors"}
          >
            List
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-muted text-sm py-16">No frames here yet.</p>
      ) : view === "grid" ? (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 sm:gap-6 [column-fill:_balance]">
          {visible.map((photo, idx) => (
            <motion.button
              key={photo.id}
              onClick={() => setOpenIndex(idx)}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (idx % 4) * 0.04 }}
              className="relative block w-full mb-4 sm:mb-6 break-inside-avoid group overflow-hidden"
              style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
            >
              <Image
                src={photo.url}
                alt={photo.categoryName}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
              />
              <span className="absolute bottom-2 left-2 font-mono text-[10px] uppercase tracking-widest2 text-bg bg-ink/0 opacity-0 group-hover:opacity-100 group-hover:bg-ink/70 px-2 py-1 transition-opacity">
                {photo.categoryName}
              </span>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-line border-t border-line">
          {visible.map((photo, idx) => (
            <button
              key={photo.id}
              onClick={() => setOpenIndex(idx)}
              className="w-full flex items-center gap-5 py-4 text-left group"
            >
              <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden">
                <Image src={photo.url} alt={photo.categoryName} fill sizes="64px" className="object-cover" />
              </div>
              <span className="text-sm text-ink group-hover:text-gold transition-colors">
                {photo.name.replace(/\.[a-z]+$/i, "")}
              </span>
              <span className="ml-auto font-mono text-[11px] uppercase tracking-widest2 text-muted">
                {photo.categoryName}
              </span>
            </button>
          ))}
        </div>
      )}

      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Frame viewer"
        >
          <div className="flex items-center justify-between px-6 h-16 flex-shrink-0">
            <span className="font-mono text-[11px] uppercase tracking-widest2 text-white/60">
              {active.categoryName} — {(openIndex! + 1).toString().padStart(2, "0")} / {visible.length.toString().padStart(2, "0")}
            </span>
            <button
              onClick={close}
              className="font-mono text-[11px] uppercase tracking-widest2 text-white/60 hover:text-white transition-colors"
              aria-label="Close"
            >
              Close ✕
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center px-4 sm:px-16 pb-6">
            <button
              onClick={() => step(-1)}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 font-mono text-2xl text-white/50 hover:text-white transition-colors px-2"
              aria-label="Previous frame"
            >
              &larr;
            </button>
            <div className="relative w-full h-full max-w-4xl">
              <Image
                src={active.url}
                alt={active.categoryName}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <button
              onClick={() => step(1)}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 font-mono text-2xl text-white/50 hover:text-white transition-colors px-2"
              aria-label="Next frame"
            >
              &rarr;
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
