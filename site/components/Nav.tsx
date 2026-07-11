"use client";

const socials = [
  { label: "IG", href: "https://instagram.com/vrooms_diaries" },
];

export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-bg/90 backdrop-blur-sm">
      <nav className="mx-auto max-w-[1600px] px-6 sm:px-10 h-20 flex items-center justify-between">
        <a href="#top" className="font-display italic text-2xl">
          Varun Teja
        </a>

        <ul className="hidden sm:flex items-center gap-8 text-sm text-ink/70">
          <li>
            <a href="#top" className="hover:text-ink transition-colors">
              Overview
            </a>
          </li>
          <li>
            <a href="#work" className="hover:text-ink transition-colors">
              Work
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-ink transition-colors">
              About
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-5">
          <a
            href="mailto:vroomseye0456@gmail.com"
            className="hidden sm:inline text-sm text-ink/70 hover:text-ink transition-colors"
          >
            Contact Me
          </a>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] tracking-widest2 text-ink/70 hover:text-ink transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
