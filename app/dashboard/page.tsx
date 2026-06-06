"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MODULES } from "@/lib/curriculum";

interface P { moduleId: string; lessonId: string; completed: boolean; score: number | null; }
interface DR { score: number; level: string; moduleStart: string; }

const HUE: Record<string, { fg: string; bg: string }> = {
  emerald: { fg: "var(--mod-emerald)", bg: "var(--mod-emerald-bg)" },
  sky:     { fg: "var(--mod-sky)",     bg: "var(--mod-sky-bg)" },
  amber:   { fg: "var(--mod-amber)",   bg: "var(--mod-amber-bg)" },
  violet:  { fg: "var(--mod-violet)",  bg: "var(--mod-violet-bg)" },
  coral:   { fg: "var(--mod-coral)",   bg: "var(--mod-coral-bg)" },
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState<P[]>([]);
  const [diag, setDiag] = useState<DR | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    Promise.all([fetch("/api/progress").then(r=>r.json()), fetch("/api/diagnostic").then(r=>r.json())])
      .then(([p,d]) => { setProgress(p); setDiag(d); setLoading(false); });
  }, [session]);

  if (status === "loading") return <Skeleton />;
  if (!session) return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", color: "var(--text-primary)" }}>Sign in to view your dashboard</h1>
      <button onClick={() => signIn("google")} style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", background: "var(--accent)", color: "var(--white)", padding: "12px 28px", borderRadius: "var(--radius-pill)", border: "none", cursor: "pointer", boxShadow: "var(--shadow-accent)" }}>
        Sign in with Google
      </button>
    </div>
  );

  const doneIn = (id: string) => progress.filter(p => p.moduleId === id && p.completed).length;
  const totalDone = progress.filter(p => p.completed).length;
  const totalLessons = MODULES.reduce((a,m) => a+m.lessons.length, 0);
  const overall = Math.round((totalDone/totalLessons)*100);
  const started = MODULES.filter(m => doneIn(m.id) > 0).length;

  const STATS = [
    { value: totalDone, label: "Lessons Done", accent: true },
    { value: `${overall}%`, label: "Overall Progress", accent: true },
    { value: started, label: "Modules Started", accent: true },
    { value: diag ? `${diag.score}%` : "—", label: "Diagnostic Score", accent: !!diag },
  ];

  return (
    <div style={{ maxWidth: "var(--container-base)", margin: "0 auto", padding: "48px 16px" }}>
      {/* Profile */}
      <div className="sl-rise" style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
        {session.user?.image && <img src={session.user.image} alt="" style={{ width: "64px", height: "64px", borderRadius: "var(--radius-pill)", border: "2px solid var(--accent)", objectFit: "cover" }} />}
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", fontWeight: "var(--fw-bold)", color: "var(--text-primary)", margin: 0 }}>{session.user?.name}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", margin: "2px 0 0" }}>{session.user?.email}</p>
        </div>
      </div>

      {/* Stat tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "16px", marginBottom: "40px" }}>
        {STATS.map((s, i) => (
          <div key={s.label} className="sl-rise" style={{ animationDelay: `${i*0.07}s`, background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "20px", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", fontWeight: "var(--fw-black)", color: s.accent ? "var(--accent-text)" : "var(--text-primary)", margin: 0, lineHeight: 1.1 }}>{s.value}</p>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", margin: "4px 0 0" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Diagnostic CTA */}
      {!diag && (
        <div style={{ background: "var(--warn-soft)", border: "1px solid var(--amber-100)", borderRadius: "var(--radius-lg)", padding: "20px", marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, fontWeight: "var(--fw-semibold)", color: "var(--warn-text)", fontFamily: "var(--font-sans)" }}>Haven't taken the diagnostic yet?</p>
            <p style={{ margin: "2px 0 0", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>Find your level and jump to the right module.</p>
          </div>
          <Link href="/diagnostic" style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: "var(--text-sm)", color: "var(--slate-900)", background: "var(--warn)", padding: "10px 20px", borderRadius: "var(--radius-md)", textDecoration: "none", whiteSpace: "nowrap" }}>
            Take Diagnostic →
          </Link>
        </div>
      )}

      {/* Module grid */}
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h3)", fontWeight: "var(--fw-bold)", color: "var(--text-primary)", margin: "0 0 20px" }}>Module Progress</h2>
      {loading ? <Skeleton /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "24px" }}>
          {MODULES.map((mod, i) => {
            const done = doneIn(mod.id);
            const pct = Math.round((done/mod.lessons.length)*100);
            const hue = HUE[mod.accent] ?? HUE.emerald;
            return (
              <div key={mod.id} className="sl-rise" style={{ animationDelay: `${i*0.05}s`, background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "20px", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "28px" }}>{mod.thumbnail}</span>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", color: "var(--text-primary)", margin: 0 }}>{mod.title}</h3>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", margin: "2px 0 0" }}>{done}/{mod.lessons.length} lessons</p>
                  </div>
                </div>
                <div style={{ height: "6px", background: "var(--surface-track)", borderRadius: "var(--radius-pill)", overflow: "hidden", marginBottom: "12px" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: hue.fg, borderRadius: "var(--radius-pill)", transition: "width var(--dur-slow) var(--ease-out)" }} />
                </div>
                <Link href={`/learn/${mod.id}`} style={{ color: "var(--accent-text)", fontSize: "var(--text-sm)", fontWeight: "var(--fw-semibold)", textDecoration: "none" }}>
                  {pct === 0 ? "Start →" : pct === 100 ? "Review →" : "Continue →"}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{ maxWidth: "var(--container-base)", margin: "0 auto", padding: "48px 16px" }}>
      {[1,2,3].map(i => <div key={i} style={{ height: "80px", background: "var(--surface-inset)", borderRadius: "var(--radius-lg)", marginBottom: "16px" }} />)}
    </div>
  );
}
