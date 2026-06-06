"use client";
import Link from "next/link";
import { useState } from "react";
import type { Module } from "@/lib/curriculum";

interface Props { module: Module; completedLessons: number; locked?: boolean; }

const HUE: Record<string, { fg: string; bg: string }> = {
  emerald: { fg: "var(--mod-emerald)", bg: "var(--mod-emerald-bg)" },
  sky:     { fg: "var(--mod-sky)",     bg: "var(--mod-sky-bg)" },
  amber:   { fg: "var(--mod-amber)",   bg: "var(--mod-amber-bg)" },
  violet:  { fg: "var(--mod-violet)",  bg: "var(--mod-violet-bg)" },
  coral:   { fg: "var(--mod-coral)",   bg: "var(--mod-coral-bg)" },
};

const LEVEL_TINT: Record<string, { color: string; background: string }> = {
  beginner:     { color: "var(--level-beginner)",     background: "var(--level-beginner-bg)" },
  intermediate: { color: "var(--level-intermediate)", background: "var(--level-intermediate-bg)" },
  advanced:     { color: "var(--level-advanced)",     background: "var(--level-advanced-bg)" },
};

export default function ModuleCard({ module: mod, completedLessons, locked = false }: Props) {
  const [hover, setHover] = useState(false);
  const pct = mod.lessons.length > 0 ? Math.round((completedLessons / mod.lessons.length) * 100) : 0;
  const hue = HUE[mod.accent] ?? HUE.emerald;
  const level = LEVEL_TINT[mod.level];
  const cta = pct === 0 ? "Start Module" : pct === 100 ? "Review Module" : "Continue";

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        display: "flex", flexDirection: "column", gap: "18px",
        background: "var(--surface-card)",
        border: `1px solid ${hover && !locked ? "var(--border-strong)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "22px",
        opacity: locked ? 0.55 : 1,
        boxShadow: hover && !locked ? "var(--shadow-lg)" : "var(--shadow-sm)",
        transform: hover && !locked ? "translateY(-3px)" : "none",
        transition: "transform var(--dur-base) var(--ease-out), border-color var(--dur-base), box-shadow var(--dur-base)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {locked && <div style={{ position: "absolute", top: "18px", right: "18px", fontSize: "18px" }}>🔒</div>}

      {/* Header */}
      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
        <span style={{ flexShrink: 0, width: "52px", height: "52px", borderRadius: "var(--radius-md)", background: hue.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
          {mod.thumbnail}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "inline-block", fontSize: "var(--text-xs)", fontWeight: "var(--fw-bold)", padding: "3px 10px", borderRadius: "var(--radius-pill)", marginBottom: "8px", ...level }}>
            {mod.level}
          </span>
          <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-h3)", fontWeight: "var(--fw-extrabold)", color: "var(--text-primary)", lineHeight: 1.15 }}>
            {mod.title}
          </h3>
          <p style={{ margin: "5px 0 0", fontSize: "var(--text-sm)", color: "var(--text-muted)", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {mod.description}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: "6px", fontWeight: "var(--fw-medium)" }}>
          <span>{completedLessons} / {mod.lessons.length} lessons</span>
          <span style={{ color: hue.fg, fontWeight: "var(--fw-bold)" }}>{pct}%</span>
        </div>
        <div style={{ height: "8px", background: "var(--surface-track)", borderRadius: "var(--radius-pill)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: hue.fg, borderRadius: "var(--radius-pill)", transition: "width var(--dur-slow) var(--ease-out)" }} />
        </div>
      </div>

      {/* CTA */}
      {!locked && (
        <Link
          href={`/learn/${mod.id}`}
          style={{
            display: "block", width: "100%", textAlign: "center",
            fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)",
            fontSize: "var(--text-sm)", color: "var(--text-on-accent)",
            background: hover ? hue.fg : "var(--accent)",
            padding: "11px", border: "none", borderRadius: "var(--radius-pill)",
            cursor: "pointer", transition: "background var(--dur-fast)",
            textDecoration: "none",
          }}
        >
          {cta}
        </Link>
      )}
    </div>
  );
}
