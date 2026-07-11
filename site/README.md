# Vroom Diaries — Photography Portfolio

Varun Teja Cherukuthota's photography portfolio. Next.js 15 + Tailwind +
Framer Motion, with a Google Drive-backed admin portal for uploading new
frames into categorized gallery columns.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in ADMIN_PASSWORD + SESSION_SECRET
npm run dev
```

Full setup (including connecting Google Drive so uploads work) is in
[`SETUP.md`](./SETUP.md).

## Structure

- `app/page.tsx` — the public site (hero, about, categorized gallery, contact)
- `app/admin` — password-gated upload dashboard (`middleware.ts` guards it)
- `lib/drive.ts` — Google Drive API integration (list/upload/delete photos)
- `lib/data.ts` — serves live Drive data, or falls back to the seed photos
  in `public/photos` + `public/manifest.json` if Drive isn't connected yet
- `components/` — Hero, About, Gallery (with lightbox), Contact, AdminDashboard

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion ·
googleapis (Drive v3) · seed data pulled from the original PDF portfolio
