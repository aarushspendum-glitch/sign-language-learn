"use client";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";

const FEATURES = [
  { icon: "📷", color: "var(--mod-emerald-bg)", title: "Camera-Based Practice", desc: "Your webcam detects hand landmarks in real time using MediaPipe — no app install needed." },
  { icon: "📚", color: "var(--mod-sky-bg)",     title: "Structured Modules",   desc: "Progress through alphabet, numbers, greetings, common words, and full phrases step by step." },
  { icon: "🏆", color: "var(--mod-amber-bg)",   title: "Track Progress",       desc: "Every lesson you complete is saved. Pick up exactly where you left off, any time." },
  { icon: "☁️", color: "var(--mod-violet-bg)",  title: "Progress Synced",      desc: "Sign in with Google and your progress syncs across every device automatically." },
];

const STEPS = [
  { n: "1", title: "Pick a lesson",   desc: "Choose any module and start from the first lesson." },
  { n: "2", title: "Learn the sign",  desc: "See a description and helpful tips for each hand shape." },
  { n: "3", title: "Show the camera", desc: "Hold the sign — we detect your hand landmarks and confirm it live." },
];

export default function Home() {
  const { data: session } = useSession();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
      {/* Decorative blobs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-120px", left: "8%", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,0.18),transparent 70%)" }} />
        <div style={{ position: "absolute", top: "-80px", right: "6%", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle,rgba(14,165,233,0.16),transparent 70%)" }} />
        <div style={{ position: "absolute", top: "200px", left: "42%", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle,rgba(245,158,11,0.10),transparent 70%)" }} />
      </div>

      {/* Hero */}
      <section className="sl-rise" style={{ position: "relative", zIndex: 1, maxWidth: "var(--container-base)", margin: "0 auto", padding: "96px 16px 80px", textAlign: "center" }}>
        <span style={{ fontSize: "72px", display: "inline-block", marginBottom: "24px" }}>🤟</span>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem,6vw,3.5rem)", fontWeight: "var(--fw-extrabold)", lineHeight: 1.05, letterSpacing: "var(--ls-tight)", margin: 0, color: "var(--text-primary)" }}>
          Learn <span className="sl-grad">Sign Language</span><br />with Your Camera
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "var(--text-lg)", maxWidth: "40rem", margin: "20px auto 40px", lineHeight: 1.6 }}>
          Practice American Sign Language with instant computer-vision feedback.
          Work through structured modules at your own pace.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/learn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "18px", color: "var(--text-on-accent)", background: "var(--accent)", padding: "15px 32px", borderRadius: "var(--radius-pill)", boxShadow: "var(--shadow-accent)", textDecoration: "none" }}>
            Start Learning →
          </Link>
          {!session && (
            <button onClick={() => signIn("google")} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "18px", color: "var(--text-primary)", background: "var(--white)", padding: "15px 32px", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-strong)", boxShadow: "var(--shadow-sm)", cursor: "pointer" }}>
              <GoogleG size={20} /> Sign in to Save Progress
            </button>
          )}
        </div>
      </section>

      {/* Feature cards */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: "var(--container-base)", margin: "0 auto", padding: "0 16px 96px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "24px" }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className="sl-rise" style={{ animationDelay: `${0.1+i*0.08}s`, background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "24px", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", borderRadius: "var(--radius-md)", background: f.color, fontSize: "28px", marginBottom: "14px" }}>{f.icon}</span>
              <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", color: "var(--text-primary)" }}>{f.title}</h3>
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "var(--surface-card)", borderTop: "1px solid var(--border-default)", padding: "80px 16px" }}>
        <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", fontWeight: "var(--fw-extrabold)", color: "var(--text-primary)", margin: "0 0 8px" }}>How It Works</h2>
          <p style={{ color: "var(--text-muted)", margin: "0 0 56px" }}>Three steps and you're signing</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "40px" }}>
            {STEPS.map((s, i) => (
              <div key={s.n} className="sl-rise" style={{ animationDelay: `${i*0.1}s`, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "var(--radius-xl)", background: "var(--gradient-brand)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--white)", fontFamily: "var(--font-display)", fontWeight: "var(--fw-black)", fontSize: "20px", marginBottom: "16px", boxShadow: "var(--shadow-accent)" }}>{s.n}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", color: "var(--text-primary)", margin: "0 0 6px" }}>{s.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "48px" }}>
            <Link href="/learn" style={{ display: "inline-flex", alignItems: "center", fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "18px", color: "var(--text-on-accent)", background: "var(--accent)", padding: "15px 36px", borderRadius: "var(--radius-pill)", boxShadow: "var(--shadow-accent)", textDecoration: "none" }}>
              Browse Modules →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
  );
}
