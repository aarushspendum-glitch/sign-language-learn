"use client";

import { useParams } from "next/navigation";
import { getModule } from "@/lib/curriculum";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

interface ProgressEntry { lessonId: string; completed: boolean; score: number | null; }

export default function ModulePage() {
  const { moduleId } = useParams() as { moduleId: string };
  const mod = getModule(moduleId);
  const { data: session } = useSession();
  const [progress, setProgress] = useState<ProgressEntry[]>([]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/progress")
      .then((r) => r.json())
      .then((all: any[]) => setProgress(all.filter((p) => p.moduleId === moduleId)));
  }, [session, moduleId]);

  if (!mod) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Module not found</h1>
      <Link href="/learn" className="text-teal-600">← Back to modules</Link>
    </div>
  );

  const lp = (id: string) => progress.find((p) => p.lessonId === id);
  const doneCount = progress.filter((p) => p.completed).length;
  const pct = Math.round((doneCount / mod.lessons.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/learn" className="inline-flex items-center gap-1 text-slate-400 hover:text-teal-600 text-sm mb-8 transition-colors">
        ← All Modules
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-4xl">
            {mod.thumbnail}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">{mod.title}</h1>
            <p className="text-slate-400 text-sm capitalize">{mod.level} · {mod.lessons.length} lessons</p>
          </div>
        </div>
        <p className="text-slate-500 mb-4">{mod.description}</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-sm font-semibold text-slate-500">{doneCount}/{mod.lessons.length} done</span>
        </div>
      </motion.div>

      <div className="flex flex-col gap-3">
        {mod.lessons.map((lesson, i) => {
          const p = lp(lesson.id);
          const done = p?.completed;
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  done ? "bg-teal-100 text-teal-600" : "bg-slate-100 text-slate-500"
                }`}>
                  {done ? "✓" : i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{lesson.title}</h3>
                  <p className="text-slate-400 text-xs">
                    {lesson.signs.length} signs{p?.score != null && ` · Last score: ${p.score}%`}
                  </p>
                </div>
              </div>
              <Link
                href={`/learn/${moduleId}/${lesson.id}`}
                className={`text-sm font-semibold px-5 py-2 rounded-xl transition-colors whitespace-nowrap ${
                  done
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    : "bg-teal-500 hover:bg-teal-400 text-white shadow-sm shadow-teal-100"
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
