"use client";

import { useParams } from "next/navigation";
import { getModule } from "@/lib/curriculum";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

interface ProgressEntry {
  lessonId: string;
  completed: boolean;
  score: number | null;
}

export default function ModulePage() {
  const params = useParams();
  const moduleId = params.moduleId as string;
  const mod = getModule(moduleId);
  const { data: session } = useSession();
  const [progress, setProgress] = useState<ProgressEntry[]>([]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/progress")
      .then((r) => r.json())
      .then((all: any[]) =>
        setProgress(all.filter((p) => p.moduleId === moduleId))
      );
  }, [session, moduleId]);

  if (!mod) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Module not found</h1>
        <Link href="/learn" className="text-emerald-400">← Back to modules</Link>
      </div>
    );
  }

  const lessonProgress = (lessonId: string) =>
    progress.find((p) => p.lessonId === lessonId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/learn" className="text-slate-400 hover:text-white text-sm mb-6 inline-block">
        ← Back to modules
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-5xl">{mod.thumbnail}</span>
          <div>
            <h1 className="text-3xl font-extrabold">{mod.title}</h1>
            <p className="text-slate-400 text-sm capitalize">{mod.level} · {mod.lessons.length} lessons</p>
          </div>
        </div>
        <p className="text-slate-400 mb-10">{mod.description}</p>
      </motion.div>

      <div className="flex flex-col gap-4">
        {mod.lessons.map((lesson, i) => {
          const lp = lessonProgress(lesson.id);
          const done = lp?.completed;
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  done ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-300"
                }`}>
                  {done ? "✓" : i + 1}
                </div>
                <div>
                  <h3 className="font-semibold">{lesson.title}</h3>
                  <p className="text-slate-400 text-xs">
                    {lesson.signs.length} signs
                    {lp?.score != null && ` · Last score: ${lp.score}%`}
                  </p>
                </div>
              </div>
              <Link
                href={`/learn/${moduleId}/${lesson.id}`}
                className={`text-sm font-semibold px-5 py-2 rounded-xl transition-colors ${
                  done
                    ? "bg-slate-700 hover:bg-slate-600 text-white"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                {done ? "Review" : "Start"}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
