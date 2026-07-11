"use client";

import { motion } from "framer-motion";

export function Intro() {
  return (
    <section id="top" className="pt-36 sm:pt-44 pb-16 sm:pb-20">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display italic text-[7vw] sm:text-[3.2vw] leading-[1.2] max-w-4xl text-ink"
        >
          Photographer and design student based in Hyderabad, working mainly
          in street, portrait, and landscape photography — shot between
          lectures at CBIT and campus life at the Photography Club.
        </motion.p>
      </div>
    </section>
  );
}
