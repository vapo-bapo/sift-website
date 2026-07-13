import React, { useState } from "react";
import { motion } from "motion/react";

const CRIMSON = "#ff2f3a";
const CORAL = "#ff6b4a";
const AMBER = "#ffb347";

/* ------------------------------ Aurora backdrop ------------------------------ */

function AuroraBackdrop() {
  const css = `
    @keyframes auroraDriftA {
      0%   { transform: translate(-6%, -4%) rotate(-14deg) scale(1.08); opacity: 0.85; }
      50%  { transform: translate(4%, 6%) rotate(-8deg) scale(1.0); opacity: 0.55; }
      100% { transform: translate(-6%, -4%) rotate(-14deg) scale(1.08); opacity: 0.85; }
    }
    @keyframes auroraDriftB {
      0%   { transform: translate(8%, -6%) rotate(18deg) scale(1.05); opacity: 0.75; }
      50%  { transform: translate(-5%, 5%) rotate(24deg) scale(0.96); opacity: 0.45; }
      100% { transform: translate(8%, -6%) rotate(18deg) scale(1.05); opacity: 0.75; }
    }
    @keyframes auroraDriftC {
      0%   { transform: translate(-4%, 8%) rotate(-30deg) scale(0.98); opacity: 0.65; }
      50%  { transform: translate(6%, -4%) rotate(-22deg) scale(1.1); opacity: 0.4; }
      100% { transform: translate(-4%, 8%) rotate(-30deg) scale(0.98); opacity: 0.65; }
    }
    .aurora-blade { position: absolute; mix-blend-mode: screen; filter: blur(38px); will-change: transform, opacity; }
    .aurora-blade-a { animation: auroraDriftA 19s ease-in-out infinite; }
    .aurora-blade-b { animation: auroraDriftB 22s ease-in-out infinite; }
    .aurora-blade-c { animation: auroraDriftC 16s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
      .aurora-blade-a, .aurora-blade-b, .aurora-blade-c { animation: none; }
    }
  `;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ backgroundColor: "#07080a" }}>
      <style>{css}</style>

      <div
        className="aurora-blade aurora-blade-a"
        style={{
          top: "-20%",
          left: "8%",
          width: "70%",
          height: "140%",
          background: `linear-gradient(200deg, ${CRIMSON}dd 0%, ${CORAL}99 38%, ${AMBER}33 62%, transparent 80%)`,
          borderRadius: "50%",
        }}
      />
      <div
        className="aurora-blade aurora-blade-b"
        style={{
          top: "-30%",
          right: "-10%",
          width: "60%",
          height: "130%",
          background: `linear-gradient(150deg, ${AMBER}cc 0%, ${CORAL}88 40%, ${CRIMSON}22 65%, transparent 82%)`,
          borderRadius: "50%",
        }}
      />
      <div
        className="aurora-blade aurora-blade-c"
        style={{
          bottom: "-35%",
          left: "-10%",
          width: "55%",
          height: "110%",
          background: `linear-gradient(20deg, ${CRIMSON}aa 0%, ${CORAL}55 45%, transparent 78%)`,
          borderRadius: "50%",
        }}
      />

      {/* Film grain */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]" aria-hidden="true">
        <filter id="aurora-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#aurora-grain)" />
      </svg>

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 38%, transparent 0%, rgba(7,8,10,0.55) 62%, rgba(7,8,10,0.96) 100%)",
        }}
      />
    </div>
  );
}

/* --------------------------------- OS-free keycap CTA --------------------------------- */

function KeycapButton({
  label,
  onClick,
  variant = "raised",
}: {
  label: string;
  onClick?: () => void;
  variant?: "raised" | "ghost";
}) {
  if (variant === "ghost") {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="h-11 px-6 rounded-full flex items-center gap-2 cursor-pointer font-sans font-normal text-[14px] text-[#F4F4F5]/85 border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] transition-colors"
      >
        {label}
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ y: 1, scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="h-11 px-6 rounded-[8px] flex items-center gap-2.5 cursor-pointer font-sans font-medium text-[14px]"
      style={{
        background: "#e6e6e6",
        color: "#2f3031",
        boxShadow:
          "0 0 0 2px rgba(0,0,0,0.55), 0 0 14px rgba(255,255,255,0.19), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.15)",
      }}
    >
      <span
        className="inline-block w-[7px] h-[7px] rounded-full shrink-0"
        style={{ background: `linear-gradient(135deg, ${AMBER}, ${CRIMSON})` }}
      />
      {label}
    </motion.button>
  );
}

/* -------------------------------- Command palette mockup -------------------------------- */

const COMMAND_ROWS = [
  { label: "Argus", arg: "sift run --engine argus", shortcut: "⌘ A", active: true },
  { label: "Lynx", arg: "sift map --accounts 5", shortcut: "⌘ L", active: false },
  { label: "Intelligence", arg: "sift brief --target acme.co", shortcut: "⌘ I", active: false },
  { label: "Book a Run", arg: "sift schedule --sla 72h", shortcut: "⌘ ↵", active: false },
];

