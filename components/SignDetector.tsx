"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { classifySign, matchSignToLesson, clearHistory, requiresMotion, type Landmark } from "@/lib/signClassifier";

interface Props {
  expectedSign: string;
  onSuccess: () => void;
  onDetected?: (sign: string | null) => void;
  showFeedback?: boolean;
}

declare global { interface Window { Hands: any; Camera: any; } }

export default function SignDetector({ expectedSign, onSuccess, onDetected, showFeedback = true }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading"|"ready"|"detected"|"wrong">("loading");
  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const streakRef = useRef(0);
  const firedRef = useRef(false);
  const REQUIRED = 12;

  const drawLandmarks = useCallback((ctx: CanvasRenderingContext2D, lms: Landmark[], correct: boolean) => {
    const c = correct ? "var(--status-correct)" : "var(--status-wrong)";
    const w = ctx.canvas.width, h = ctx.canvas.height;
    const links = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[0,9],[9,10],[10,11],[11,12],[0,13],[13,14],[14,15],[15,16],[0,17],[17,18],[18,19],[19,20],[5,9],[9,13],[13,17]];
    ctx.strokeStyle = c; ctx.lineWidth = 2;
    for (const [a,b] of links) {
      ctx.beginPath(); ctx.moveTo(lms[a].x*w, lms[a].y*h); ctx.lineTo(lms[b].x*w, lms[b].y*h); ctx.stroke();
    }
    ctx.fillStyle = c;
    for (const lm of lms) { ctx.beginPath(); ctx.arc(lm.x*w, lm.y*h, 4, 0, Math.PI*2); ctx.fill(); }
  }, []);

  const needsMotion = requiresMotion(expectedSign);

  useEffect(() => {
    firedRef.current = false; streakRef.current = 0;
    setStreak(0); setDetectedSign(null); setStatus("loading");
    clearHistory();
  }, [expectedSign]);

  useEffect(() => {
    const init = () => {
      if (!videoRef.current || !canvasRef.current) return;
      const hands = new window.Hands({ locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}` });
      hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.7, minTrackingConfidence: 0.5 });
      hands.onResults((res: any) => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext("2d"); if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save(); ctx.scale(-1,1); ctx.translate(-canvas.width,0);
        ctx.drawImage(res.image, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        if (!res.multiHandLandmarks?.length) { streakRef.current=0; setStreak(0); setDetectedSign(null); setStatus("ready"); onDetected?.(null); return; }
        const lms: Landmark[] = res.multiHandLandmarks[0];
        const mirrored = lms.map((l: Landmark) => ({ ...l, x: 1-l.x }));
        const sign = classifySign(mirrored);
        setDetectedSign(sign); onDetected?.(sign);
        const ok = matchSignToLesson(sign, expectedSign);
        drawLandmarks(ctx, mirrored, ok);
        if (ok) {
          streakRef.current++; setStreak(streakRef.current); setStatus("detected");
          if (streakRef.current >= REQUIRED && !firedRef.current) { firedRef.current=true; onSuccess(); }
        } else { streakRef.current=0; setStreak(0); setStatus(sign ? "wrong" : "ready"); }
      });
      handsRef.current = hands;
      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => { if (videoRef.current) await hands.send({ image: videoRef.current }); },
        width: 640, height: 480,
      });
      cameraRef.current = camera;
      camera.start().then(() => setStatus("ready"));
    };

    if (!document.getElementById("mp-hands")) {
      const s1 = document.createElement("script"); s1.id="mp-hands";
      s1.src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"; s1.crossOrigin="anonymous";
      const s2 = document.createElement("script"); s2.id="mp-camera";
      s2.src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"; s2.crossOrigin="anonymous";
      s2.onload = () => { if (window.Hands && window.Camera) init(); };
      s1.onload = () => { if (window.Hands && window.Camera) init(); };
      document.head.appendChild(s1); document.head.appendChild(s2);
    } else if (window.Hands && window.Camera) {
      init();
    } else {
      const iv = setInterval(() => { if (window.Hands && window.Camera) { clearInterval(iv); init(); } }, 200);
    }
    return () => { cameraRef.current?.stop(); handsRef.current?.close(); };
  }, [expectedSign, drawLandmarks, onSuccess, onDetected]);

  const pct = Math.round((streak / REQUIRED) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", width: "100%", maxWidth: "32rem" }}>
      {/* Camera view */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "2px solid var(--border-default)", boxShadow: "var(--shadow-xl)", background: "linear-gradient(145deg,#1a2336,#0c1322)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 40%, rgba(16,185,129,0.06), transparent 60%)", pointerEvents: "none" }} />
        <video ref={videoRef} style={{ display: "none" }} playsInline muted />
        <canvas ref={canvasRef} width={640} height={480} style={{ width: "100%", height: "100%", display: "block" }} />

        {status === "loading" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", background: "rgba(0,0,0,0.7)" }}>
            <div className="sl-spin" style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid transparent", borderBottomColor: "var(--accent)" }} />
            <span style={{ color: "var(--white)", fontSize: "var(--text-sm)" }}>Starting camera…</span>
          </div>
        )}
        {status === "detected" && (
          <div style={{ position: "absolute", top: "12px", right: "12px", background: "var(--accent)", color: "var(--white)", fontSize: "var(--text-xs)", fontWeight: "var(--fw-bold)", padding: "4px 12px", borderRadius: "var(--radius-pill)" }}>
            ✓ {expectedSign}
          </div>
        )}
        {status === "wrong" && detectedSign && (
          <div style={{ position: "absolute", top: "12px", right: "12px", background: "var(--red-500)", color: "var(--white)", fontSize: "var(--text-xs)", fontWeight: "var(--fw-bold)", padding: "4px 12px", borderRadius: "var(--radius-pill)" }}>
            Seeing: {detectedSign}
          </div>
        )}
      </div>

      {/* Motion hint */}
      {needsMotion && status !== "loading" && (
        <div style={{ width: "100%", background: "var(--mod-amber-bg)", border: "1px solid var(--amber-100)", borderRadius: "var(--radius-md)", padding: "10px 14px", fontSize: "var(--text-xs)", color: "var(--mod-amber)", fontWeight: "var(--fw-semibold)", display: "flex", alignItems: "center", gap: "6px" }}>
          <span>✋</span> This sign requires movement — perform the motion slowly in front of the camera
        </div>
      )}

      {/* What we're seeing */}
      {detectedSign && status !== "loading" && (
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "var(--text-xs)", color: "var(--text-faint)" }}>
          <span>Detected: <strong style={{ color: status === "detected" ? "var(--accent-text)" : "var(--text-muted)" }}>{detectedSign}</strong></span>
          <span>Expected: <strong style={{ color: "var(--text-secondary)" }}>{expectedSign}</strong></span>
        </div>
      )}

      {/* Progress bar */}
      {showFeedback && status !== "loading" && (
        <div style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: "6px" }}>
            <span>{needsMotion ? "Perform the motion…" : "Hold the sign steady…"}</span>
            <span style={{ fontWeight: "var(--fw-semibold)", color: "var(--text-secondary)" }}>{pct}%</span>
          </div>
          <div style={{ height: "8px", background: "var(--surface-track)", borderRadius: "var(--radius-pill)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "var(--accent)", borderRadius: "var(--radius-pill)", transition: "width 90ms linear" }} />
          </div>
        </div>
      )}
    </div>
  );
}
