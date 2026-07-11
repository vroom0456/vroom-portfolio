import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { createCategory, isDriveConfigured } from "@/lib/drive";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  if (!isDriveConfigured()) {
    return NextResponse.json(
      { error: "Connect Google Drive first — see SETUP.md." },
      { status: 400 }
    );
  }

  const { name } = await req.json().catch(() => ({ name: "" }));
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Category name is required." }, { status: 400 });
  }

  const category = await createCategory(name.trim());
  return NextResponse.json({ category });
}
