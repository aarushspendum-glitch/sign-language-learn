"use client";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";

const FEATURES = [
  { icon: "📷", color: "var(--mod-emerald-bg)", title: "Camera-Based Practice", desc: "Your webcam detects hand landmarks in real time using MediaPipe — no app install needed." },
  { icon: "📚", color: "var(--mod-sky-bg)",     title: "Structured Modules",   desc: "Progress through alphabet, numbers, greetings, common words, and full phrases step by step." },
  { icon: "🎯", color: "var(--mod-amber-bg)",   title: "Diagnostic Test",      desc: "Already know some signs? Take a quick test and jump straight to the right level." },
  { icon: "☁️", color: "var(--mod-violet-bg)",  title: "Progress Saved",       desc: "Sign in with Google and your progress syncs across every device automatically." },
];

const STEPS = [
  { n: "1", title: "Pick a lesson",    desc: "Choose a module or let the diagnostic place you." },
  { n: "2", title: "Learn the sign",   desc: "See a description and helpful tips for each hand shape." },
  { n: "3", title: "Show the camera",  desc: "Hold the sign — we detect your hand landmarks and confirm it live." },
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
          Start from scratch or take a diagnostic to find your level.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/learn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "18px", color: "var(--text-on-accent)", background: "var(--accent)", padding: "15px 32px", borderRadius: "var(--radius-pill)", boxShadow: "var(--shadow-accent)", textDecoration: "none", transition: "opacity var(--dur-fast)" }}>
            Start from Beginning
          </Link>
          <Link href="/diagnostic" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "18px", color: "var(--text-primary)", background: "var(--white)", padding: "15px 32px", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-strong)", boxShadow: "var(--shadow-sm)", textDecoration: "none" }}>
            🎯 Take Diagnostic Test
          </Link>
        </div>
        {!session && (
          <p style={{ marginTop: "20px", fontSize: "var(--text-sm)", color: "var(--text-faint)" }}>
            <button onClick={() => signIn("google")} style={{ color: "var(--accent-text)", fontWeight: "var(--fw-medium)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "2px" }}>
              Sign in with Google
            </button>{" "}to save your progress
          </p>
        )}
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
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
