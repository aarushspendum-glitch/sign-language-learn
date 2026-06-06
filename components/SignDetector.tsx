"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { classifySign, matchSignToLesson, type Landmark } from "@/lib/signClassifier";

interface Props {
  expectedSign: string;
  onSuccess: () => void;
  onDetected?: (sign: string | null) => void;
  showFeedback?: boolean;
}

declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}

export default function SignDetector({ expectedSign, onSuccess, onDetected, showFeedback = true }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "detected" | "wrong">("loading");
  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const [successStreak, setSuccessStreak] = useState(0);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const streakRef = useRef(0);
  const successFiredRef = useRef(false);

  const REQUIRED_STREAK = 12; // ~0.5s at 24fps

  const drawLandmarks = useCallback(
    (ctx: CanvasRenderingContext2D, landmarks: Landmark[], isCorrect: boolean) => {
      const color = isCorrect ? "#22c55e" : "#ef4444";
      const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4],
        [0, 5], [5, 6], [6, 7], [7, 8],
        [0, 9], [9, 10], [10, 11], [11, 12],
        [0, 13], [13, 14], [14, 15], [15, 16],
        [0, 17], [17, 18], [18, 19], [19, 20],
        [5, 9], [9, 13], [13, 17],
      ];
      const w = ctx.canvas.width;
      const h = ctx.canvas.height;

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      for (const [a, b] of connections) {
        ctx.beginPath();
        ctx.moveTo(landmarks[a].x * w, landmarks[a].y * h);
        ctx.lineTo(landmarks[b].x * w, landmarks[b].y * h);
        ctx.stroke();
      }

      ctx.fillStyle = color;
      for (const lm of landmarks) {
        ctx.beginPath();
        ctx.arc(lm.x * w, lm.y * h, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    []
  );

  useEffect(() => {
    successFiredRef.current = false;
    streakRef.current = 0;
    setSuccessStreak(0);
    setDetectedSign(null);
    setStatus("loading");
  }, [expectedSign]);

  useEffect(() => {
    let scriptLoaded = false;

    const initMediaPipe = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const hands = new window.Hands({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      });

      hands.onResults((results: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        if (!results.multiHandLandmarks?.length) {
          streakRef.current = 0;
          setSuccessStreak(0);
          setDetectedSign(null);
          setStatus("ready");
          onDetected?.(null);
          return;
        }

        const landmarks: Landmark[] = results.multiHandLandmarks[0];
        const mirrored = landmarks.map((lm: Landmark) => ({ ...lm, x: 1 - lm.x }));
        const sign = classifySign(mirrored);
        setDetectedSign(sign);
        onDetected?.(sign);

        const isCorrect = matchSignToLesson(sign, expectedSign);
        drawLandmarks(ctx, mirrored.map((lm: Landmark) => ({
          x: lm.x,
          y: lm.y,
          z: lm.z,
        })), isCorrect);

        if (isCorrect) {
          streakRef.current += 1;
          setSuccessStreak(streakRef.current);
          setStatus("detected");
          if (streakRef.current >= REQUIRED_STREAK && !successFiredRef.current) {
            successFiredRef.current = true;
            onSuccess();
          }
        } else {
          streakRef.current = 0;
          setSuccessStreak(0);
          setStatus(sign ? "wrong" : "ready");
        }
      });

      handsRef.current = hands;

      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) await hands.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      cameraRef.current = camera;
      camera.start().then(() => setStatus("ready"));
    };

    const mpHandsScript = document.getElementById("mp-hands");
    const mpCameraScript = document.getElementById("mp-camera");

    if (!mpHandsScript) {
      const s1 = document.createElement("script");
      s1.id = "mp-hands";
      s1.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
      s1.crossOrigin = "anonymous";
      document.head.appendChild(s1);

      const s2 = document.createElement("script");
      s2.id = "mp-camera";
      s2.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";
      s2.crossOrigin = "anonymous";
      s2.onload = () => {
        if (window.Hands && window.Camera) initMediaPipe();
      };
      document.head.appendChild(s2);

      s1.onload = () => {
        if (window.Hands && window.Camera) initMediaPipe();
      };
    } else {
      if (window.Hands && window.Camera) {
        initMediaPipe();
      } else {
        const checkInterval = setInterval(() => {
          if (window.Hands && window.Camera) {
            clearInterval(checkInterval);
            initMediaPipe();
          }
        }, 200);
      }
    }

    return () => {
      cameraRef.current?.stop();
      handsRef.current?.close();
    };
  }, [expectedSign, drawLandmarks, onSuccess, onDetected]);

  const progressPct = Math.round((successStreak / REQUIRED_STREAK) * 100);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg">
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-card bg-slate-900 w-full">
        <video ref={videoRef} className="hidden" playsInline muted />
        <canvas ref={canvasRef} width={640} height={480} className="w-full" />

        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-400 mx-auto mb-3" />
              <p className="text-sm text-slate-300">Starting camera…</p>
            </div>
          </div>
        )}

        {status === "detected" && (
          <div className="absolute top-3 right-3 bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
            ✓ {expectedSign}
          </div>
        )}
        {status === "wrong" && detectedSign && (
          <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
            Seeing: {detectedSign}
          </div>
        )}
      </div>

      {showFeedback && status !== "loading" && (
        <div className="w-full">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>Hold the sign steady…</span>
            <span className="font-semibold text-slate-600">{progressPct}%</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-indigo-400 transition-all duration-100 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
