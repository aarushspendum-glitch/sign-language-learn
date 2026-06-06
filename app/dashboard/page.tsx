"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MODULES } from "@/lib/curriculum";

interface ProgressEntry { moduleId: string; lessonId: string; completed: boolean; score: number | null; }
interface DiagnosticResult { score: number; level: string; moduleStart: string; }

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
    ]).then(([prog, diag]) => { setProgress(prog); setDiagnostic(diag); setLoading(false); });
  }, [session]);

  if (status === "loading") return <Skeleton />;

  if (!session) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Sign in to view your dashboard</h1>
      <button onClick={() => signIn("google")} className="bg-teal-500 text-white font-semibold px-6 py-3 rounded-xl">Sign in with Google</button>
    </div>
  );

  const doneIn = (moduleId: string) => progress.filter((p) => p.moduleId === moduleId && p.completed).length;
  const totalDone = progress.filter((p) => p.completed).length;
  const totalLessons = MODULES.reduce((a, m) => a + m.lessons.length, 0);
  const overallPct = Math.round((totalDone / totalLessons) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Profile */}
      <div className="flex items-center gap-4 mb-10">
        <img src={session.user?.image ?? ""} alt="avatar" className="w-16 h-16 rounded-2xl border-2 border-teal-200 shadow-sm" />
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{session.user?.name}</h1>
          <p className="text-slate-400 text-sm">{session.user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Lessons Done", value: totalDone, color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Overall Progress", value: `${overallPct}%`, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Modules Started", value: MODULES.filter((m) => doneIn(m.id) > 0).length, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Diagnostic Score", value: diagnostic ? `${diagnostic.score}%` : "—", color: "text-rose-600", bg: "bg-rose-50" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 text-center">
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-slate-400 text-xs mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Diagnostic CTA */}
      {!diagnostic && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-amber-800">Haven't taken the diagnostic yet?</p>
            <p className="text-amber-600 text-sm">Find your level and jump to the right module.</p>
          </div>
          <Link href="/diagnostic" className="bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap transition-colors">
            Take Diagnostic →
          </Link>
        </div>
      )}

      {/* Modules */}
      <h2 className="text-xl font-bold text-slate-800 mb-5">Module Progress</h2>
      {loading ? <Skeleton /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((mod, i) => {
            const done = doneIn(mod.id);
            const pct = Math.round((done / mod.lessons.length) * 100);
            return (
              <motion.div key={mod.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{mod.thumbnail}</span>
                  <div>
                    <h3 className="font-semibold text-slate-800">{mod.title}</h3>
                    <p className="text-xs text-slate-400">{done}/{mod.lessons.length} lessons</p>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-teal-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <Link href={`/learn/${mod.id}`} className="text-teal-600 hover:text-teal-500 text-sm font-semibold transition-colors">
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

function Skeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-16 w-64 bg-slate-200 rounded-2xl mb-10" />
      <div className="grid grid-cols-4 gap-4 mb-10">{[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-200 rounded-2xl" />)}</div>
      <div className="grid sm:grid-cols-3 gap-5">{[1,2,3].map(i => <div key={i} className="h-32 bg-slate-200 rounded-2xl" />)}</div>
    </div>
  );
}
