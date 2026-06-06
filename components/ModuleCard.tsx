"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Module } from "@/lib/curriculum";

interface Props {
  module: Module;
  completedLessons: number;
  locked?: boolean;
}

const levelBadge = {
  beginner:     "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced:     "bg-rose-100 text-rose-700",
};

const progressColor = {
  beginner:     "bg-emerald-400",
  intermediate: "bg-amber-400",
  advanced:     "bg-rose-400",
};

export default function ModuleCard({ module, completedLessons, locked = false }: Props) {
  const total = module.lessons.length;
  const pct = total > 0 ? Math.round((completedLessons / total) * 100) : 0;

  return (
    <motion.div
      whileHover={locked ? {} : { y: -4 }}
      className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-card flex flex-col gap-4 transition-all ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl flex-shrink-0 border border-slate-100">
          {module.thumbnail}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelBadge[module.level]}`}>
              {module.level}
            </span>
            {pct === 100 && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">✓ Done</span>}
          </div>
          <h3 className="font-bold text-slate-800 text-base leading-tight">{module.title}</h3>
          <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">{module.description}</p>
        </div>
        {locked && <span className="text-slate-300 text-xl">🔒</span>}
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>{completedLessons}/{total} lessons</span>
          <span className="font-semibold text-slate-600">{pct}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${progressColor[module.level]}`}
          />
        </div>
      </div>

      {/* CTA */}
      {!locked && (
        <Link
          href={`/learn/${module.id}`}
          className="w-full text-center bg-slate-900 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
        >
          {pct === 0 ? "Start Module →" : pct === 100 ? "Review →" : "Continue →"}
        </Link>
      )}
    </motion.div>
  );
}
