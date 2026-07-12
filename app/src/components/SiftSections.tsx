import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/* ---------------------------------- Shared ---------------------------------- */

const LIME = "#c9943a";

function usePrefersReducedMotion() {
  return useReducedMotion() ?? false;
}

const revealItemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 18,
      delay,
    },
  }),
};

function ScrollReveal({
  children,
  delay = 0,
  stagger = false,
  staggerDelay = 0.08,
}: {
  children: React.ReactNode;
  delay?: number;
  stagger?: boolean;
  staggerDelay?: number;
  key?: React.Key;
}) {
  const shouldReduceMotion = usePrefersReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  if (stagger) {
    return (
      <motion.div
        className="w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: staggerDelay,
              delayChildren: delay,
            },
          },
        }}
      >
        {React.Children.map(children, (child, i) =>
          child ? (
            <motion.div
              key={i}
              className="w-full"
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.98 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 80,
                    damping: 18,
                  },
                },
              }}
            >
              {child}
            </motion.div>
          ) : null
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={revealItemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      custom={delay}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.08,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delay?: number;
}) {
  const shouldReduceMotion = usePrefersReducedMotion();
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
  key?: React.Key;
}) {
  const shouldReduceMotion = usePrefersReducedMotion();
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 80,
            damping: 18,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Kicker({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = usePrefersReducedMotion();
  const text = typeof children === "string" ? children : "";

  if (shouldReduceMotion || !text) {
    return (
      <div className="flex items-center gap-2.5 mb-6">
        <span
          className="inline-block w-[6px] h-[6px] rounded-full shrink-0"
          style={{ backgroundColor: LIME }}
        />
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#a07828]">
          {children}
        </span>
      </div>
    );
  }

  const words = text.split(" ");

  return (
    <motion.div
      className="flex items-center gap-2.5 mb-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.04,
            delayChildren: 0.05,
          },
        },
      }}
    >
      <motion.span
        className="inline-block w-[6px] h-[6px] rounded-full shrink-0"
        style={{ backgroundColor: LIME }}
        variants={{
          hidden: { scale: 0, opacity: 0 },
          visible: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 20 },
          },
        }}
      />
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { type: "spring", stiffness: 120, damping: 18 },
            },
          }}
          className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#a07828]"
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.div>
  );
}

