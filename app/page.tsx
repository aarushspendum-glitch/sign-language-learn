"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";

const features = [
  {
    icon: "📷",
    title: "Camera-Based Practice",
    desc: "Your webcam detects hand landmarks in real time using MediaPipe — no app install needed.",
  },
  {
    icon: "📚",
    title: "Structured Modules",
    desc: "Progress through alphabet, numbers, greetings, common words, and full phrases step by step.",
  },
  {
    icon: "🎯",
    title: "Diagnostic Test",
    desc: "Already know some signs? Take a quick test and jump straight to the right level.",
  },
  {
    icon: "☁️",
    title: "Progress Saved",
    desc: "Sign in with Google and your progress syncs across every device automatically.",
  },
];

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="hero-glow min-h-screen">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-7xl mb-6">🤟</span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-tight">
            Learn <span className="gradient-text">Sign Language</span>
            <br />with Your Camera
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Practice American Sign Language with instant computer-vision feedback.
            Start from scratch or take a diagnostic to find your level.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/learn"
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-emerald-500/20"
            >
              Start from Beginning
            </Link>
            <Link
              href="/diagnostic"
              className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all"
            >
              Take Diagnostic Test
            </Link>
          </div>

          {!session && (
            <p className="mt-6 text-slate-500 text-sm">
              <button
                onClick={() => signIn("google")}
                className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
              >
                Sign in with Google
              </button>{" "}
              to save your progress
            </p>
          )}
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 text-center"
            >
              <span className="text-4xl block mb-3">{f.icon}</span>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 pb-32">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Choose a lesson", desc: "Pick a module or let the diagnostic place you." },
            { step: "2", title: "Watch & learn", desc: "See the sign demonstrated with tips and instructions." },
            { step: "3", title: "Show the camera", desc: "Hold the sign — MediaPipe detects your hand landmarks and confirms it in real time." },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg mb-4">
                {s.step}
              </div>
              <h3 className="font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
