import React from "react";
import { motion } from "motion/react";

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}

export function GlowButton({
  children,
  onClick,
  className = "",
  variant = "primary",
}: GlowButtonProps) {
  const baseStyles =
    "relative overflow-hidden transition-all duration-300 ease-out";

  const variants = {
    primary: "bg-[#c9943a] text-[#FFFDF5] hover:bg-[#e0a94c]",
    secondary: "bg-[#FFFDF5]/10 backdrop-blur-md text-[#FFFDF5] hover:bg-[#FFFDF5]/20",
    ghost: "bg-transparent border border-[#c9943a]/50 text-[#c9943a] hover:bg-[#c9943a]/10",
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {/* Glow overlay */}
      <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <span
          className="absolute inset-0"
          style={{
            background:
              variant === "primary"
                ? "radial-gradient(circle at center, rgba(224, 169, 76, 0.4) 0%, transparent 70%)"
                : "radial-gradient(circle at center, rgba(201, 148, 58, 0.2) 0%, transparent 70%)",
          }}
        />
      </span>

      {/* Shine effect */}
      <span className="absolute inset-0 overflow-hidden">
        <motion.span
          className="absolute inset-0 -translate-x-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
          }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </span>

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({
  children,
  className = "",
  glowColor = "#c9943a",
}: GlowCardProps) {
  return (
    <motion.div
      className={`relative group ${className}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Glow effect */}
      <span
        className="absolute -inset-0.5 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}40 0%, transparent 70%)`,
        }}
      />

      {/* Border glow on hover */}
      <span
        className="absolute -inset-px rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${glowColor}30 0%, transparent 50%, ${glowColor}30 100%)`,
          padding: "1px",
        }}
      />

      {/* Content */}
      <div className="relative bg-white border border-[#E8DFC8] rounded-[23px] shadow-[0_12px_40px_rgba(14,12,6,0.08)] group-hover:shadow-[0_20px_60px_rgba(14,12,6,0.12)] transition-shadow duration-300">
        {children}
      </div>
    </motion.div>
  );
}

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FloatingElement({
  children,
  className = "",
  delay = 0,
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

interface PulseRingProps {
  className?: string;
  color?: string;
}

export function PulseRing({ className = "", color = "#c9943a" }: PulseRingProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Static ring */}
      <div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: `${color}30` }}
      />

      {/* Pulsing rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: `${color}40` }}
          animate={{
            scale: [1, 1.5, 1.5],
            opacity: [0.6, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

interface DataStreamProps {
  className?: string;
}

export function DataStream({ className = "" }: DataStreamProps) {
  const lines = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {lines.map((i) => (
        <motion.div
          key={i}
          className="absolute w-px bg-gradient-to-b from-transparent via-[#c9943a]/30 to-transparent"
          style={{
            left: `${20 + i * 15}%`,
            height: "100%",
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        >
          {/* Moving dot */}
          <motion.div
            className="absolute w-1 h-1 rounded-full bg-[#c9943a]"
            animate={{
              top: ["0%", "100%"],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "linear",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

interface ScanlineProps {
  className?: string;
}

export function Scanline({ className = "" }: ScanlineProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9943a]/50 to-transparent"
        animate={{
          top: ["0%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

interface TypewriterTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

export function TypewriterText({
  text,
  className = "",
  delay = 0,
  speed = 50,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = React.useState("");
  const [showCursor, setShowCursor] = React.useState(true);
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  React.useEffect(() => {
    if (!started) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        // Hide cursor after completion
        setTimeout(() => setShowCursor(false), 1000);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed]);

  // Cursor blink
  React.useEffect(() => {
    if (!started || !showCursor) return;

    const blinkInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(blinkInterval);
  }, [started, showCursor]);

  return (
    <span className={className}>
      {displayText}
      {started && showCursor && (
        <span className="inline-block w-[2px] h-[1em] bg-[#c9943a] ml-0.5 animate-pulse" />
      )}
    </span>
  );
}

interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = React.useState(false);

  React.useEffect(() => {
    const triggerGlitch = () => {
      if (Math.random() > 0.7) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    };

    const interval = setInterval(triggerGlitch, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      <span
        className="relative z-10"
        style={{
          textShadow: isGlitching
            ? "2px 0 #ff0040, -2px 0 #00ffff"
            : "none",
          transform: isGlitching ? "translate(2px, 0)" : "none",
          transition: "all 0.05s",
        }}
      >
        {text}
      </span>
      {isGlitching && (
        <>
          <span
            className="absolute top-0 left-0 text-[#ff0040] opacity-70"
            style={{ clipPath: "inset(20% 0 60% 0)", transform: "translate(-2px, 0)" }}
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 text-[#00ffff] opacity-70"
            style={{ clipPath: "inset(60% 0 20% 0)", transform: "translate(2px, 0)" }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}
