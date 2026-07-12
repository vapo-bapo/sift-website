import React from "react";
import { motion } from "motion/react";

interface LetterRevealProps {
  text: string;
  delay?: number;
  stagger?: number;
  trigger?: boolean;
  className?: string;
}

export function LetterReveal({
  text,
  delay = 0,
  stagger = 0.03,
  trigger = true,
  className = "",
}: LetterRevealProps) {
  const chars = text.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay / 1000,
        staggerChildren: stagger,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -40,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 14,
      },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate={trigger ? "visible" : "hidden"}
      style={{ perspective: "400px" }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={child}
          className="inline-block"
          style={{
            transformStyle: "preserve-3d",
            whiteSpace: char === " " ? "pre" : undefined,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
