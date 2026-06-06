"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MODULES } from "@/lib/curriculum";
import ModuleCard from "@/components/ModuleCard";

interface P { moduleId: string; lessonId: string; completed: boolean; }

export default function LearnPage() {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<P[]>([]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/progress").then(r => r.json()).then(setProgress);
  }, [session]);

  const doneIn = (id: string) => progress.filter(p => p.moduleId === id && p.completed).length;

  return (
    <div style={{ maxWidth: "var(--container-base)", margin: "0 auto", padding: "48px 16px" }}>
      <div className="sl-rise" style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", fontWeight: "var(--fw-extrabold)", color: "var(--text-primary)", margin: "0 0 8px" }}>All Modules</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "var(--text-lg)" }}>Work through each module in order, or jump to any level.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "24px" }}>
        {MODULES.sort((a,b) => a.order-b.order).map((mod, i) => (
          <div key={mod.id} className="sl-rise" style={{ animationDelay: `${i*0.06}s` }}>
            <ModuleCard module={mod} completedLessons={doneIn(mod.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
