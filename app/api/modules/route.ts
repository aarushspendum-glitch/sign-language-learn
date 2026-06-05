import { NextResponse } from "next/server";
import { MODULES } from "@/lib/curriculum";

export async function GET() {
  return NextResponse.json(MODULES);
}
