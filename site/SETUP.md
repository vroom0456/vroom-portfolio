# Setup — Vroom Diaries Portfolio

## 1. Run it locally (works immediately, no Drive needed)

```bash
npm install
cp .env.example .env.local
```

Open `.env.local` and set:
- `ADMIN_PASSWORD` — whatever you'll type in at `/admin`
- `SESSION_SECRET` — run `openssl rand -hex 32` and paste the output

Leave the `GOOGLE_*` and `DRIVE_ROOT_FOLDER_ID` lines blank for now.

```bash
npm run dev
```

Visit `http://localhost:3000` — the gallery is pre-populated with 43 real
photos pulled from your PDF, sorted into the same categories (Finest
Clicks, Chromatic Clouds, Lunar Dreams, etc). Visit `/admin` and log in
with your `ADMIN_PASSWORD` to see the dashboard — uploads are disabled
until Drive is connected (step 2), but everything else works.

## 2. Connect Google Drive (so you can actually upload photos)

This lets you upload photos from your phone or laptop any time, and the
site reads directly from Drive — no redeploying needed.

**a. Create a Google Cloud project & service account**
1. Go to [console.cloud.google.com](https://console.cloud.google.com) → create a new project (e.g. "vroom-diaries").
2. Enable the **Google Drive API** for that project (APIs & Services → Library).
3. APIs & Services → Credentials → Create Credentials → **Service account**.
4. Open the new service account → Keys tab → Add key → JSON. This downloads a `.json` file — keep it private, never commit it.

**b. Create the root Drive folder**
1. In your own Google Drive, create a folder called e.g. "Vroom Diaries Photos".
2. Inside it, create one subfolder per gallery category — you can reuse the
   names already in the site (Finest Clicks, Chromatic Clouds, Shot & Framed,
   Frame Favourites, Mood Gloom, Clicks Reimagined, Lunar Dreams, Timeless
   Portraits, Favs, Greens and Yellows) or make your own. Each subfolder =
   one category on the site.
3. Right-click the root folder → Share → paste the service account's email
   (looks like `xxxx@xxxx.iam.gserviceaccount.com`, found in the JSON file
   as `client_email`) → give it **Editor** access.
4. Copy the root folder's ID from its URL:
   `drive.google.com/drive/folders/`**`THIS_PART`**

**c. Fill in your `.env.local`**
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxxx@xxxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
DRIVE_ROOT_FOLDER_ID=the_folder_id_from_step_4
```
The private key comes from the downloaded JSON's `private_key` field —
paste it exactly as-is, including the `\n` characters and quotes.

Restart `npm run dev`. The gallery and admin dashboard now read live from
Drive. Uploading a photo in `/admin` drops it straight into the matching
Drive subfolder and makes it public automatically (view-only link).

## 3. Deploy (Vercel, matches your usual workflow)

1. Push this project to a GitHub repo.
2. Import it in [vercel.com](https://vercel.com/new).
3. In the project's Environment Variables, add the same five variables
   from your `.env.local` (`ADMIN_PASSWORD`, `SESSION_SECRET`, and the
   three `GOOGLE_*`/`DRIVE_ROOT_FOLDER_ID` ones once you've connected Drive).
4. Deploy. Your admin password stays server-side — it's never shipped to
   the browser.

## Notes

- Photos are served through Drive's `lh3.googleusercontent.com` thumbnail
  endpoint, which is fast and doesn't count against Drive's normal
  download quota.
- Deleting a photo in `/admin` permanently deletes it from Drive too —
  there's a confirm step, but there's no trash/undo built in.
- Adding a new category in `/admin` just creates a new subfolder under
  your root Drive folder — you can also just make one directly in Drive
  and it'll show up on the site within a minute (the gallery re-checks
  Drive every 60 seconds).
