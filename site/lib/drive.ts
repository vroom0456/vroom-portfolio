import { google, drive_v3 } from "googleapis";
import type { Category, Photo } from "./types";

const FOLDER_MIME = "application/vnd.google-apps.folder";
const IMAGE_MIME_PREFIX = "image/";

export function isDriveConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.DRIVE_ROOT_FOLDER_ID
  );
}

let cachedClient: drive_v3.Drive | null = null;

export function getDriveClient(): drive_v3.Drive {
  if (cachedClient) return cachedClient;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Env vars store literal "\n" — swap them back to real newlines.
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !key) {
    throw new Error("Google Drive credentials are not set. See SETUP.md.");
  }

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  cachedClient = google.drive({ version: "v3", auth });
  return cachedClient;
}

function toImageUrl(fileId: string): string {
  // Works for any file that has "Anyone with the link — Viewer" sharing,
  // which uploadPhoto() sets automatically. `sz=w1600` asks Drive for a
  // web-sized render instead of the full original.
  return `https://lh3.googleusercontent.com/d/${fileId}=w1600`;
}

/** List every subfolder of the root folder — each one is a gallery category. */
export async function listCategories(): Promise<Category[]> {
  const drive = getDriveClient();
  const rootId = process.env.DRIVE_ROOT_FOLDER_ID;

  const folderRes = await drive.files.list({
    q: `'${rootId}' in parents and mimeType = '${FOLDER_MIME}' and trashed = false`,
    fields: "files(id, name, createdTime)",
    orderBy: "createdTime",
    pageSize: 200,
  });

  const folders = folderRes.data.files ?? [];

  const categories = await Promise.all(
    folders.map(async (folder) => {
      const filesRes = await drive.files.list({
        q: `'${folder.id}' in parents and mimeType contains '${IMAGE_MIME_PREFIX}' and trashed = false`,
        fields: "files(id, name, imageMediaMetadata)",
        orderBy: "createdTime desc",
        pageSize: 500,
      });

      const photos: Photo[] = (filesRes.data.files ?? []).map((f) => ({
        id: f.id!,
        url: toImageUrl(f.id!),
        name: f.name ?? "photo",
        width: f.imageMediaMetadata?.width ?? 1200,
        height: f.imageMediaMetadata?.height ?? 1600,
      }));

      const cat: Category = {
        id: folder.id!,
        slug: slugify(folder.name ?? "untitled"),
        name: folder.name ?? "Untitled",
        photos,
      };
      return cat;
    })
  );

  return categories;
}

/** Create a new category (= a new subfolder under the root folder). */
export async function createCategory(name: string): Promise<Category> {
  const drive = getDriveClient();
  const rootId = process.env.DRIVE_ROOT_FOLDER_ID;

  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType: FOLDER_MIME,
      parents: [rootId!],
    },
    fields: "id, name",
  });

  return { id: res.data.id!, slug: slugify(res.data.name ?? name), name: res.data.name ?? name, photos: [] };
}

/** Upload a photo into a category folder and make it publicly viewable. */
export async function uploadPhoto(
  categoryFolderId: string,
  fileName: string,
  mimeType: string,
  buffer: Buffer
): Promise<Photo> {
  const drive = getDriveClient();

  const { Readable } = await import("stream");
  const res = await drive.files.create({
    requestBody: { name: fileName, parents: [categoryFolderId] },
    media: { mimeType, body: Readable.from(buffer) },
    fields: "id, name, imageMediaMetadata",
  });

  const fileId = res.data.id!;

  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
  });

  return {
    id: fileId,
    url: toImageUrl(fileId),
    name: res.data.name ?? fileName,
    width: res.data.imageMediaMetadata?.width ?? 1200,
    height: res.data.imageMediaMetadata?.height ?? 1600,
  };
}

export async function deletePhoto(fileId: string): Promise<void> {
  const drive = getDriveClient();
  await drive.files.delete({ fileId });
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
