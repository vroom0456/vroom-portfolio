import { promises as fs } from "fs";
import path from "path";
import { isDriveConfigured, listCategories } from "./drive";
import type { GalleryData } from "./types";

type SeedManifest = {
  hero: string;
  about: string;
  categories: { slug: string; name: string; photos: { file: string; w: number; h: number }[] }[];
};

async function loadSeedData(): Promise<GalleryData> {
  const manifestPath = path.join(process.cwd(), "public", "manifest.json");
  const raw = await fs.readFile(manifestPath, "utf-8");
  const manifest: SeedManifest = JSON.parse(raw);

  return {
    source: "seed",
    hero: `/photos/${manifest.hero}`,
    about: `/photos/${manifest.about}`,
    categories: manifest.categories.map((c) => ({
      id: c.slug,
      slug: c.slug,
      name: c.name,
      photos: c.photos.map((p) => ({
        id: p.file,
        url: `/photos/${p.file}`,
        name: p.file,
        width: p.w,
        height: p.h,
      })),
    })),
  };
}

/**
 * Loads the gallery. If Google Drive credentials are set (see SETUP.md),
 * pulls live from Drive. Otherwise serves the seed photos bundled in
 * /public so the site looks complete out of the box.
 */
export async function getGalleryData(): Promise<GalleryData> {
  if (isDriveConfigured()) {
    try {
      const categories = await listCategories();
      const seed = await loadSeedData();
      return {
        source: "drive",
        hero: seed.hero,
        about: seed.about,
        categories,
      };
    } catch (err) {
      console.error("Drive fetch failed, falling back to seed data:", err);
      return loadSeedData();
    }
  }
  return loadSeedData();
}
