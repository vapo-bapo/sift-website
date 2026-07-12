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

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

export function DataStream({ className = "" }: { className?: string }) {
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

export function GlitchText({ text, className = "" }: { text: string; className?: string }) {
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
