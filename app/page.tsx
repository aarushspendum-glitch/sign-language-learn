"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";

const features = [
  { icon: "📷", title: "Live Camera Feedback", desc: "MediaPipe detects your hand in real time — no installs, just your webcam.", color: "bg-teal-50 text-teal-600" },
  { icon: "📚", title: "Structured Modules", desc: "Alphabet → Numbers → Greetings → Words → Phrases, step by step.", color: "bg-indigo-50 text-indigo-600" },
  { icon: "🎯", title: "Placement Diagnostic", desc: "Already know some signs? Get placed at the right level instantly.", color: "bg-amber-50 text-amber-600" },
  { icon: "☁️", title: "Progress Synced", desc: "Sign in with Google and your progress follows you everywhere.", color: "bg-rose-50 text-rose-600" },
];

const steps = [
  { n: "1", title: "Pick a lesson", desc: "Choose a module or let the diagnostic place you." },
  { n: "2", title: "Learn the sign", desc: "See a description and tips for each hand shape." },
  { n: "3", title: "Show the camera", desc: "Hold the sign — we detect your landmarks and confirm it live." },
];

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-bg pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <span>🤟</span> Learn ASL with your camera — free, forever
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-5 leading-tight tracking-tight">
              Learn <span className="gradient-text">Sign Language</span><br />
              the fun way
            </h1>
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Practice American Sign Language with instant AI feedback straight from your webcam.
              No downloads. No guessing. Just sign and see.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/learn"
                className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-teal-200"
              >
                Start from Beginning →
              </Link>
              <Link
                href="/diagnostic"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-sm"
              >
                🎯 Take Diagnostic Test
              </Link>
            </div>
            {!session && (
              <p className="mt-5 text-slate-400 text-sm">
                <button onClick={() => signIn("google")} className="text-teal-500 hover:text-teal-600 font-medium underline underline-offset-2">
                  Sign in with Google
                </button>{" "}to save your progress across sessions
              </p>
            )}
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-14 bg-white rounded-3xl shadow-card p-6 max-w-2xl mx-auto border border-slate-100"
          >
            <div className="bg-slate-900 rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden">
              <div className="text-center text-white z-10">
                <div className="text-6xl mb-3">✋</div>
                <p className="text-slate-400 text-sm">Your camera goes here</p>
                <p className="text-teal-400 font-semibold text-sm mt-1">Hand landmarks detected live</p>
              </div>
              {/* Fake landmark dots for visual */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-teal-400 opacity-60"
                  style={{ left: `${20 + i * 9}%`, top: `${40 + (i % 3) * 12}%` }}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Current sign</p>
                <p className="text-2xl font-extrabold text-slate-800">A</p>
              </div>
              <div className="flex-1 mx-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Hold steady…</span><span>80%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-teal-400 rounded-full" />
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-lg">✓</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 text-center"
            >
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center text-2xl mx-auto mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20 px-4 border-t border-slate-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">How It Works</h2>
          <p className="text-slate-500 mb-12">Three steps and you're signing</p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-indigo-400 flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg shadow-teal-100">
                  {s.n}
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{s.title}</h3>
                <p className="text-slate-500 text-sm text-center">{s.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-12">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-lg shadow-teal-100 hover:opacity-90 transition-opacity"
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
