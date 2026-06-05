"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Module } from "@/lib/curriculum";

interface Props {
  module: Module;
  completedLessons: number;
  locked?: boolean;
}

const levelColors = {
  beginner: "text-emerald-400 bg-emerald-400/10",
  intermediate: "text-yellow-400 bg-yellow-400/10",
  advanced: "text-red-400 bg-red-400/10",
};

export default function ModuleCard({ module, completedLessons, locked = false }: Props) {
  const total = module.lessons.length;
  const pct = total > 0 ? Math.round((completedLessons / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={locked ? {} : { scale: 1.02 }}
      className={`relative bg-slate-800 border rounded-2xl p-6 flex flex-col gap-4 transition-all ${
        locked
          ? "border-slate-700 opacity-60 cursor-not-allowed"
          : "border-slate-700 hover:border-slate-500 cursor-pointer"
      }`}
    >
      {locked && (
        <div className="absolute top-4 right-4 text-slate-500 text-xl">🔒</div>
      )}

      <div className="flex items-start gap-4">
        <span className="text-4xl">{module.thumbnail}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelColors[module.level]}`}>
              {module.level}
            </span>
          </div>
          <h3 className="font-bold text-white text-lg leading-tight">{module.title}</h3>
          <p className="text-slate-400 text-sm mt-1 line-clamp-2">{module.description}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>{completedLessons} / {total} lessons</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {!locked && (
        <Link
          href={`/learn/${module.id}`}
          className="mt-1 w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
        >
          {pct === 0 ? "Start Module" : pct === 100 ? "Review Module" : "Continue"}
        </Link>
      )}
    </motion.div>
  );
}
