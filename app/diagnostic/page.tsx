"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getDiagnosticSigns, getStartingModule } from "@/lib/curriculum";
import type { Sign } from "@/lib/curriculum";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const SignDetector = dynamic(() => import("@/components/SignDetector"), { ssr: false });

const DIAGNOSTIC_SIGNS: Sign[] = getDiagnosticSigns();

type Phase = "intro" | "test" | "results";

export default function DiagnosticPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    level: string;
    moduleStart: string;
  } | null>(null);

  const total = DIAGNOSTIC_SIGNS.length;
  const currentSign: Sign = DIAGNOSTIC_SIGNS[currentIdx];

  const handleSuccess = useCallback(async () => {
    const newCorrect = correctCount + 1;
    setCorrectCount(newCorrect);

    if (currentIdx + 1 >= total) {
      await finish(newCorrect);
    } else {
      setTimeout(() => setCurrentIdx((i) => i + 1), 600);
    }
  }, [correctCount, currentIdx, total]);

  const skip = async () => {
    if (currentIdx + 1 >= total) {
      await finish(correctCount);
    } else {
      setCurrentIdx((i) => i + 1);
    }
  };

  const finish = async (correct: number) => {
    const score = Math.round((correct / total) * 100);
    const moduleStart = getStartingModule(score);

    setSaving(true);
    if (session) {
      const res = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: correct, total }),
      });
      const data = await res.json();
      setResult(data);
    } else {
      setResult({
        score,
        level: score >= 80 ? "intermediate" : score >= 40 ? "beginner-advanced" : "beginner",
        moduleStart,
      });
    }
    setSaving(false);
    setPhase("results");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <span className="text-6xl block mb-4">🎯</span>
            <h1 className="text-4xl font-extrabold mb-4">Diagnostic Test</h1>
            <p className="text-slate-400 text-lg mb-8">
              We'll show you {total} signs. Show each one with your camera as best you can. Your results
              will tell us where to place you in the curriculum — no pressure!
            </p>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-left mb-8">
              <h2 className="font-semibold mb-3">Signs in this test:</h2>
              <div className="flex flex-wrap gap-2">
                {DIAGNOSTIC_SIGNS.map((s) => (
                  <span key={s.id} className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm">
                    {s.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setPhase("test")}
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-2xl text-lg"
              >
                Start Test
              </button>
              <Link
                href="/learn"
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold px-8 py-4 rounded-2xl text-lg text-center"
              >
                Skip — Start from Beginning
              </Link>
            </div>
          </motion.div>
        )}

        {phase === "test" && (
          <motion.div
            key={`test-${currentIdx}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-full">
              <div className="flex justify-between text-sm text-slate-400 mb-1">
                <span>Question {currentIdx + 1} of {total}</span>
                <span>{correctCount} correct so far</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${(currentIdx / total) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-center">
              <p className="text-slate-400 text-sm mb-1">Show this sign:</p>
              <h2 className="text-6xl font-extrabold text-emerald-400">{currentSign.label}</h2>
              <p className="text-slate-300 mt-2 text-sm">{currentSign.description}</p>
            </div>

            <SignDetector
              expectedSign={currentSign.id}
              onSuccess={handleSuccess}
            />

            <button
              onClick={skip}
              className="text-slate-500 hover:text-slate-300 text-sm underline underline-offset-2"
            >
              Skip / Don't know
            </button>
          </motion.div>
        )}

        {phase === "results" && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">
              {result.score >= 70 ? "🌟" : result.score >= 40 ? "👍" : "🌱"}
            </div>
            <h1 className="text-3xl font-extrabold mb-2">Diagnostic Complete!</h1>
            <p className="text-slate-400 mb-6">
              Score: <span className="text-white font-bold">{result.score}%</span> · Level:{" "}
              <span className="text-emerald-400 font-bold capitalize">{result.level}</span>
            </p>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8">
              <p className="text-slate-400 text-sm mb-2">We recommend starting at:</p>
              <p className="text-2xl font-bold text-emerald-400 capitalize">
                {result.moduleStart.replace("-", " ")} Module
              </p>
              {!session && (
                <p className="text-slate-500 text-xs mt-3">
                  Sign in with Google to save this result and track future progress.
                </p>
              )}
            </div>

            <Link
              href={`/learn/${result.moduleStart}`}
              className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all"
            >
              Go to Recommended Module →
            </Link>
          </motion.div>
        )}

        {saving && (
          <motion.div
            key="saving"
            className="fixed inset-0 bg-black/50 flex items-center justify-center"
          >
            <div className="bg-slate-800 rounded-2xl p-8 text-center">
              <div className="animate-spin h-10 w-10 border-b-2 border-emerald-400 rounded-full mx-auto mb-4" />
              <p>Saving results…</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
