"use client";
import { useParams } from "next/navigation";
import { getModule } from "@/lib/curriculum";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface P { lessonId: string; completed: boolean; score: number | null; }

const HUE: Record<string, { fg: string; bg: string }> = {
  emerald: { fg: "var(--mod-emerald)", bg: "var(--mod-emerald-bg)" },
  sky:     { fg: "var(--mod-sky)",     bg: "var(--mod-sky-bg)" },
  amber:   { fg: "var(--mod-amber)",   bg: "var(--mod-amber-bg)" },
  violet:  { fg: "var(--mod-violet)",  bg: "var(--mod-violet-bg)" },
  coral:   { fg: "var(--mod-coral)",   bg: "var(--mod-coral-bg)" },
};

export default function ModulePage() {
  const { moduleId } = useParams() as { moduleId: string };
  const mod = getModule(moduleId);
  const { data: session } = useSession();
  const [progress, setProgress] = useState<P[]>([]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/progress").then(r => r.json()).then((all: any[]) => setProgress(all.filter(p => p.moduleId === moduleId)));
  }, [session, moduleId]);

  if (!mod) return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h1 style={{ fontFamily: "var(--font-display)", marginBottom: "16px" }}>Module not found</h1>
      <Link href="/learn" style={{ color: "var(--accent-text)" }}>← Back to modules</Link>
    </div>
  );

  const hue = HUE[mod.accent] ?? HUE.emerald;
  const lp = (id: string) => progress.find(p => p.lessonId === id);
  const doneCount = progress.filter(p => p.completed).length;
  const pct = Math.round((doneCount / mod.lessons.length) * 100);

  return (
    <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto", padding: "48px 16px" }}>
      <Link href="/learn" style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", display: "inline-block", marginBottom: "24px", textDecoration: "none" }}>
        ← Back to modules
      </Link>

      <div className="sl-rise" style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
          <span style={{ width: "64px", height: "64px", borderRadius: "var(--radius-lg)", background: hue.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", flexShrink: 0 }}>{mod.thumbnail}</span>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", fontWeight: "var(--fw-extrabold)", color: "var(--text-primary)", margin: 0 }}>{mod.title}</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", margin: "2px 0 0", textTransform: "capitalize" }}>{mod.level} · {mod.lessons.length} lessons</p>
          </div>
        </div>
        <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>{mod.description}</p>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ flex: 1, height: "8px", background: "var(--surface-track)", borderRadius: "var(--radius-pill)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: hue.fg, borderRadius: "var(--radius-pill)", transition: "width var(--dur-slow) var(--ease-out)" }} />
          </div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontWeight: "var(--fw-semibold)", whiteSpace: "nowrap" }}>{doneCount}/{mod.lessons.length} done</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {mod.lessons.map((lesson, i) => {
          const p = lp(lesson.id);
          const done = p?.completed;
          return (
            <div key={lesson.id} className="sl-rise" style={{ animationDelay: `${i*0.06}s`, background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "var(--radius-pill)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-sm)", fontWeight: "var(--fw-bold)", flexShrink: 0, background: done ? "var(--accent)" : "var(--surface-track)", color: done ? "var(--white)" : "var(--text-secondary)" }}>
                  {done ? "✓" : i + 1}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", color: "var(--text-primary)" }}>{lesson.title}</h3>
                  <p style={{ margin: "2px 0 0", color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>
                    {lesson.signs.length} signs{p?.score != null ? ` · Last: ${p.score}%` : ""}
                  </p>
                </div>
              </div>
              <Link
                href={`/learn/${moduleId}/${lesson.id}`}
                style={{
                  fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "var(--text-sm)",
                  padding: "8px 18px", borderRadius: "var(--radius-pill)", textDecoration: "none", whiteSpace: "nowrap",
                  background: done ? "var(--surface-inset)" : "var(--accent)",
                  color: done ? "var(--text-secondary)" : "var(--text-on-accent)",
                  border: done ? "1px solid var(--border-default)" : "none",
                  boxShadow: done ? "none" : "var(--shadow-accent)",
                }}
              >
                {done ? "Review" : "Start"}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
