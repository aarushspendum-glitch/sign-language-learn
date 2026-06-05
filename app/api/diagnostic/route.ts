import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStartingModule } from "@/lib/curriculum";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { score, total } = await req.json();
  const pct = Math.round((score / total) * 100);
  const level =
    pct >= 80 ? "intermediate" : pct >= 40 ? "beginner-advanced" : "beginner";
  const moduleStart = getStartingModule(pct);

  await prisma.diagnosticResult.upsert({
    where: { userId: session.user.id },
    update: { score: pct, level, moduleStart, takenAt: new Date() },
    create: { userId: session.user.id, score: pct, level, moduleStart },
  });

  return NextResponse.json({ score: pct, level, moduleStart });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await prisma.diagnosticResult.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(result ?? null);
}
