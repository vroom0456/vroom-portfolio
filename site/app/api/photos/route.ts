import { NextResponse } from "next/server";
import { getGalleryData } from "@/lib/data";

export const revalidate = 60; // re-check Drive at most once a minute

export async function GET() {
  const data = await getGalleryData();
  return NextResponse.json(data);
}
