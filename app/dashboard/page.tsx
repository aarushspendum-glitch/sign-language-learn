"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MODULES } from "@/lib/curriculum";

interface ProgressEntry {
  moduleId: string;
  lessonId: string;
  completed: boolean;
  score: number | null;
}

interface DiagnosticResult {
  score: number;
  level: string;
  moduleStart: string;
  takenAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    Promise.all([
      fetch("/api/progress").then((r) => r.json()),
      fetch("/api/diagnostic").then((r) => r.json()),
    ]).then(([prog, diag]) => {
      setProgress(prog);
      setDiagnostic(diag);
      setLoading(false);
    });
  }, [session]);

  if (status === "loading") return <LoadingSkeleton />;

  if (!session) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Sign in to view your dashboard</h1>
        <button
          onClick={() => signIn("google")}
          className="bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  const completedByModule = (moduleId: string) =>
    progress.filter((p) => p.moduleId === moduleId && p.completed).length;

  const totalCompleted = progress.filter((p) => p.completed).length;
  const totalLessons = MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const overallPct = Math.round((totalCompleted / totalLessons) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-10">
        <img
          src={session.user?.image ?? "/avatar.svg"}
          alt="avatar"
          className="w-16 h-16 rounded-full border-2 border-emerald-500"
        />
        <div>
          <h1 className="text-2xl font-bold">{session.user?.name}</h1>
          <p className="text-slate-400 text-sm">{session.user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Lessons Done", value: totalCompleted },
          { label: "Overall Progress", value: `${overallPct}%` },
          { label: "Modules Started", value: MODULES.filter((m) => completedByModule(m.id) > 0).length },
          { label: "Diagnostic Score", value: diagnostic ? `${diagnostic.score}%` : "—" },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-emerald-400">{stat.value}</p>
            <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Diagnostic banner */}
      {!diagnostic && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5 mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-yellow-300">Haven't taken the diagnostic yet?</p>
            <p className="text-slate-400 text-sm">Find your level and jump to the right module.</p>
          </div>
          <Link
            href="/diagnostic"
            className="bg-yellow-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap"
          >
            Take Diagnostic
          </Link>
        </div>
      )}

      {/* Module progress */}
      <h2 className="text-xl font-bold mb-5">Module Progress</h2>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((mod, i) => {
            const done = completedByModule(mod.id);
            const pct = Math.round((done / mod.lessons.length) * 100);
            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{mod.thumbnail}</span>
                  <div>
                    <h3 className="font-semibold">{mod.title}</h3>
                    <p className="text-xs text-slate-400">{done}/{mod.lessons.length} lessons</p>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <Link
                  href={`/learn/${mod.id}`}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                >
                  {pct === 0 ? "Start →" : pct === 100 ? "Review →" : "Continue →"}
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-16 w-64 bg-slate-800 rounded-2xl mb-10" />
      <div className="grid grid-cols-4 gap-4 mb-10">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-slate-800 rounded-2xl" />)}
      </div>
      <div className="grid sm:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-slate-800 rounded-2xl" />)}
      </div>
    </div>
  );
}
