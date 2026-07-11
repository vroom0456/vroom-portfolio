export function Contact() {
  return (
    <footer id="contact" className="mx-auto max-w-[1600px] px-6 sm:px-10 py-10 border-t border-line">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <a
          href="mailto:vroomseye0456@gmail.com"
          className="text-sm text-ink hover:text-gold transition-colors"
        >
          Contact Me — vroomseye0456@gmail.com
        </a>

        <div className="flex items-center gap-6">
          <a
            href="tel:+917981467284"
            className="font-mono text-[11px] uppercase tracking-widest2 text-muted hover:text-ink transition-colors"
          >
            +91 79814 67284
          </a>
          <a
            href="https://instagram.com/vrooms_diaries"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] uppercase tracking-widest2 text-muted hover:text-ink transition-colors"
          >
            IN
          </a>
        </div>
      </div>

      <p className="mt-8 font-mono text-[10px] uppercase tracking-widest2 text-muted">
        © {new Date().getFullYear()} Varun Teja Cherukuthota — all rights reserved
      </p>
    </footer>
  );
}
