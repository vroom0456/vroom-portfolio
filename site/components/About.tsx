"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const roles = [
  "Design Head — CBIT Photography Club",
  "Media Head — CBIT NSS",
  "Co-founder — Kalakriti",
  "3rd yr, AI & Data Science, CBIT",
];

export function About({ aboutSrc }: { aboutSrc: string }) {
  return (
    <section id="about" className="mx-auto max-w-[1600px] px-6 sm:px-10 py-24 sm:py-32 border-t border-line">
      <div className="grid sm:grid-cols-[220px_1fr] gap-10 sm:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative w-40 sm:w-full aspect-[3/4]"
        >
          <Image
            src={aboutSrc}
            alt="Varun Teja Cherukuthota"
            fill
            sizes="220px"
            className="object-cover grayscale"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="eyebrow mb-4">About</p>
          <p className="text-ink/80 text-base sm:text-lg leading-relaxed max-w-2xl">
            I&apos;m Varun Teja Cherukuthota — a photography enthusiast and
            full-stack developer chasing light between classes at CBIT. Each
            frame is an experiment with timing, mood, and colour, from
            rooftop sunsets to quiet street corners. Off the field, I lead
            design for CBIT&apos;s Photography Club and build the tools our
            creative community runs on.
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
            {roles.map((r) => (
              <li key={r} className="font-mono text-[11px] uppercase tracking-widest2 text-muted">
                {r}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
