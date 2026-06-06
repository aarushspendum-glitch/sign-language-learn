"use client";

import { useParams } from "next/navigation";
import { getLesson, getModule } from "@/lib/curriculum";
import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Sign } from "@/lib/curriculum";

const SignDetector = dynamic(() => import("@/components/SignDetector"), { ssr: false });

type Phase = "intro" | "practice" | "complete";

export default function LessonPage() {
  const { moduleId, lessonId } = useParams() as { moduleId: string; lessonId: string };
  const mod = getModule(moduleId);
  const lesson = getLesson(moduleId, lessonId);
  const { data: session } = useSession();

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const saveProgress = useCallback(async (score: number, completed: boolean) => {
    if (!session) return;
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, lessonId, score, completed }),
    });
  }, [session, moduleId, lessonId]);

  if (!lesson || !mod) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
      <Link href="/learn" className="text-teal-600">← Back</Link>
    </div>
  );

  const sign: Sign = lesson.signs[currentIdx];
  const total = lesson.signs.length;

  const handleSuccess = useCallback(() => {
    const next = correctCount + 1;
    setCorrectCount(next);
    if (currentIdx + 1 >= total) {
      const score = Math.round((next / total) * 100);
      saveProgress(score, score >= lesson.passingScore);
      setPhase("complete");
    } else {
      setTimeout(() => setCurrentIdx((i) => i + 1), 500);
    }
  }, [correctCount, currentIdx, total, lesson.passingScore, saveProgress]);

  const skip = () => {
    if (currentIdx + 1 >= total) {
      const score = Math.round((correctCount / total) * 100);
      saveProgress(score, score >= lesson.passingScore);
      setPhase("complete");
    } else {
      setCurrentIdx((i) => i + 1);
    }
  };

  const score = Math.round((correctCount / total) * 100);
  const passed = score >= lesson.passingScore;
  const lessonIdx = mod.lessons.findIndex((l) => l.id === lessonId);
  const nextLesson = mod.lessons[lessonIdx + 1];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <Link href={`/learn/${moduleId}`} className="text-slate-400 hover:text-teal-600 text-sm transition-colors">
          ← {mod.title}
        </Link>
        <span className="text-sm text-slate-400 font-medium">{currentIdx + 1} / {total}</span>
      </div>

      {/* Progress */}
      <div className="h-2 bg-slate-100 rounded-full mb-10 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-teal-400 to-indigo-400 rounded-full"
          animate={{ width: `${(currentIdx / total) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {/* INTRO */}
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{lesson.title}</h1>
            <p className="text-slate-500 mb-8">{lesson.description}</p>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-8 text-left">
              <h2 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Signs in this lesson</h2>
              <div className="grid grid-cols-2 gap-3">
                {lesson.signs.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <span className="text-2xl font-extrabold text-teal-500 w-10 text-center flex-shrink-0">{s.label}</span>
                    <span className="text-slate-600 text-sm leading-snug">{s.description}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setPhase("practice")}
              className="bg-teal-500 hover:bg-teal-400 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-teal-100"
            >
              Start Practice →
            </button>
          </motion.div>
        )}

        {/* PRACTICE */}
        {phase === "practice" && (
          <motion.div key={`sign-${currentIdx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex flex-col items-center gap-6">
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-1 font-medium">Show this sign:</p>
              <div className="text-7xl font-extrabold text-transparent bg-gradient-to-r from-teal-500 to-indigo-500 bg-clip-text mb-2">
                {sign.label}
              </div>
              <p className="text-slate-600 max-w-xs mx-auto text-sm">{sign.description}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 w-full max-w-lg">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tips</p>
              <ul className="space-y-1.5">
                {sign.tips.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-teal-400 mt-0.5 font-bold">•</span>{t}
                  </li>
                ))}
              </ul>
            </div>

            <SignDetector expectedSign={sign.id} onSuccess={handleSuccess} />

            <button onClick={skip} className="text-slate-400 hover:text-slate-600 text-sm underline underline-offset-2 transition-colors">
              Skip this sign
            </button>
          </motion.div>
        )}

        {/* COMPLETE */}
        {phase === "complete" && (
          <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="text-7xl mb-4">{passed ? "🎉" : "💪"}</div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{passed ? "Lesson Complete!" : "Keep Going!"}</h1>
            <p className="text-slate-500 mb-2">
              {correctCount}/{total} signs correct — <span className="font-bold text-slate-700">{score}%</span>
            </p>
            <p className="text-slate-400 text-sm mb-10">
              {passed ? `✅ Passed! (required ${lesson.passingScore}%)` : `Need ${lesson.passingScore}% to pass`}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => { setPhase("practice"); setCurrentIdx(0); setCorrectCount(0); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-8 py-3 rounded-2xl transition-all"
              >
                Try Again
              </button>
              {nextLesson ? (
                <Link href={`/learn/${moduleId}/${nextLesson.id}`} className="bg-teal-500 hover:bg-teal-400 text-white font-bold px-8 py-3 rounded-2xl transition-all shadow-lg shadow-teal-100">
                  Next Lesson →
                </Link>
              ) : (
                <Link href={`/learn/${moduleId}`} className="bg-teal-500 hover:bg-teal-400 text-white font-bold px-8 py-3 rounded-2xl transition-all shadow-lg shadow-teal-100">
                  Back to Module →
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
