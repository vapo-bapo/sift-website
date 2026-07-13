import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate, useSpring } from "motion/react";
import Lenis from "lenis";
import { ScrambleText } from "./components/ScrambleText";
import { StatsGrid } from "./components/StatsGrid";
import { ParticleBackground } from "./components/ParticleBackground";
import { NetworkBackground } from "./components/NetworkBackground";
import { FuturisticCursor } from "./components/FuturisticCursor";

import {
  ProcessSection,
  EnginesSection,
  PricingSection,
  FaqSection,
  ContactSection,
  SiftFooter,
} from "./components/SiftSections";

// Reusable ScrollReveal component replicating clean spring slide-reveal animation logic
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 18,
        delay,
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

// Ultra-premium, mathematically centered Squash Hamburger icon
function SquashHamburger({ isOpen, isMobile = false }: { isOpen: boolean; isMobile?: boolean }) {
  const width = isMobile ? "w-[15px]" : "w-[18px]";
  const height = isMobile ? "h-[10px]" : "h-[12px]";
  const thickness = isMobile ? "h-[1.2px]" : "h-[1.5px]";
  const topMiddle = isMobile ? "top-[4px]" : "top-[5px]";
  const topBottom = isMobile ? "top-[8px]" : "top-[10px]";
  const yShift = isMobile ? 4 : 5;

  return (
    <div className={`${width} ${height} flex flex-col justify-between items-center relative select-none shrink-0`}>
      <motion.span
        animate={isOpen ? { rotate: 45, y: yShift } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`${width} ${thickness} bg-[#FFFDF5] rounded-full absolute top-0 left-0`}
        style={{ transformOrigin: "center" }}
      />
      <motion.span
        animate={isOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`${width} ${thickness} bg-[#FFFDF5] rounded-full absolute ${topMiddle} left-0`}
      />
      <motion.span
        animate={isOpen ? { rotate: -45, y: -yShift } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`${width} ${thickness} bg-[#FFFDF5] rounded-full absolute ${topBottom} left-0`}
        style={{ transformOrigin: "center" }}
      />
    </div>
  );
}

// SIFT logomark: four converging signal quadrants (kept from the template's abstract mark)
function SiftLogoMark({ className }: { className: string }) {
  return (
    <svg viewBox="-50 -50 100 100" className={className}>
      <g fill="currentColor">
        <path d="M 1.5,23 L 1.5,33 C 1.5,38.5 6,43 11.5,43 L 16.5,43 C 22,43 26.5,38.5 26.5,33 Q 28,28 33,26.5 C 38.5,26.5 43,22 43,16.5 L 43,11.5 C 43,6 38.5,1.5 33,1.5 L 23,1.5 Q 12,12 1.5,23 Z" />
        <path d="M 1.5,23 L 1.5,33 C 1.5,38.5 6,43 11.5,43 L 16.5,43 C 22,43 26.5,38.5 26.5,33 Q 28,28 33,26.5 C 38.5,26.5 43,22 43,16.5 L 43,11.5 C 43,6 38.5,1.5 33,1.5 L 23,1.5 Q 12,12 1.5,23 Z" transform="rotate(90)" />
        <path d="M 1.5,23 L 1.5,33 C 1.5,38.5 6,43 11.5,43 L 16.5,43 C 22,43 26.5,38.5 26.5,33 Q 28,28 33,26.5 C 38.5,26.5 43,22 43,16.5 L 43,11.5 C 43,6 38.5,1.5 33,1.5 L 23,1.5 Q 12,12 1.5,23 Z" transform="rotate(180)" />
        <path d="M 1.5,23 L 1.5,33 C 1.5,38.5 6,43 11.5,43 L 16.5,43 C 22,43 26.5,38.5 26.5,33 Q 28,28 33,26.5 C 38.5,26.5 43,22 43,16.5 L 43,11.5 C 43,6 38.5,1.5 33,1.5 L 23,1.5 Q 12,12 1.5,23 Z" transform="rotate(270)" />
      </g>
    </svg>
  );
}