function SectionHeading({ lines }: { lines: string[] }) {
  const shouldReduceMotion = usePrefersReducedMotion();

  if (shouldReduceMotion) {
    return (
      <h2 className="font-serif font-light text-[38px] sm:text-[52px] md:text-[64px] text-[#0E0C06] leading-[0.98] tracking-[-0.03em]">
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h2>
    );
  }

  return (
    <motion.h2
      className="font-serif font-light text-[38px] sm:text-[52px] md:text-[64px] text-[#0E0C06] leading-[0.98] tracking-[-0.03em]"
      style={{ perspective: 400 }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.06,
            delayChildren: 0.05,
          },
        },
      }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          {line.split(" ").map((word, j) => (
            <motion.span
              key={j}
              variants={{
                hidden: { opacity: 0, y: 28, rotateX: -35 },
                visible: {
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  transition: {
                    type: "spring",
                    stiffness: 80,
                    damping: 18,
                  },
                },
              }}
              className="inline-block mr-[0.25em]"
              style={{ transformOrigin: "bottom left" }}
            >
              {word}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h2>
  );
}

function GlassCard({
  children,
  outerClassName = "",
  innerClassName = "",
  hover = true,
}: {
  children: React.ReactNode;
  outerClassName?: string;
  innerClassName?: string;
  hover?: boolean;
}) {
  const shouldReduceMotion = usePrefersReducedMotion();

  const outerClasses = `p-1.5 rounded-[28px] bg-[#F4EFE0]/70 border border-[#F0E8D4] ${outerClassName}`;
  const innerClasses = `relative overflow-hidden bg-white border border-[#E8DFC8] rounded-[23px] shadow-[0_12px_40px_rgba(14,12,6,0.08)] p-8 h-full ${innerClassName}`;

  if (shouldReduceMotion || !hover) {
    return (
      <div className={outerClasses}>
        <div className={innerClasses}>{children}</div>
      </div>
    );
  }

  return (
    <motion.div
      className={outerClasses}
      initial={{ y: 0 }}
      whileHover={{ y: -6, borderColor: "rgba(201, 148, 58, 0.45)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className={innerClasses}
        whileHover={{ borderColor: "rgba(201, 148, 58, 0.35)" }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          initial={{ x: "-100%", opacity: 0 }}
          whileHover={{ x: "100%", opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background:
              "linear-gradient(105deg, transparent 30%, rgba(201,148,58,0.06) 45%, rgba(201,148,58,0.14) 50%, rgba(201,148,58,0.06) 55%, transparent 70%)",
          }}
        />
        {children}
      </motion.div>
    </motion.div>
  );
}

function PillCta({
  label,
  className = "",
  onClick,
  type = "button",
  magnetic = false,
}: {
  label: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  magnetic?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = usePrefersReducedMotion();

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    if (!magnetic || !ref.current || shouldReduceMotion) return;
    const rect = ref.current.getBoundingClientRect();
    setOffset({
      x: (e.clientX - rect.left - rect.width / 2) * 0.25,
      y: (e.clientY - rect.top - rect.height / 2) * 0.25,
    });
  }

  function handleMouseLeave() {
    setOffset({ x: 0, y: 0 });
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={magnetic ? { x: offset.x, y: offset.y } : undefined}
      whileHover={{ scale: 1.03, backgroundColor: "#e0a94c" }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
      className={`h-12 px-6 bg-[#c9943a] rounded-full text-[#FFFDF5] font-medium text-[15px] flex items-center justify-center gap-2.5 cursor-pointer ${className}`}
    >
      <span>{label.replace(/\s*→\s*$/, "")}</span>
      <span aria-hidden="true">→</span>
    </motion.button>
  );
}

/* -------------------------------- LogoMarquee -------------------------------- */

const MARQUEE_NAMES = [
  "SAAS CO.",
  "FINTECH AG",
  "LOGISTICS SE",
  "AGENCY LTD",
  "GROWTH OÜ",
  "CYBER GMBH",
  "HR TECH SE",
  "NORDIC FIN",
];

export function LogoMarquee() {
  return (
    <div className="w-full max-w-7xl mx-auto py-16 sm:py-20">
      <style>{`
        @keyframes sift-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .sift-marquee-track {
          animation: sift-marquee 30s linear infinite;
        }
        .sift-marquee:hover .sift-marquee-track {
          animation-play-state: paused;
        }
      `}</style>
      <p className="text-center font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#a07828] mb-10">
        Trusted by B2B teams across Europe
      </p>
      <div
        className="sift-marquee relative w-full overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="sift-marquee-track flex w-max items-center">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {MARQUEE_NAMES.map((name) => (
                <span
                  key={`${dup}-${name}`}
                  className="text-[#7A6248]/60 text-[15px] tracking-[0.15em] uppercase whitespace-nowrap px-10"
                >
                  {name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- ProcessSection ------------------------------- */

const PROCESS_STEPS = [
  {
    num: "01",
    label: "ALIGN",
    title: "ICP Definition",
    body: "We align on your ideal customer profile — firmographics, tech stack, buying triggers, and the decision-maker roles that actually sign.",
  },
  {
    num: "02",
    label: "DETECT",
    title: "Signal Scan",
    body: "Argus surfaces accounts in motion: hiring patterns, funding events, leadership changes, tech adoption and intent signals — each one cited.",
  },
  {
    num: "03",
    label: "MAP",
    title: "Deep Map",
    body: "Lynx builds an org-level intelligence layer on your top accounts — stakeholders, structure, the real champion, and the way in.",
  },
  {
    num: "04",
    label: "DELIVER",
    title: "Delivery",
    body: "A scored list, five Lynx workspaces, and a PDF brief — all within 72 hours, exportable to any CRM and ready to sequence.",
  },
];

export function ProcessSection() {
  const shouldReduceMotion = usePrefersReducedMotion();

  return (
    <section id="process" className="w-full max-w-7xl mx-auto py-24 sm:py-32">
      <ScrollReveal>
        <Kicker>The Process</Kicker>
        <SectionHeading lines={["From noise", "to named pipeline."]} />
        <p className="text-[#7A6248] text-[15px] max-w-md mt-6">
          Four steps turn a market full of noise into a scored, sourced, ready-to-sequence list —
          delivered in seventy-two hours.
        </p>
      </ScrollReveal>
      <div className="relative mt-16">
        {!shouldReduceMotion && (
          <>
            <motion.div
              className="hidden lg:block absolute top-[72px] left-[12.5%] right-[12.5%] h-[1px] bg-gradient-to-r from-transparent via-[#c9943a]/40 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              style={{ originX: 0 }}
            />
            <motion.div
              className="lg:hidden absolute top-0 bottom-0 left-[23px] w-[1px] bg-gradient-to-b from-transparent via-[#c9943a]/40 to-transparent"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              style={{ originY: 0 }}
            />
          </>
        )}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10"
          staggerDelay={0.12}
          delay={0.1}
        >
          {PROCESS_STEPS.map((step) => (
            <StaggerItem key={step.num} className="h-full">
              <GlassCard outerClassName="h-full">
                <div className="flex items-center justify-between">
                  <div className="text-[64px] font-light text-[#0E0C06]/10 leading-none">
                    {step.num}
                  </div>
                  {!shouldReduceMotion && (
                    <motion.span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: LIME }}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.4 }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <span
                    className="inline-block w-[4px] h-[4px] rounded-full shrink-0"
                    style={{ backgroundColor: LIME }}
                  />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#a07828]">
                    {step.label}
                  </span>
                </div>
                <h3 className="text-[#0E0C06] text-[18px] font-light mt-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-[#7A6248] text-[13px] leading-relaxed mt-3">{step.body}</p>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ------------------------------- EnginesSection ------------------------------- */

const ENGINES = [
  {
    label: "01 · LEAD GENERATION",
    badge: "72H DELIVERY",
    name: "Argus",
    desc: "Precision lead lists built from your ICP. Every contact arrives with a score, a cited buying trigger, and a ready-to-use outreach hook — delivered in 72 hours.",
    features: [
      "Up to 20 qualified leads per run",
      "Per-contact ICP score (0–100)",
      "Buying trigger, cited and sourced",
      "One-line outreach hook per contact",
    ],
    cta: "BOOK A RUN →",
  },
  {
    label: "02 · ACCOUNT INTELLIGENCE",
    badge: "5 WORKSPACES",
    name: "Lynx",
    desc: "A dedicated workspace for each of your five warmest accounts. Decision-maker maps, 90-day signal feeds, and contextual AI chat — all in one place.",
    features: [
      "Lynx workspace per priority account (×5)",
      "Full decision-maker org chart",
      "90-day news and intent signal feed",
      "AI chat trained on the account",
    ],
    cta: "BOOK A RUN →",
  },
  {
    label: "03 · STRATEGIC BRIEFING",
    badge: "ANALYST SESSION",
    name: "Intelligence",
    desc: "A full strategic brief on a single target company — competitive landscape, internal buying dynamics, and a dedicated analyst session.",
    features: [
      "Deep-dive on one target company",
      "Competitive landscape analysis",
      "Custom ICP refinement included",
      "Direct analyst line for 30 days",
    ],
    cta: "BOOK A RUN →",
  },
];

export function EnginesSection() {
  const shouldReduceMotion = usePrefersReducedMotion();

  return (
    <section id="products" className="w-full max-w-7xl mx-auto py-24 sm:py-32">
      <ScrollReveal>
        <Kicker>Three Engines</Kicker>
        <SectionHeading lines={["One stack.", "Full coverage."]} />
        <p className="text-[#7A6248] text-[15px] max-w-md mt-6">
          Use Argus for lists, add Lynx for depth, add Intelligence for strategy. Stack them to
          build the complete outbound picture.
        </p>
      </ScrollReveal>
      <div className="flex flex-col gap-6 mt-16">
        {ENGINES.map((engine, i) => (
          <ScrollReveal key={engine.name} delay={i * 0.08}>
            <GlassCard innerClassName="p-8 sm:p-12">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#a07828]">
                  {engine.label}
                </span>
                <motion.span
                  className="border border-[#c9943a]/40 text-[#a07828] bg-[#c9943a]/10 text-[10px] px-3 py-1 rounded-full uppercase tracking-widest"
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          boxShadow: [
                            "0 0 0 0 rgba(201,148,58,0)",
                            "0 0 0 4px rgba(201,148,58,0.12)",
                            "0 0 0 0 rgba(201,148,58,0)",
                          ],
                        }
                  }
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {engine.badge}
                </motion.span>
              </div>
              <h3 className="font-serif text-[#0E0C06] text-[44px] sm:text-[56px] font-light tracking-[-0.03em] leading-none mt-8">
                {engine.name}
              </h3>
              <p className="text-[#7A6248] text-[15px] leading-relaxed max-w-xl mt-6">
                {engine.desc}
              </p>
              <motion.ul
                className="mt-8 flex flex-col gap-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.06,
                      delayChildren: 0.15,
                    },
                  },
                }}
              >
                {engine.features.map((feature) => (
                  <motion.li
                    key={feature}
                    variants={{
                      hidden: { opacity: 0, x: -12 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: { type: "spring", stiffness: 120, damping: 18 },
                      },
                    }}
                    className="flex items-center gap-3"
                  >
                    <span
                      className="inline-block w-[4px] h-[4px] rounded-full shrink-0"
                      style={{ backgroundColor: LIME }}
                    />
                    <span className="text-[13px] text-[#3A2810]">{feature}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <div className="mt-10">
                <PillCta label={engine.cta} onClick={scrollToContact} className="w-fit" magnetic />
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- PricingSection ------------------------------- */

const TIERS = [
  {
    label: "ON-DEMAND · TIER 01",
    name: "Argus Starter",
    desc: "Single run for a focused outbound push. Test the engine before committing.",
    features: [
      "Up to 20 qualified leads",
      "Per-contact ICP score (0–100)",
      "Buying trigger, cited",
      "One-line outreach hook per contact",
      "PDF + DOCX delivery in 72h",
    ],
    cta: "BOOK A RUN →",
    recommended: false,
  },
  {
    label: "ON-DEMAND · TIER 02",
    name: "Argus + Lynx",
    desc: "List + deep map of your best five accounts. Built for warm-lane outbound.",
    features: [
      "Everything in Argus Starter",
      "Lynx workspace on 5 priority accounts",
      "Full decision-maker mapping",
      "Contextual AI chat on each account",
      "Recent news feed (90 days)",
    ],
    cta: "BOOK THIS STACK →",
    recommended: true,
  },
  {
    label: "ON-DEMAND · TIER 03",
    name: "Full Suite",
    desc: "Argus + Lynx + Intelligence + a strategic session with the team.",
    features: [
      "Everything in Argus + Lynx",
      "Intelligence brief on one target",
      "Dedicated analyst session",
      "Custom ICP refinement",
      "Direct line for 30 days",
    ],
    cta: "BOOK THE SUITE →",
    recommended: false,
  },
];

export function PricingSection() {
  const shouldReduceMotion = usePrefersReducedMotion();

  return (
    <section id="pricing" className="w-full max-w-7xl mx-auto py-24 sm:py-32">
      <ScrollReveal>
        <Kicker>Pricing</Kicker>
        <SectionHeading lines={["Simple pricing.", "No lock-in."]} />
        <p className="text-[#7A6248] text-[15px] max-w-md mt-6">
          Start with one on-demand run. Move to a retainer when outbound becomes a discipline.
        </p>
      </ScrollReveal>
      <StaggerContainer
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 items-stretch"
        staggerDelay={0.12}
      >
        {TIERS.map((tier) => (
          <StaggerItem key={tier.name} className="h-full">
            <motion.div
              className={`relative h-full p-1.5 rounded-[28px] border ${
                tier.recommended
                  ? "bg-[#c9943a]/15 border-[#c9943a]/30"
                  : "bg-[#F4EFE0]/70 border-[#F0E8D4]"
              }`}
              animate={
                tier.recommended && !shouldReduceMotion
                  ? {
                      boxShadow: [
                        "0 0 0 1px rgba(201,148,58,0.25), 0 12px 40px rgba(14,12,6,0.08)",
                        "0 0 0 3px rgba(201,148,58,0.45), 0 12px 48px rgba(201,148,58,0.18)",
                        "0 0 0 1px rgba(201,148,58,0.25), 0 12px 40px rgba(14,12,6,0.08)",
                      ],
                      borderColor: [
                        "rgba(201,148,58,0.3)",
                        "rgba(201,148,58,0.55)",
                        "rgba(201,148,58,0.3)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {tier.recommended && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#FFFDF5] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest"
                  style={{ backgroundColor: LIME }}
                >
                  Recommended
                </span>
              )}
              <div className="bg-white border border-[#E8DFC8] rounded-[23px] shadow-[0_12px_40px_rgba(14,12,6,0.08)] p-8 h-full flex flex-col">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#a07828]">
                  {tier.label}
                </span>
                <h3 className="font-serif text-[#0E0C06] text-[28px] font-light tracking-tight mt-4">
                  {tier.name}
                </h3>
                <p className="text-[13px] text-[#7A6248] tracking-widest uppercase mt-2">
                  Pricing on request
                </p>
                <p className="text-[#7A6248] text-[13px] leading-relaxed mt-4">{tier.desc}</p>
                <ul className="mt-6 flex flex-col gap-3 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <span className="inline-block w-[4px] h-[4px] rounded-full bg-[#CFC0A0] shrink-0" />
                      <span className="text-[13px] text-[#3A2810]">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <PillCta label={tier.cta} onClick={scrollToContact} className="w-full" />
                </div>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
      <ScrollReveal delay={0.24}>
        <p className="mt-12 flex items-center justify-center gap-3 text-center text-[11px] uppercase tracking-[0.15em] text-[#7A6248]/70">
          <span>First Argus run free for qualified agencies</span>
          <span
            className="inline-block w-[4px] h-[4px] rounded-full shrink-0"
            style={{ backgroundColor: LIME }}
          />
          <span>Custom builds on request</span>
        </p>
      </ScrollReveal>
    </section>
  );
}

/* -------------------------------- FaqSection -------------------------------- */

const FAQS = [
  {
    q: "How quickly will I receive my deliverables?",
    a: "Standard SLA is 72 hours from ICP brief confirmation. Pro and Agency retainers run on 48h. Full Suite runs are prioritised.",
  },
  {
    q: "What if the leads don't match my ICP?",
    a: "We offer a free revision on any run where more than 20% of leads fall outside the agreed criteria. Your brief is binding — so are we.",
  },
  {
    q: "Can I start on-demand and move to a retainer?",
    a: "Yes. Most clients start with Argus Starter or Argus + Lynx, then move to a retainer after the first qualified conversation books.",
  },
  {
    q: 'What does "first run free for qualified agencies" mean?',
    a: "Agencies running outbound for clients qualify for a complimentary Argus Starter run. Send a brief and we confirm eligibility within 24 hours.",
  },
  {
    q: "In what format are deliverables sent?",
    a: "Every run includes a PDF and DOCX file. Lynx workspaces are shared via link. Intelligence briefs include a written document plus the live session.",
  },
  {
    q: "Do you offer custom builds?",
    a: "Yes — for teams with specific data sources, CRM integrations, or workflow requirements. Contact us to scope a custom build.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const shouldReduceMotion = usePrefersReducedMotion();

  return (
    <section id="faq" className="w-full max-w-7xl mx-auto py-24 sm:py-32">
      <ScrollReveal>
        <Kicker>FAQ</Kicker>
        <SectionHeading lines={["Common", "questions."]} />
      </ScrollReveal>
      <ScrollReveal delay={0.08}>
        <div className="mt-16 p-1.5 rounded-[28px] bg-[#F4EFE0]/70 border border-[#F0E8D4]">
          <div className="bg-white border border-[#E8DFC8] rounded-[23px] shadow-[0_12px_40px_rgba(14,12,6,0.08)] px-8">
            {FAQS.map((faq, i) => {
              const open = openIndex === i;
              return (
                <div
                  key={faq.q}
                  className={i > 0 ? "border-t border-[#F0E8D4]" : undefined}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left cursor-pointer"
                  >
                    <span className="text-[15px] sm:text-[17px] text-[#0E0C06]">{faq.q}</span>
                    <span
                      className="relative w-5 h-5 flex items-center justify-center shrink-0"
                      aria-hidden="true"
                    >
                      <motion.span
                        className="absolute w-[14px] h-[2px] bg-[#c9943a] rounded-full"
                        animate={{ rotate: open ? 45 : 0 }}
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 300, damping: 22 }
                        }
                      />
                      <motion.span
                        className="absolute w-[14px] h-[2px] bg-[#c9943a] rounded-full"
                        animate={{ rotate: open ? -45 : 90 }}
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 300, damping: 22 }
                        }
                      />
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 200, damping: 26 }
                    }
                    className="overflow-hidden"
                  >
                    <motion.p
                      className="text-[#7A6248] text-[13px] leading-relaxed pb-6 pr-10"
                      initial={false}
                      animate={{
                        opacity: open ? 1 : 0,
                        y: open ? 0 : 6,
                      }}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { duration: 0.25, ease: "easeOut" }
                      }
                    >
                      {faq.a}
                    </motion.p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

/* ------------------------------- ContactSection ------------------------------- */

const NEXT_STEPS = [
  "We review your ICP brief manually",
  "Proposal arrives within 24 hours",
  "One alignment call if needed (30 min)",
  "Run confirmed — delivery in 72 hours",
  "Free revision if leads miss the brief",
];

const INPUT_CLASS =
  "w-full bg-[#FFFDF5] border border-[#E8DFC8] rounded-[12px] px-4 py-3 text-[14px] text-[#0E0C06] placeholder-[#7A6248]/50 outline-none focus:border-[#c9943a] focus:shadow-[0_0_0_3px_rgba(201,148,58,0.12)] transition-all";

const FIELD_LABEL_CLASS =
  "block font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#a07828] mb-2";

export function ContactSection() {
  const [sent, setSent] = useState(false);
  const shouldReduceMotion = usePrefersReducedMotion();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const get = (name: string) => String(data.get(name) ?? "");
    const bodyLines = [
      `First name: ${get("firstName")}`,
      `Last name: ${get("lastName")}`,
      `Company: ${get("company")}`,
      `Work email: ${get("workEmail")}`,
      `Looking for: ${get("lookingFor")}`,
      `Target market & geography: ${get("targetMarket")}`,
      `Target role(s): ${get("targetRoles")}`,
      "",
      "ICP details:",
      get("icp"),
    ];
    const mailto = `mailto:general@sifttechnology.com?subject=${encodeURIComponent(
      "SIFT — ICP Brief"
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    window.location.href = mailto;
    setSent(true);
    window.setTimeout(() => setSent(false), 4000);
  }

  return (
    <section id="contact" className="w-full max-w-7xl mx-auto py-24 sm:py-32">
      <ScrollReveal>
        <Kicker>Ready When You Are</Kicker>
        <SectionHeading lines={["Let's scope", "your run."]} />
        <p className="text-[#7A6248] text-[15px] max-w-md mt-6">
          Tell us your ICP. We'll send a proposal within 24 hours and confirm your run slot.
        </p>
      </ScrollReveal>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-16 items-start">
        <ScrollReveal delay={0.08}>
          <h3 className="text-[22px] font-light text-[#0E0C06] tracking-tight">
            A signal scan starts with a brief.
          </h3>
          <p className="text-[#7A6248] text-[13px] leading-relaxed mt-4 max-w-md">
            Fill in your ICP, target market, and what you're trying to accomplish. We review it
            manually and come back with the right product recommendation and a scoped proposal —
            within 24 hours.
          </p>
          <div className="mt-10 flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-4 border-b border-[#F0E8D4] pb-4">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#a07828]">
                Email
              </span>
              <a
                href="mailto:general@sifttechnology.com"
                className="text-[14px] text-[#0E0C06] hover:text-[#3A2810] transition-colors"
              >
                general@sifttechnology.com
              </a>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-[#F0E8D4] pb-4">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#a07828]">
                Response Time
              </span>
              <span className="text-[14px] text-[#0E0C06]">Within 24 hours</span>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-[#F0E8D4] pb-4">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#a07828]">
                Delivery SLA
              </span>
              <span className="text-[14px] text-[#0E0C06]">72h from brief confirmation</span>
            </div>
          </div>
          <div className="mt-12">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#a07828] mb-6">
              What Happens Next
            </p>
            <motion.ol
              className="flex flex-col gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.1,
                  },
                },
              }}
            >
              {NEXT_STEPS.map((step, i) => (
                <motion.li
                  key={step}
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { type: "spring", stiffness: 100, damping: 18 },
                    },
                  }}
                  className="flex items-center gap-4"
                >
                  <span
                    className="flex items-center justify-center w-7 h-7 rounded-full border text-[11px] shrink-0"
                    style={{ borderColor: "rgba(201, 148, 58, 0.5)", color: "#a07828" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[13px] text-[#3A2810]">{step}</span>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.16}>
          <GlassCard>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="sift-first-name" className={FIELD_LABEL_CLASS}>
                    First Name
                  </label>
                  <input
                    id="sift-first-name"
                    name="firstName"
                    type="text"
                    className={INPUT_CLASS}
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label htmlFor="sift-last-name" className={FIELD_LABEL_CLASS}>
                    Last Name
                  </label>
                  <input
                    id="sift-last-name"
                    name="lastName"
                    type="text"
                    className={INPUT_CLASS}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="sift-company" className={FIELD_LABEL_CLASS}>
                  Company
                </label>
                <input
                  id="sift-company"
                  name="company"
                  type="text"
                  className={INPUT_CLASS}
                  placeholder="Company name"
                />
              </div>
              <div>
                <label htmlFor="sift-work-email" className={FIELD_LABEL_CLASS}>
                  Work Email
                </label>
                <input
                  id="sift-work-email"
                  name="workEmail"
                  type="email"
                  className={INPUT_CLASS}
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label htmlFor="sift-looking-for" className={FIELD_LABEL_CLASS}>
                  What Are You Looking For?
                </label>
                <select
                  id="sift-looking-for"
                  name="lookingFor"
                  defaultValue=""
                  className={`${INPUT_CLASS} appearance-none bg-transparent cursor-pointer`}
                >
                  <option value="">
                    Select a product
                  </option>
                  <option value="Argus — Lead Generation">
                    Argus — Lead Generation
                  </option>
                  <option value="Lynx — Account Intelligence">
                    Lynx — Account Intelligence
                  </option>
                  <option
                    value="Intelligence — Strategic Briefing"
                                     >
                    Intelligence — Strategic Briefing
                  </option>
                  <option value="Full Suite">
                    Full Suite
                  </option>
                  <option value="Not sure yet">
                    Not sure yet
                  </option>
                </select>
              </div>
              <div>
                <label htmlFor="sift-target-market" className={FIELD_LABEL_CLASS}>
                  Target Market &amp; Geography
                </label>
                <input
                  id="sift-target-market"
                  name="targetMarket"
                  type="text"
                  className={INPUT_CLASS}
                  placeholder="e.g. Mid-market SaaS, DACH, 50–500 employees"
                />
              </div>
              <div>
                <label htmlFor="sift-target-roles" className={FIELD_LABEL_CLASS}>
                  Target Role(s)
                </label>
                <input
                  id="sift-target-roles"
                  name="targetRoles"
                  type="text"
                  className={INPUT_CLASS}
                  placeholder="e.g. Head of Sales, VP Engineering, CFO"
                />
              </div>
              <div>
                <label htmlFor="sift-icp" className={FIELD_LABEL_CLASS}>
                  Your ICP — Tell Us More
                </label>
                <textarea
                  id="sift-icp"
                  name="icp"
                  rows={4}
                  className={`${INPUT_CLASS} resize-none`}
                  placeholder="What problem do you solve? What signals indicate a company is ready to buy? Any industries, tech, or triggers to prioritise?"
                />
              </div>
              <p className="text-[11px] text-[#7A6248]/70">
                All briefs are reviewed manually. We reply within 24 hours with a recommendation
                and scoped proposal.
              </p>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`h-12 px-6 rounded-full font-medium text-[15px] flex items-center justify-center gap-2.5 w-full cursor-pointer transition-colors ${
                  sent ? "bg-[#c9943a]/15" : "bg-[#c9943a] text-[#FFFDF5]"
                }`}
                style={sent ? { color: "#a07828" } : undefined}
              >
                {sent ? (
                  <>
                    <motion.span
                      initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 300, damping: 20 }
                      }
                    >
                      BRIEF SENT
                    </motion.span>
                    <motion.svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 300, damping: 20, delay: 0.1 }
                      }
                    >
                      <motion.path
                        d="M5 12l5 5L20 7"
                        initial={shouldReduceMotion ? {} : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { duration: 0.35, ease: "easeOut", delay: 0.15 }
                        }
                      />
                    </motion.svg>
                  </>
                ) : (
                  <>
                    <span>SEND BRIEF</span>
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </motion.button>
            </form>
          </GlassCard>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* --------------------------------- SiftFooter --------------------------------- */

const FOOTER_LINKS = [
  { label: "Products", id: "products" },
  { label: "Process", id: "process" },
  { label: "Pricing", id: "pricing" },
  { label: "FAQ", id: "faq" },
  { label: "Contact", id: "contact" },
];

export function SiftFooter() {
  return (
    <ScrollReveal>
      <footer className="w-full py-16">
        <div className="max-w-7xl mx-auto bg-[#070600] rounded-[28px] px-8 sm:px-14 py-16">
          <p className="font-serif text-[20px] sm:text-[26px] font-light text-[#FFFDF5]/90 max-w-2xl leading-snug">
            Cold lists lose. Context wins. SIFT turns scattered market signal into the few accounts
            worth your next call.
          </p>
          <div className="mt-14 flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-t border-[#FFFDF5]/10 pt-10">
            <div>
              <div className="text-[22px] font-bold tracking-tight text-[#FFFDF5]">SIFT</div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#e0a94c] mt-1">
                Signal Intelligence · EMEA
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToId(link.id)}
                  className="text-[13px] text-[#FFFDF5]/60 hover:text-[#FFFDF5] transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>
          <p className="mt-12 text-[11px] text-[#FFFDF5]/35">© 2025 SIFT Signal Intelligence</p>
        </div>
      </footer>
    </ScrollReveal>
  );
}