function CommandBarMockup({ onPrimary }: { onPrimary?: () => void }) {
  const css = `
    @keyframes auroraCaretBlink { 0%, 45% { opacity: 1; } 50%, 95% { opacity: 0; } 100% { opacity: 1; } }
    .aurora-caret { animation: auroraCaretBlink 1.1s step-end infinite; }
  `;

  return (
    <div className="w-full max-w-[640px] mx-auto">
      <style>{css}</style>
      <div
        className="rounded-[14px] border border-white/10 overflow-hidden"
        style={{
          background: "rgba(15,12,13,0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: `0 24px 60px -20px ${CRIMSON}33, 0 0 0 1px rgba(255,255,255,0.03)`,
        }}
      >
        {/* Search row */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <span className="font-mono text-[13px] text-[#F4F4F5]">
            find accounts in motion<span className="aurora-caret" style={{ color: AMBER }}>▍</span>
          </span>
          <span
            className="ml-auto text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10 text-[#A1A1AA]"
          >
            Command
          </span>
        </div>

        {/* Result rows */}
        <div className="py-1.5">
          {COMMAND_ROWS.map((row) => (
            <button
              key={row.label}
              type="button"
              onClick={row.active ? onPrimary : undefined}
              className="w-full flex items-center gap-3 px-5 py-3 text-left transition-colors"
              style={
                row.active
                  ? { background: `linear-gradient(90deg, ${CRIMSON}22, transparent)` }
                  : undefined
              }
            >
              <span
                className="inline-block w-[6px] h-[6px] rounded-full shrink-0"
                style={{
                  background: row.active ? `linear-gradient(135deg, ${AMBER}, ${CRIMSON})` : "#52525B",
                }}
              />
              <span className="text-[13px] text-[#F4F4F5]">{row.label}</span>
              <span className="font-mono text-[11px] text-[#71717A] truncate">{row.arg}</span>
              <span className="ml-auto font-mono text-[10px] text-[#A1A1AA] px-2 py-0.5 rounded-[6px] border border-white/10 shrink-0">
                {row.shortcut}
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/10">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#52525B]">
            ↑↓ navigate · ↵ open · esc dismiss
          </span>
          <span className="font-sans text-[11px] font-bold tracking-tight text-[#71717A]">SIFT</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------ Hero ------------------------------------ */

export function AuroraHero({
  onPrimary,
  onSecondary,
}: {
  onPrimary?: () => void;
  onSecondary?: () => void;
}) {
  const [pageLoaded] = useState(true);

  return (
    <section className="relative w-full min-h-[100svh] flex items-center justify-center px-4 sm:px-8 pt-32 pb-20 overflow-hidden">
      <AuroraBackdrop />

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={pageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="inline-flex items-center gap-2.5 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03]"
        >
          <span
            className="inline-block w-[6px] h-[6px] rounded-full"
            style={{ background: `linear-gradient(135deg, ${AMBER}, ${CRIMSON})` }}
          />
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#A1A1AA]">
            Live · Signal scan running
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={pageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1], delay: 0.2 }}
          className="font-sans font-semibold text-[46px] sm:text-[62px] md:text-[72px] leading-[0.98] tracking-[-0.025em] text-white"
        >
          <span className="block">Your pipeline,</span>
          <span
            className="block"
            style={{
              backgroundImage: `linear-gradient(90deg, ${AMBER}, ${CORAL}, ${CRIMSON})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            signal driven.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={pageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1], delay: 0.35 }}
          className="font-sans text-[18px] font-normal text-[#A1A1AA] leading-[1.6] max-w-xl mx-auto mt-6"
          style={{ letterSpacing: "0.2px" }}
        >
          SIFT identifies, qualifies, and deep-maps your best accounts so your team arrives at
          every call with context — not a cold list.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1], delay: 0.48 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-10"
        >
          <KeycapButton label="Book a Run" onClick={onPrimary} />
          <KeycapButton label="How it works" variant="ghost" onClick={onSecondary} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={pageLoaded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.9, delay: 0.58 }}
          className="font-mono text-[12px] text-[#71717A] mt-4"
        >
          sift scan --icp ./brief.json <span className="text-[#52525B]">·</span> delivery in 72h
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={pageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 1, ease: [0.215, 0.61, 0.355, 1], delay: 0.65 }}
          className="w-full mt-14"
        >
          <CommandBarMockup onPrimary={onPrimary} />
        </motion.div>

        <motion.button
          type="button"
          onClick={onSecondary}
          initial={{ opacity: 0 }}
          animate={pageLoaded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          className="mt-8 h-10 px-5 rounded-full border border-white/15 text-[13px] text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors cursor-pointer"
        >
          Learn more →
        </motion.button>
      </div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={pageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.9, delay: 0.9 }}
        className="hidden lg:flex absolute bottom-10 right-10 z-10 items-center gap-3 px-4 py-3 rounded-[14px] border border-white/10 bg-[#07080a]/70 backdrop-blur-md"
      >
        <span
          className="inline-block w-8 h-8 rounded-full shrink-0"
          style={{ background: `conic-gradient(from 180deg, ${AMBER}, ${CORAL}, ${CRIMSON}, ${AMBER})` }}
        />
        <div className="text-left">
          <div className="text-[11px] font-medium text-[#F4F4F5] leading-tight">72h delivery SLA</div>
          <div className="font-mono text-[10px] text-[#71717A] leading-tight mt-0.5">Every Argus run</div>
        </div>
      </motion.div>
    </section>
  );
}