// Desktop nav item with scramble-on-hover, shared by the expanding menu pill
function NavItem({ label, onNavigate }: { label: string; onNavigate: () => void; key?: React.Key }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onNavigate}
      className="font-sans font-normal text-[15px] text-[#FFFDF5]/85 hover:text-[#FFFDF5] cursor-pointer transition-colors leading-[1]"
    >
      <ScrambleText text={label} isHovered={isHovered} className="text-[#FFFDF5]/85 hover:text-[#FFFDF5]" />
    </span>
  );
}

const NAV_LINKS: { label: string; id: string }[] = [
  { label: "Products", id: "products" },
  { label: "Pricing", id: "pricing" },
  { label: "FAQ", id: "faq" },
  { label: "Contact", id: "contact" },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookHovered, setIsBookHovered] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  const lenisRef = useRef<Lenis | null>(null);
  const cinematicRef = useRef<HTMLDivElement | null>(null);

  const { scrollY } = useScroll();

  // Ultra-smooth dynamic inertia spring config for a slower, cinematic, liquid movement on desktop scroll
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 15,
    damping: 32,
    mass: 1.8,
    restDelta: 0.01
  });

  // Hero fades run on absolute pixels so they stay identical no matter how long the page grows
  const heroOpacity = useTransform(smoothScrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(smoothScrollY, [0, 600], [1, 0.96]);

  // Cinematic paragraph block: scroll progress scoped to its own viewport window
  const { scrollYProgress: cineProgress } = useScroll({
    target: cinematicRef,
    offset: ["start end", "end start"],
  });
  const cineSpring = useSpring(cineProgress, { stiffness: 45, damping: 20, restDelta: 0.001 });
  const cinematicOpacity = useTransform(cineSpring, [0.12, 0.38, 0.62, 0.88], [0, 1, 1, 0]);
  const cineY = useTransform(cineSpring, [0, 1], [90, -130]);
  const transform = useMotionTemplate`rotateX(24deg) translateY(${cineY}px) translateZ(15px)`;

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -32 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Set default values and setup native scroll listeners
  useEffect(() => {
    // Page loaded animation
    setPageLoaded(true);

    const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const smallScreen = window.innerWidth < 768;
    const isMobileDevice = mobileUA || smallScreen;

    let lenis: Lenis | null = null;
    let rafId: number;

    if (!isMobileDevice) {
      // Initialize Lenis smooth scroll engine only on desktop
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Premium exponential deceleration
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
      });
      lenisRef.current = lenis;

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <div
      id="edra-root-canvas"
      className="relative w-full min-h-screen bg-[#FFFDF5] select-none overflow-x-hidden"
    >
      {/* FUTURISTIC CURSOR */}
      <FuturisticCursor />

      {/* PARTICLE BACKGROUND */}
      <ParticleBackground />

      {/* HEADER SECTION: Fixed smoothly to top of viewport */}
      <motion.header
        id="edra-main-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: pageLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 h-20 px-4 sm:px-8 flex items-center justify-between z-50 bg-transparent pointer-events-auto"
      >
        {/* DESKTOP / TABLET HEADER LAYOUT (visible on sm: and up) */}
        <div id="edra-desktop-header" className="hidden sm:flex items-center justify-between w-full h-full">
          <div id="header-left-group" className="flex items-center gap-2">
            {/* Logo Button: warm paper pill, readable on both the dark hero and the cream body */}
            <motion.button
              id="edra-logo-pill"
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setIsMenuOpen(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`h-12 px-5 bg-[#FFFDF5]/95 backdrop-blur-md border border-[#E8DFC8] rounded-[14px] flex items-center gap-2.5 cursor-pointer transition-colors duration-150 shadow-[0_4px_16px_rgba(14,12,6,0.09)] ${isMenuOpen ? "hidden md:flex" : "flex"}`}
            >
              <SiftLogoMark className="w-[18px] h-[18px] text-[#c9943a] shrink-0" />
              <span className="font-sans text-[16px] font-bold tracking-tight text-[#0E0C06] leading-none">
                SIFT
              </span>
            </motion.button>

            {/* Expanding Menu Pill Button (Skiper3 Inspired Layout with Squash Hamburger) */}
            <motion.div
              id="edra-hamburger-btn"
              layout
              initial={false}
              animate={{
                width: !isMenuOpen ? 48 : "440px",
                backgroundColor: "rgba(14,12,6,0.92)"
              }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="h-12 rounded-[14px] flex items-center overflow-hidden backdrop-blur-md relative font-sans shadow-[0_4px_16px_rgba(14,12,6,0.12)]"
            >
              {/* Stable, single menu button - NO unmounts, perfect squash animation */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`flex items-center justify-center text-[#FFFDF5] cursor-pointer shrink-0 transition-all duration-200 z-10 shadow-none border-none outline-none focus:outline-none active:outline-none ${
                  isMenuOpen
                    ? "w-9 h-9 rounded-[11px] bg-[#FFFDF5]/10 hover:bg-[#FFFDF5]/20 ml-1.5 shadow-none"
                    : "w-12 h-12 rounded-[14px] shadow-none"
                }`}
                aria-label="Toggle Menu"
              >
                <SquashHamburger isOpen={isMenuOpen} />
              </button>

              {/* Slider content that shows when open */}
              <motion.div
                initial={false}
                animate={{
                  opacity: isMenuOpen ? 1 : 0,
                  x: isMenuOpen ? 0 : 15,
                  pointerEvents: isMenuOpen ? "auto" : "none"
                }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-5 ml-auto pr-6 shrink-0"
              >
                {NAV_LINKS.map((link) => (
                  <NavItem key={link.id} label={link.label} onNavigate={() => scrollToId(link.id)} />
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT GROUP: Book a Run header pill button */}
          <div id="header-right-group">
            <motion.button
              id="edra-book-demo-pill"
              type="button"
              onClick={() => scrollToId("contact")}
              onMouseEnter={() => setIsBookHovered(true)}
              onMouseLeave={() => setIsBookHovered(false)}
              whileHover={{ scale: 1.03, backgroundColor: "#e0a94c" }}
              whileTap={{ scale: 0.97 }}
              className="h-12 px-6 bg-[#c9943a] rounded-full flex items-center gap-2.5 cursor-pointer transition-all duration-150 shadow-[0_4px_16px_rgba(201,148,58,0.35)] text-[#FFFDF5] decoration-none"
            >
              <ScrambleText
                text="Book a Run"
                isHovered={isBookHovered}
                className="font-sans font-medium text-[16px] text-[#FFFDF5] normal-case leading-none"
              />
              <span className="text-[15px] leading-none -translate-y-[1px]">→</span>
            </motion.button>
          </div>
        </div>

        {/* MOBILE HEADER LAYOUT (visible on screens < sm) */}
        <div id="edra-mobile-header" className="flex sm:hidden items-center justify-between w-full h-full gap-2 relative">
          {/* Combined Left Container (fluid and perfectly balanced to avoid layout shifts) */}
          <div className="flex items-center h-9 flex-grow min-w-0 mr-4 relative">
            {/* Logo Button on Left with smooth pixel-based width and padding collapse to prevent wrapping or snapping */}
            <motion.button
              id="edra-logo-pill-mobile"
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setIsMobileMenuOpen(false);
              }}
              initial={false}
              animate={{
                opacity: isMobileMenuOpen ? 0 : 1,
                scale: isMobileMenuOpen ? 0.93 : 1,
                width: isMobileMenuOpen ? 0 : 76,
                marginRight: isMobileMenuOpen ? 0 : 6,
                paddingLeft: isMobileMenuOpen ? 0 : 12,
                paddingRight: isMobileMenuOpen ? 0 : 12,
                pointerEvents: isMobileMenuOpen ? "none" : "auto"
              }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="h-9 bg-[#FFFDF5]/95 backdrop-blur-md border border-[#E8DFC8] rounded-[10px] flex items-center justify-start gap-1.5 cursor-pointer shrink-0 overflow-hidden shadow-none outline-none whitespace-nowrap flex-nowrap"
            >
              <SiftLogoMark className="w-[14px] h-[14px] text-[#c9943a] shrink-0" />
              <span className="font-sans text-[13px] font-bold tracking-tight text-[#0E0C06] leading-none shrink-0">
                SIFT
              </span>
            </motion.button>

            {/* Inline Mini-Expanding Capsule Menu matching landscape slide mechanics */}
            <motion.div
              id="edra-hamburger-capsule-mobile"
              layout
              initial={false}
              animate={{
                width: !isMobileMenuOpen ? 36 : "100%",
                backgroundColor: "rgba(14,12,6,0.92)"
              }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="h-9 rounded-[10px] flex items-center overflow-hidden backdrop-blur-md relative font-sans shadow-none border-none shrink-0"
            >
              {/* Squash Hamburger for mobile inside the capsule container with background */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`flex items-center justify-center text-[#FFFDF5] cursor-pointer shrink-0 z-10 shadow-none border-none outline-none focus:outline-none active:outline-none transition-all duration-200 ${
                  isMobileMenuOpen
                    ? "w-7 h-7 rounded-[8px] bg-[#FFFDF5]/10 hover:bg-[#FFFDF5]/20 ml-1"
                    : "w-9 h-9 rounded-[10px]"
                }`}
                aria-label="Toggle Menu Mobile"
              >
                <SquashHamburger isOpen={isMobileMenuOpen} isMobile={true} />
              </button>

              {/* Slider content that shows when open */}
              <motion.div
                initial={false}
                animate={{
                  opacity: isMobileMenuOpen ? 1 : 0,
                  x: isMobileMenuOpen ? 0 : 10,
                  pointerEvents: isMobileMenuOpen ? "auto" : "none"
                }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3.5 ml-auto pr-3.5 shrink-0"
              >
                {NAV_LINKS.map((link) => (
                  <span
                    key={link.id}
                    onClick={() => scrollToId(link.id)}
                    className="font-sans font-normal text-[12px] text-[#FFFDF5]/85 hover:text-[#FFFDF5] cursor-pointer transition-colors leading-[1]"
                  >
                    {link.label}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Right Mobile Side: Beautifully scaled down Book a Run button (always in its place in the normal layout flow) */}
          <motion.button
            id="edra-book-demo-pill-mobile"
            type="button"
            onClick={() => scrollToId("contact")}
            whileHover={{ scale: 1.03, backgroundColor: "#e0a94c" }}
            whileTap={{ scale: 0.97 }}
            className="h-9 px-3.5 bg-[#c9943a] rounded-full flex items-center gap-1.5 cursor-pointer shadow-none text-[#FFFDF5] decoration-none shrink-0"
          >
            <span className="font-sans font-medium text-[13px] text-[#FFFDF5] normal-case leading-none">
              Book a Run
            </span>
            <span className="text-[12px] leading-none -translate-y-[0.5px]">→</span>
          </motion.button>
        </div>
      </motion.header>

      {/* MAIN CONTAINER */}
      <motion.main
        id="edra-main-scrolling-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: pageLoaded ? 1 : 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="relative w-full flex flex-col z-10 pointer-events-auto"
      >
        {/* SECTION 1: Aether-style network-field hero */}
        <section className="relative w-full min-h-[100svh] bg-[#070600] overflow-hidden">
          {/* WebGL node network field */}
          <NetworkBackground />

          {/* Soft vignette to keep text legible */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,6,0,0.4)_100%)] pointer-events-none z-[1]" />

          {/* Bottom hand-off gradient: dark void dissolves into the warm paper body */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-[#070600]/40 to-[#FFFDF5] pointer-events-none z-[2]" />

          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="relative z-[3] w-full max-w-7xl mx-auto flex flex-col min-h-[100svh] justify-center px-4 sm:px-8 pt-28 pb-24 pointer-events-auto"
          >
            <div className="w-full flex flex-col items-center text-center">
              {/* Bounded glass card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={pageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 1, ease: [0.215, 0.610, 0.355, 1.000], delay: 0.1 }}
                className="w-full max-w-3xl p-[1px] rounded-[28px] bg-gradient-to-b from-[#FFFDF5]/20 via-[#FFFDF5]/5 to-transparent"
              >
                <div className="w-full h-full rounded-[28px] bg-[#070600]/60 backdrop-blur-xl border border-[#FFFDF5]/10 px-6 py-12 sm:px-12 sm:py-16">
                  {/* Kicker */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={pageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="flex items-center justify-center gap-2.5 mb-8"
                  >
                    <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#c9943a]" />
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#e0a94c]">
                      Signal Intelligence
                    </span>
                  </motion.div>

                  {/* Headline */}
                  <h1 className="font-serif font-light text-[46px] sm:text-[62px] md:text-[78px] lg:text-[90px] text-[#FFFDF5] leading-[0.95] tracking-[-0.03em]">
                    <span className="block">Your Pipeline,</span>
                    <span className="block italic">Signal Driven.</span>
                  </h1>

                  {/* Body */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={pageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.9, ease: [0.215, 0.610, 0.355, 1.000], delay: 0.35 }}
                    className="font-sans text-[15px] sm:text-[16px] text-[#FFFDF5]/65 leading-relaxed max-w-xl mx-auto mt-8"
                  >
                    SIFT identifies, qualifies, and deep-maps your best accounts so your team arrives at every call with context — not a cold list.
                  </motion.p>

                  {/* CTAs */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={pageLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.9, ease: [0.215, 0.610, 0.355, 1.000], delay: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-3 mt-10"
                  >
                    <motion.button
                      type="button"
                      onClick={() => scrollToId("contact")}
                      whileHover={{ scale: 1.03, backgroundColor: "#e0a94c" }}
                      whileTap={{ scale: 0.97 }}
                      className="h-12 px-7 bg-[#c9943a] rounded-full flex items-center gap-2 cursor-pointer text-[#FFFDF5] font-sans font-medium text-[15px] shadow-[0_4px_16px_rgba(201,148,58,0.35)]"
                    >
                      Book a Run
                      <span className="text-[14px] leading-none">→</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => scrollToId("process")}
                      whileHover={{ scale: 1.03, backgroundColor: "rgba(255,253,245,0.18)" }}
                      whileTap={{ scale: 0.97 }}
                      className="h-12 px-7 bg-[#FFFDF5]/10 backdrop-blur-md border border-[#FFFDF5]/10 rounded-full flex items-center cursor-pointer text-[#FFFDF5]/85 font-sans font-normal text-[15px]"
                    >
                      How it works
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* WARM PAPER BODY */}
        <div className="relative w-full flex flex-col px-4 sm:px-8 pb-36">
          {/* Ambient background grid on paper */}
          <div className="absolute inset-0 bg-[radial-gradient(#0E0C06_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

          {/* SECTION 1.5: Cinematic Scroll Perspective Paragraph Block */}
          <div
            ref={cinematicRef}
            className="relative w-full max-w-5xl mx-auto py-24 sm:py-32 pointer-events-none"
            style={{
              transformStyle: "preserve-3d",
              perspective: "400px",
            }}
          >
            <motion.div
              style={{
                transformStyle: "preserve-3d",
                transform,
                opacity: cinematicOpacity,
              }}
              className="w-full text-center"
            >
              <h2 className="font-serif font-light text-[24px] sm:text-[32px] md:text-[38px] lg:text-[44px] text-[#0E0C06] leading-[1.3] tracking-[-0.02em] select-none px-6 sm:px-12 text-center">
                Cold lists lose. <em className="text-[#a07828]">Context wins.</em> SIFT turns a market full of noise into scored accounts, mapped stakeholders, and cited buying triggers. Argus finds the motion. Lynx maps the room. Intelligence writes the play — delivered in seventy-two hours.
              </h2>
            </motion.div>
          </div>

          {/* SECTION 3: Modern Stats screen (Full-Width Swipe Coverflow with no border truncation) */}
          <div className="w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] relative mt-16 pointer-events-auto overflow-hidden">
            <ScrollReveal>
              <StatsGrid />
            </ScrollReveal>
          </div>

          {/* SECTION 4: The Process */}
          <ProcessSection />

          {/* SECTION 5: Three Engines */}
          <EnginesSection />

          {/* SECTION 6: Pricing */}
          <PricingSection />

          {/* SECTION 7: FAQ */}
          <FaqSection />

          {/* SECTION 8: Contact / Book a Run */}
          <ContactSection />

          {/* FOOTER */}
          <SiftFooter />
        </div>
      </motion.main>

    </div>
  );
}
