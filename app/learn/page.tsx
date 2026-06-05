"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MODULES } from "@/lib/curriculum";
import ModuleCard from "@/components/ModuleCard";
import { motion } from "framer-motion";

interface ProgressEntry {
  moduleId: string;
  lessonId: string;
  completed: boolean;
}

export default function LearnPage() {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<ProgressEntry[]>([]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/progress")
      .then((r) => r.json())
      .then(setProgress);
  }, [session]);

  const completedIn = (moduleId: string) =>
    progress.filter((p) => p.moduleId === moduleId && p.completed).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-extrabold mb-2">All Modules</h1>
        <p className="text-slate-400 mb-8">
          Work through each module in order, or jump to any level.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.sort((a, b) => a.order - b.order).map((mod, i) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <ModuleCard
              module={mod}
              completedLessons={completedIn(mod.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
