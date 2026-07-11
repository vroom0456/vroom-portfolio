export type Photo = {
  id: string; // Drive file id, or local filename when using seed data
  url: string; // resolved src for <img>/<Image>
  name: string;
  width: number;
  height: number;
};

export type Category = {
  id: string; // Drive folder id, or slug when using seed data
  slug: string;
  name: string;
  photos: Photo[];
};

export type GalleryData = {
  source: "drive" | "seed";
  hero: string;
  about: string;
  categories: Category[];
};
