import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const progress = await prisma.progress.findMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json(progress);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { moduleId, lessonId, score, completed } = await req.json();

  if (!moduleId || !lessonId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const record = await prisma.progress.upsert({
    where: {
      userId_moduleId_lessonId: {
        userId: session.user.id,
        moduleId,
        lessonId,
      },
    },
    update: {
      score,
      completed,
      attempts: { increment: 1 },
      completedAt: completed ? new Date() : undefined,
      updatedAt: new Date(),
    },
    create: {
      userId: session.user.id,
      moduleId,
      lessonId,
      score,
      completed,
      attempts: 1,
      completedAt: completed ? new Date() : undefined,
    },
  });

  return NextResponse.json(record);
}
