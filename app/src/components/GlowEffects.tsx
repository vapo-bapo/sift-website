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
      {/* Stronger inner glow that follows the cursor on hover */}
      <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span
          className="absolute inset-0"
          style={{
            background:
              variant === "primary"
                ? "radial-gradient(circle at 50% 50%, rgba(224, 169, 76, 0.55) 0%, rgba(201, 148, 58, 0.2) 45%, transparent 75%)"
                : "radial-gradient(circle at 50% 50%, rgba(201, 148, 58, 0.35) 0%, rgba(201, 148, 58, 0.1) 45%, transparent 75%)",
            filter: "blur(4px)",
          }}
        />
      </span>

      {/* Animated rim glow */}
      <span
        className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow:
            variant === "primary"
              ? "inset 0 0 20px rgba(224, 169, 76, 0.5), 0 0 18px rgba(201, 148, 58, 0.35)"
              : "inset 0 0 18px rgba(201, 148, 58, 0.25), 0 0 14px rgba(201, 148, 58, 0.2)",
        }}
      />

      {/* Shimmer sweep */}
      <span className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.span
          className="absolute inset-0 -translate-x-full"
          style={{
            background:
              "linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.35) 48%, rgba(255, 255, 255, 0.55) 52%, transparent 70%)",
          }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
        />
      </span>

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

export function DataStream({ className = "" }: { className?: string }) {
  const lines = Array.from({ length: 7 }, (_, i) => i);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {lines.map((i) => (
        <motion.div
          key={i}
          className="absolute w-px bg-gradient-to-b from-transparent via-[#c9943a]/25 to-transparent"
          style={{
            left: `${12 + i * 13}%`,
            height: "100%",
          }}
          animate={{
            opacity: [0.15, 0.45, 0.15],
            scaleY: [1, 1.08, 1],
          }}
          transition={{
            duration: 3 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="absolute w-1 h-1 rounded-full bg-[#c9943a] shadow-[0_0_8px_#c9943a]"
            animate={{
              top: ["-5%", "105%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute w-px rounded-full"
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              background:
                "linear-gradient(to bottom, transparent, rgba(201, 148, 58, 0.7), transparent)",
            }}
            animate={{
              top: ["-15%", "115%"],
              height: ["8%", "18%", "8%"],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 4 + i * 0.6,
              repeat: Infinity,
              delay: i * 0.9,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

export function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  const [glitch, setGlitch] = React.useState(0);

  React.useEffect(() => {
    const triggerGlitch = () => {
      if (Math.random() > 0.65) {
        setGlitch(1);
        window.setTimeout(() => setGlitch(2), 80);
        window.setTimeout(() => setGlitch(1), 160);
        window.setTimeout(() => setGlitch(0), 260);
      }
    };

    const interval = setInterval(triggerGlitch, 4000);
    return () => clearInterval(interval);
  }, []);

  const isGlitching = glitch > 0;
  const offset = glitch === 2 ? 2 : 1;

  return (
    <span className={`relative inline-block ${className}`}>
      <span
        className="relative z-10"
        style={{
          textShadow: isGlitching
            ? `${offset}px 0 rgba(255, 0, 64, 0.65), -${offset}px 0 rgba(0, 255, 255, 0.55)`
            : "none",
          transform: isGlitching ? `translate(${offset * 0.5}px, 0)` : "none",
          transition: "all 0.08s ease-out",
        }}
      >
        {text}
      </span>
      {isGlitching && (
        <>
          <span
            className="absolute top-0 left-0 text-[#ff0040]/70"
            style={{
              clipPath: "inset(15% 0 55% 0)",
              transform: `translate(-${offset + 1}px, 0)`,
              transition: "transform 0.08s ease-out",
            }}
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 text-[#00ffff]/70"
            style={{
              clipPath: "inset(55% 0 15% 0)",
              transform: `translate(${offset + 1}px, 0)`,
              transition: "transform 0.08s ease-out",
            }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}
