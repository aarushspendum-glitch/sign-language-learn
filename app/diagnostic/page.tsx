"use client";
import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getDiagnosticSigns, getStartingModule } from "@/lib/curriculum";
import type { Sign } from "@/lib/curriculum";
import dynamic from "next/dynamic";
import Link from "next/link";

const SignDetector = dynamic(() => import("@/components/SignDetector"), { ssr: false });
const SIGNS: Sign[] = getDiagnosticSigns();
type Phase = "intro" | "test" | "results";

export default function DiagnosticPage() {
  const { data: session } = useSession();
  const [phase, setPhase] = useState<Phase>("intro");
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [result, setResult] = useState<{ score: number; level: string; moduleStart: string } | null>(null);
  const total = SIGNS.length;

  const finish = useCallback(async (c: number) => {
    const score = Math.round((c/total)*100);
    const moduleStart = getStartingModule(score);
    const level = score >= 80 ? "intermediate" : score >= 40 ? "beginner-advanced" : "beginner";
    if (session) {
      const res = await fetch("/api/diagnostic", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ score: c, total }) });
      setResult(await res.json());
    } else {
      setResult({ score, level, moduleStart });
    }
    setPhase("results");
  }, [session, total]);

  const handleSuccess = useCallback(async () => {
    const next = correct + 1; setCorrect(next);
    if (idx + 1 >= total) await finish(next);
    else setTimeout(() => setIdx(i => i+1), 500);
  }, [correct, idx, total, finish]);

  const skip = async () => {
    if (idx + 1 >= total) await finish(correct);
    else setIdx(i => i+1);
  };

  const sign = SIGNS[idx];

  return (
    <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto", padding: "48px 16px" }}>

      {/* INTRO */}
      {phase === "intro" && (
        <div className="sl-rise" style={{ textAlign: "center" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "var(--radius-xl)", background: "var(--gradient-brand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", margin: "0 auto 24px", boxShadow: "var(--shadow-accent)" }}>🎯</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", fontWeight: "var(--fw-extrabold)", color: "var(--text-primary)", margin: "0 0 16px" }}>Diagnostic Test</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-lg)", maxWidth: "36rem", margin: "0 auto 32px", lineHeight: 1.6 }}>
            Show us {total} signs on camera. We'll figure out where you are and place you at the right level — no pressure!
          </p>
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "24px", textAlign: "left", marginBottom: "32px", boxShadow: "var(--shadow-sm)" }}>
            <p style={{ fontWeight: "var(--fw-semibold)", color: "var(--text-secondary)", marginBottom: "12px", fontSize: "var(--text-sm)" }}>Signs in this test:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {SIGNS.map(s => (
                <span key={s.id} style={{ background: "var(--surface-track)", color: "var(--text-secondary)", padding: "4px 12px", borderRadius: "var(--radius-pill)", fontSize: "var(--text-sm)", fontWeight: "var(--fw-medium)" }}>{s.label}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPhase("test")} style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "18px", color: "var(--text-on-accent)", background: "var(--accent)", padding: "15px 32px", borderRadius: "var(--radius-pill)", border: "none", cursor: "pointer", boxShadow: "var(--shadow-accent)" }}>
              Start Test →
            </button>
            <Link href="/learn" style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "18px", color: "var(--text-primary)", background: "var(--white)", padding: "15px 32px", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-strong)", textDecoration: "none", boxShadow: "var(--shadow-sm)" }}>
              Skip — Start from Beginning
            </Link>
          </div>
        </div>
      )}

      {/* TEST */}
      {phase === "test" && (
        <div key={idx} className="sl-slide" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "8px", fontWeight: "var(--fw-medium)" }}>
              <span>Question {idx+1} of {total}</span>
              <span style={{ color: "var(--accent-text)", fontWeight: "var(--fw-bold)" }}>{correct} correct</span>
            </div>
            <div style={{ height: "6px", background: "var(--surface-track)", borderRadius: "var(--radius-pill)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(idx/total)*100}%`, background: "var(--accent)", borderRadius: "var(--radius-pill)", transition: "width var(--dur-slow) var(--ease-out)" }} />
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>Show this sign:</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-sign)", fontWeight: "var(--fw-black)", color: "var(--accent-text)", lineHeight: 0.95, margin: "4px 0 8px" }}>{sign.label}</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", margin: 0 }}>{sign.description}</p>
          </div>

          <SignDetector expectedSign={sign.id} onSuccess={handleSuccess} />

          <button onClick={skip} style={{ color: "var(--text-faint)", fontSize: "var(--text-sm)", textDecoration: "underline", textUnderlineOffset: "2px", background: "none", border: "none", cursor: "pointer" }}>
            Skip / Don't know this one
          </button>
        </div>
      )}

      {/* RESULTS */}
      {phase === "results" && result && (
        <div className="sl-pop" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "72px", marginBottom: "16px" }}>{result.score >= 70 ? "🌟" : result.score >= 40 ? "👍" : "🌱"}</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", fontWeight: "var(--fw-extrabold)", color: "var(--text-primary)", margin: "0 0 8px" }}>Diagnostic Complete!</h1>
          <p style={{ color: "var(--text-muted)", margin: "0 0 32px" }}>
            You scored <strong style={{ color: "var(--text-primary)" }}>{result.score}%</strong> · Level:{" "}
            <strong style={{ color: "var(--accent-text)", textTransform: "capitalize" }}>{result.level}</strong>
          </p>
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "24px", marginBottom: "32px", boxShadow: "var(--shadow-sm)" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", margin: "0 0 8px" }}>We recommend starting at:</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", fontWeight: "var(--fw-extrabold)", color: "var(--accent-text)", margin: 0, textTransform: "capitalize" }}>
              {result.moduleStart.replace("-", " ")} Module
            </p>
            {!session && <p style={{ color: "var(--text-faint)", fontSize: "var(--text-xs)", margin: "12px 0 0" }}>Sign in with Google to save this result.</p>}
          </div>
          <Link href={`/learn/${result.moduleStart}`} style={{ display: "inline-block", fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "18px", color: "var(--text-on-accent)", background: "var(--accent)", padding: "15px 36px", borderRadius: "var(--radius-pill)", textDecoration: "none", boxShadow: "var(--shadow-accent)" }}>
            Go to Recommended Module →
          </Link>
        </div>
      )}
    </div>
  );
}
