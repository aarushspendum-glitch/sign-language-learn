"use client";
import { useParams } from "next/navigation";
import { getLesson, getModule } from "@/lib/curriculum";
import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Sign } from "@/lib/curriculum";

const SignDetector = dynamic(() => import("@/components/SignDetector"), { ssr: false });
type Phase = "intro" | "practice" | "complete";

export default function LessonPage() {
  const { moduleId, lessonId } = useParams() as { moduleId: string; lessonId: string };
  const mod = getModule(moduleId);
  const lesson = getLesson(moduleId, lessonId);
  const { data: session } = useSession();
  const [phase, setPhase] = useState<Phase>("intro");
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);

  const save = useCallback(async (score: number, completed: boolean) => {
    if (!session) return;
    await fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ moduleId, lessonId, score, completed }) });
  }, [session, moduleId, lessonId]);

  if (!lesson || !mod) return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h1 style={{ fontFamily: "var(--font-display)", marginBottom: "16px" }}>Lesson not found</h1>
      <Link href="/learn" style={{ color: "var(--accent-text)" }}>← Back</Link>
    </div>
  );

  const sign: Sign = lesson.signs[idx];
  const total = lesson.signs.length;

  const handleSuccess = useCallback(() => {
    const next = correct + 1;
    setCorrect(next);
    if (idx + 1 >= total) { save(Math.round((next/total)*100), Math.round((next/total)*100) >= lesson.passingScore); setPhase("complete"); }
    else setTimeout(() => setIdx(i => i+1), 500);
  }, [correct, idx, total, lesson.passingScore, save]);

  const skip = () => {
    if (idx + 1 >= total) { save(Math.round((correct/total)*100), Math.round((correct/total)*100) >= lesson.passingScore); setPhase("complete"); }
    else setIdx(i => i+1);
  };

  const score = Math.round((correct/total)*100);
  const passed = score >= lesson.passingScore;
  const lessonIdx = mod.lessons.findIndex(l => l.id === lessonId);
  const nextLesson = mod.lessons[lessonIdx+1];

  return (
    <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto", padding: "40px 16px" }}>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <Link href={`/learn/${moduleId}`} style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textDecoration: "none" }}>← {mod.title}</Link>
        <span style={{ color: "var(--text-faint)", fontSize: "var(--text-sm)" }}>{Math.min(idx+1,total)} / {total}</span>
      </div>

      {/* Progress track */}
      <div style={{ height: "6px", background: "var(--surface-track)", borderRadius: "var(--radius-pill)", overflow: "hidden", marginBottom: "40px" }}>
        <div style={{ height: "100%", width: `${(idx/total)*100}%`, background: "var(--accent)", borderRadius: "var(--radius-pill)", transition: "width var(--dur-slow) var(--ease-out)" }} />
      </div>

      {/* INTRO */}
      {phase === "intro" && (
        <div className="sl-rise" style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", fontWeight: "var(--fw-extrabold)", color: "var(--text-primary)", margin: "0 0 8px" }}>{lesson.title}</h1>
          <p style={{ color: "var(--text-muted)", margin: "0 0 32px" }}>Signs you'll practice in this lesson.</p>
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "24px", textAlign: "left", marginBottom: "32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", boxShadow: "var(--shadow-sm)" }}>
            {lesson.signs.map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "12px", background: "var(--accent-soft)", borderRadius: "var(--radius-md)", padding: "12px" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h3)", fontWeight: "var(--fw-bold)", color: "var(--accent-text)", minWidth: "32px", textAlign: "center" }}>{s.label}</span>
                <span style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>{s.description}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setPhase("practice")} style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "18px", color: "var(--text-on-accent)", background: "var(--accent)", padding: "15px 36px", borderRadius: "var(--radius-pill)", border: "none", cursor: "pointer", boxShadow: "var(--shadow-accent)" }}>
            Start Practice →
          </button>
        </div>
      )}

      {/* PRACTICE */}
      {phase === "practice" && (
        <div key={idx} className="sl-slide" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
          {/* Sign prompt */}
          <div style={{ textAlign: "center", width: "100%" }}>
            <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>Show this sign:</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-sign)", fontWeight: "var(--fw-black)", color: "var(--accent-text)", lineHeight: 0.95, margin: "4px 0 8px" }}>{sign.label}</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-base)", margin: 0 }}>{sign.description}</p>
          </div>

          {/* Tips */}
          {sign.tips.length > 0 && (
            <div style={{ width: "100%", maxWidth: "32rem", background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "16px", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ margin: "0 0 8px", fontSize: "var(--text-xs)", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "var(--ls-wide)", fontWeight: "var(--fw-semibold)" }}>Tips</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "4px" }}>
                {sign.tips.map((t,i) => (
                  <li key={i} style={{ display: "flex", gap: "8px", fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    <span style={{ color: "var(--accent-text)", marginTop: "1px" }}>•</span><span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <SignDetector expectedSign={sign.id} onSuccess={handleSuccess} />

          <button onClick={skip} style={{ color: "var(--text-faint)", fontSize: "var(--text-sm)", textDecoration: "underline", textUnderlineOffset: "2px", background: "none", border: "none", cursor: "pointer" }}>
            Skip this sign
          </button>
        </div>
      )}

      {/* COMPLETE */}
      {phase === "complete" && (
        <div className="sl-pop" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "72px", marginBottom: "16px" }}>{passed ? "🎉" : "💪"}</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", fontWeight: "var(--fw-extrabold)", color: "var(--text-primary)", margin: "0 0 8px" }}>
            {passed ? "Lesson Complete!" : "Keep Practicing!"}
          </h1>
          <p style={{ color: "var(--text-muted)", margin: "0 0 4px" }}>You got {correct}/{total} signs correct — <strong>{score}%</strong></p>
          <p style={{ color: "var(--text-faint)", fontSize: "var(--text-sm)", margin: "0 0 40px" }}>
            {passed ? `✅ Passed! (required ${lesson.passingScore}%)` : `Need ${lesson.passingScore}% to pass`}
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => { setPhase("practice"); setIdx(0); setCorrect(0); }}
              style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "var(--text-base)", color: "var(--text-primary)", background: "var(--white)", padding: "11px 24px", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-strong)", cursor: "pointer", boxShadow: "var(--shadow-sm)" }}>
              Try Again
            </button>
            {nextLesson ? (
              <Link href={`/learn/${moduleId}/${nextLesson.id}`}
                style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "var(--text-base)", color: "var(--text-on-accent)", background: "var(--accent)", padding: "11px 24px", borderRadius: "var(--radius-pill)", textDecoration: "none", boxShadow: "var(--shadow-accent)" }}>
                Next Lesson →
              </Link>
            ) : (
              <Link href={`/learn/${moduleId}`}
                style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "var(--text-base)", color: "var(--text-on-accent)", background: "var(--accent)", padding: "11px 24px", borderRadius: "var(--radius-pill)", textDecoration: "none", boxShadow: "var(--shadow-accent)" }}>
                Back to Module →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
