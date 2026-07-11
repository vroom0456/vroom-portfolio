import { getGalleryData } from "@/lib/data";
import { Nav } from "@/components/Nav";
import { Intro } from "@/components/Intro";
import { Gallery } from "@/components/Gallery";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";

export default async function Home() {
  const data = await getGalleryData();

  return (
    <main className="relative">
      <Nav />
      <Intro />
      <Gallery categories={data.categories} />
      <About aboutSrc={data.about} />
      <Contact />
    </main>
  );
}
