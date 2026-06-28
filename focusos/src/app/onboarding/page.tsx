"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeInUpVariants, staggerContainerVariants } from "@/lib/animation/variants";

const STEPS = [
  { emoji: "⚡", title: "Welcome to FocusOS", body: "Your AI-powered study and life operating system." },
  { emoji: "🎯", title: "Set Your Goals", body: "Define what you want to achieve. We'll help you get there." },
  { emoji: "⏱", title: "Master Focus", body: "Use Pomodoro or Deep Work sessions to stay in flow." },
  { emoji: "🏆", title: "Level Up", body: "Earn XP, unlock achievements, build unbreakable habits." },
];

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push("/app/dashboard");
  };

  return (
    <div className="min-h-dvh bg-[#080810] flex items-center justify-center px-4 py-16">
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div variants={fadeInUpVariants} className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-violet-500 flex items-center justify-center text-3xl mx-auto mb-6 shadow-[0_0_32px_rgba(124,58,237,0.5)]">
            ⚡
          </div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">
            Let&apos;s get you set up
          </h1>
          <p className="text-text-muted mt-2 text-sm">
            Takes 30 seconds. No credit card required.
          </p>
        </motion.div>

        <div className="flex flex-col gap-3 mb-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeInUpVariants}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/4 border border-white/8"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-xl flex-shrink-0">
                {step.emoji}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{step.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeInUpVariants}>
          <button
            onClick={handleComplete}
            className="w-full h-12 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-semibold text-sm transition-colors shadow-[0_0_24px_rgba(124,58,237,0.4)]"
          >
            Start My Journey →
          </button>
          <p className="text-center text-[11px] text-text-muted mt-3">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
