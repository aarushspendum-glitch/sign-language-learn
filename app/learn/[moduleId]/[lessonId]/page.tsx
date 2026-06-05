"use client";

import { useParams, useRouter } from "next/navigation";
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
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;
  const lessonId = params.lessonId as string;

  const mod = getModule(moduleId);
  const lesson = getLesson(moduleId, lessonId);
  const { data: session } = useSession();

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentSignIdx, setCurrentSignIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [detectedSign, setDetectedSign] = useState<string | null>(null);

  const saveProgress = useCallback(
    async (score: number, completed: boolean) => {
      if (!session) return;
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, lessonId, score, completed }),
      });
    },
    [session, moduleId, lessonId]
  );

  if (!lesson || !mod) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
        <Link href="/learn" className="text-emerald-400">← Back</Link>
      </div>
    );
  }

  const currentSign: Sign = lesson.signs[currentSignIdx];
  const totalSigns = lesson.signs.length;

  const handleSignSuccess = useCallback(() => {
    const newCorrect = correctCount + 1;
    setCorrectCount(newCorrect);

    if (currentSignIdx + 1 >= totalSigns) {
      const score = Math.round((newCorrect / totalSigns) * 100);
      saveProgress(score, score >= lesson.passingScore);
      setPhase("complete");
    } else {
      setTimeout(() => setCurrentSignIdx((i) => i + 1), 600);
    }
  }, [correctCount, currentSignIdx, totalSigns, lesson.passingScore, saveProgress]);

  const skip = () => {
    if (currentSignIdx + 1 >= totalSigns) {
      const score = Math.round((correctCount / totalSigns) * 100);
      saveProgress(score, score >= lesson.passingScore);
      setPhase("complete");
    } else {
      setCurrentSignIdx((i) => i + 1);
    }
  };

  const finalScore = Math.round((correctCount / totalSigns) * 100);
  const passed = finalScore >= lesson.passingScore;

  // Find next lesson
  const lessonIdx = mod.lessons.findIndex((l) => l.id === lessonId);
  const nextLesson = mod.lessons[lessonIdx + 1];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/learn/${moduleId}`}
          className="text-slate-400 hover:text-white text-sm"
        >
          ← {mod.title}
        </Link>
        <span className="text-slate-500 text-sm">
          {currentSignIdx + 1} / {totalSigns}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-800 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${((currentSignIdx) / totalSigns) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <h1 className="text-3xl font-extrabold mb-2">{lesson.title}</h1>
            <p className="text-slate-400 mb-8">{lesson.description}</p>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 mb-8 text-left">
              <h2 className="font-bold text-lg mb-4">Signs you'll practice:</h2>
              <div className="grid grid-cols-2 gap-3">
                {lesson.signs.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 bg-slate-700/50 rounded-xl p-3">
                    <span className="text-2xl font-bold text-emerald-400 w-10 text-center">{s.label}</span>
                    <span className="text-slate-300 text-sm">{s.description}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setPhase("practice")}
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all"
            >
              Start Practice →
            </button>
          </motion.div>
        )}

        {phase === "practice" && (
          <motion.div
            key={`sign-${currentSignIdx}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-1">Show this sign:</p>
              <h2 className="text-6xl font-extrabold text-emerald-400">{currentSign.label}</h2>
              <p className="text-slate-300 mt-2">{currentSign.description}</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 w-full max-w-lg">
              <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Tips</h3>
              <ul className="space-y-1">
                {currentSign.tips.map((t, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span> {t}
                  </li>
                ))}
              </ul>
            </div>

            <SignDetector
              expectedSign={currentSign.id}
              onSuccess={handleSignSuccess}
              onDetected={setDetectedSign}
            />

            <button
              onClick={skip}
              className="text-slate-500 hover:text-slate-300 text-sm underline underline-offset-2 transition-colors"
            >
              Skip this sign
            </button>
          </motion.div>
        )}

        {phase === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-7xl mb-4">{passed ? "🎉" : "💪"}</div>
            <h1 className="text-3xl font-extrabold mb-2">
              {passed ? "Lesson Complete!" : "Keep Practicing!"}
            </h1>
            <p className="text-slate-400 mb-8">
              You got {correctCount}/{totalSigns} signs correct — {finalScore}%
              {passed
                ? ` · Passed! (required ${lesson.passingScore}%)`
                : ` · Need ${lesson.passingScore}% to pass`}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setPhase("practice");
                  setCurrentSignIdx(0);
                  setCorrectCount(0);
                }}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-8 py-3 rounded-2xl transition-all"
              >
                Try Again
              </button>
              {nextLesson ? (
                <Link
                  href={`/learn/${moduleId}/${nextLesson.id}`}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-3 rounded-2xl transition-all"
                >
                  Next Lesson →
                </Link>
              ) : (
                <Link
                  href={`/learn/${moduleId}`}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-3 rounded-2xl transition-all"
                >
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
