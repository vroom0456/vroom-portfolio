import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { uploadPhoto, deletePhoto, isDriveConfigured } from "@/lib/drive";

function requireSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function POST(req: NextRequest) {
  if (!requireSession(req)) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!isDriveConfigured()) {
    return NextResponse.json(
      { error: "Connect Google Drive first — see SETUP.md." },
      { status: 400 }
    );
  }

  const form = await req.formData();
  const categoryId = form.get("categoryId");
  const file = form.get("file");

  if (typeof categoryId !== "string" || !categoryId) {
    return NextResponse.json({ error: "Missing categoryId." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const photo = await uploadPhoto(categoryId, file.name, file.type, buffer);
  return NextResponse.json({ photo });
}

export async function DELETE(req: NextRequest) {
  if (!requireSession(req)) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!isDriveConfigured()) {
    return NextResponse.json(
      { error: "Connect Google Drive first — see SETUP.md." },
      { status: 400 }
    );
  }

  const { fileId } = await req.json().catch(() => ({ fileId: "" }));
  if (typeof fileId !== "string" || !fileId) {
    return NextResponse.json({ error: "Missing fileId." }, { status: 400 });
  }

  await deletePhoto(fileId);
  return NextResponse.json({ ok: true });
}
