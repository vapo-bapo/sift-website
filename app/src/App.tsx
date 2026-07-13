import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useSpring,
} from "motion/react";
import Lenis from "lenis";

import { AetherField } from "./components/AetherField";
import { AetherStats } from "./components/AetherStats";
import { AuroraHero } from "./components/AuroraHero";
import {
  ProcessSection,
  EnginesSection,
  PricingSection,
  FaqSection,
  ContactSection,
  SiftFooter,
} from "./components/AetherSections";

const NAV_LINKS: { label: string; id: string }[] = [
  { label: "Products", id: "products" },
  { label: "Pricing", id: "pricing" },
  { label: "FAQ", id: "faq" },
  { label: "Contact", id: "contact" },
];

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
        className={`${width} ${thickness} bg-[#F4F4F5] rounded-full absolute top-0 left-0`}
        style={{ transformOrigin: "center" }}
      />
      <motion.span
        animate={isOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`${width} ${thickness} bg-[#F4F4F5] rounded-full absolute ${topMiddle} left-0`}
      />
      <motion.span
        animate={isOpen ? { rotate: -45, y: -yShift } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`${width} ${thickness} bg-[#F4F4F5] rounded-full absolute ${topBottom} left-0`}
        style={{ transformOrigin: "center" }}
      />
    </div>
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  const lenisRef = useRef<Lenis | null>(null);
  const cinematicRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 15,
    damping: 32,
    mass: 1.8,
    restDelta: 0.01,
  });

  const heroOpacity = useTransform(smoothScrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(smoothScrollY, [0, 600], [1, 0.96]);

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

  useEffect(() => {
    setPageLoaded(true);

    const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const smallScreen = window.innerWidth < 768;
    const isMobileDevice = mobileUA || smallScreen;

    let lenis: Lenis | null = null;
    let rafId: number;

    if (!isMobileDevice) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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
    <div className="relative w-full min-h-screen bg-[#09090B] text-[#F4F4F5] overflow-x-hidden">
      <AetherField />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: pageLoaded ? 1 : 0, y: pageLoaded ? 0 : -20 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 h-20 px-4 sm:px-8 flex items-center justify-between z-50 pointer-events-auto"
      >
        {/* Desktop header */}
        <div className="hidden sm:flex items-center justify-between w-full h-full">
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setIsMenuOpen(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-12 px-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2.5 cursor-pointer transition-colors"
            >
              <span className="inline-block w-[8px] h-[8px] rounded-full bg-[#4B4BA0]" />
              <span className="font-sans text-[16px] font-bold tracking-tight text-[#F4F4F5] leading-none">
                SIFT
              </span>
            </motion.button>

            <motion.div
              layout
              initial={false}
              animate={{
                width: !isMenuOpen ? 48 : "440px",
                backgroundColor: "rgba(9,9,11,0.92)",
              }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="h-12 rounded-full flex items-center overflow-hidden backdrop-blur-md relative font-sans border border-white/10"
            >
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`flex items-center justify-center text-[#F4F4F5] cursor-pointer shrink-0 transition-all duration-200 z-10 shadow-none border-none outline-none focus:outline-none active:outline-none ${
                  isMenuOpen
                    ? "w-9 h-9 rounded-[11px] bg-white/10 hover:bg-white/20 ml-1.5"
                    : "w-12 h-12 rounded-full"
                }`}
                aria-label="Toggle Menu"
              >
                <SquashHamburger isOpen={isMenuOpen} />
              </button>

              <motion.div
                initial={false}
                animate={{
                  opacity: isMenuOpen ? 1 : 0,
                  x: isMenuOpen ? 0 : 15,
                  pointerEvents: isMenuOpen ? "auto" : "none",
                }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-5 ml-auto pr-6 shrink-0"
              >
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToId(link.id)}
                    className="font-sans font-normal text-[15px] text-[#F4F4F5]/70 hover:text-[#F4F4F5] cursor-pointer transition-colors leading-[1]"
                  >
                    {link.label}
                  </button>
                ))}
              </motion.div>
            </motion.div>
          </div>

          <motion.button
            type="button"
            onClick={() => scrollToId("contact")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="h-12 px-6 bg-[#4B4BA0] hover:bg-[#6b6bbd] rounded-full flex items-center gap-2 cursor-pointer text-[#F4F4F5] font-sans font-medium text-[15px] transition-colors"
          >
            Book a Run
            <span className="text-[15px] leading-none">→</span>
          </motion.button>
        </div>

        {/* Mobile header */}
        <div className="flex sm:hidden items-center justify-between w-full h-full gap-2">
          <div className="flex items-center h-9 flex-grow min-w-0 mr-4 relative">
            <motion.button
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
                pointerEvents: isMobileMenuOpen ? "none" : "auto",
              }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="h-9 bg-white/5 backdrop-blur-md border border-white/10 rounded-[10px] flex items-center justify-start gap-1.5 cursor-pointer shrink-0 overflow-hidden outline-none whitespace-nowrap flex-nowrap"
            >
              <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#4B4BA0] shrink-0" />
              <span className="font-sans text-[13px] font-bold tracking-tight text-[#F4F4F5] leading-none shrink-0">
                SIFT
              </span>
            </motion.button>

            <motion.div
              layout
              initial={false}
              animate={{
                width: !isMobileMenuOpen ? 36 : "100%",
                backgroundColor: "rgba(9,9,11,0.92)",
              }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="h-9 rounded-[10px] flex items-center overflow-hidden backdrop-blur-md relative font-sans border border-white/10 shrink-0"
            >
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`flex items-center justify-center text-[#F4F4F5] cursor-pointer shrink-0 z-10 outline-none focus:outline-none active:outline-none transition-all duration-200 ${
                  isMobileMenuOpen
                    ? "w-7 h-7 rounded-[8px] bg-white/10 hover:bg-white/20 ml-1"
                    : "w-9 h-9 rounded-[10px]"
                }`}
                aria-label="Toggle Menu Mobile"
              >
                <SquashHamburger isOpen={isMobileMenuOpen} isMobile />
              </button>

              <motion.div
                initial={false}
                animate={{
                  opacity: isMobileMenuOpen ? 1 : 0,
                  x: isMobileMenuOpen ? 0 : 10,
                  pointerEvents: isMobileMenuOpen ? "auto" : "none",
                }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3.5 ml-auto pr-3.5 shrink-0"
              >
                {NAV_LINKS.map((link) => (
                  <span
                    key={link.id}
                    onClick={() => scrollToId(link.id)}
                    className="font-sans font-normal text-[12px] text-[#F4F4F5]/70 hover:text-[#F4F4F5] cursor-pointer transition-colors leading-[1]"
                  >
                    {link.label}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>

          <motion.button
            type="button"
            onClick={() => scrollToId("contact")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="h-9 px-3.5 bg-[#4B4BA0] hover:bg-[#6b6bbd] rounded-full flex items-center gap-1.5 cursor-pointer text-[#F4F4F5] font-sans font-medium text-[13px] transition-colors shrink-0"
          >
            <span>Book a Run</span>
            <span className="text-[12px] leading-none">→</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Main content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: pageLoaded ? 1 : 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="relative z-10 w-full flex flex-col pointer-events-auto"
      >
        {/* Hero */}
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }}>
          <AuroraHero
            onPrimary={() => scrollToId("contact")}
            onSecondary={() => scrollToId("process")}
          />
        </motion.div>

        {/* Cinematic statement */}
        <div
          ref={cinematicRef}
          className="relative w-full max-w-5xl mx-auto py-24 sm:py-32 pointer-events-none px-4 sm:px-8"
          style={{ transformStyle: "preserve-3d", perspective: "400px" }}
        >
          <motion.div
            style={{
              transformStyle: "preserve-3d",
              transform,
              opacity: cinematicOpacity,
            }}
            className="w-full text-center"
          >
            <h2 className="font-sans font-semibold text-[24px] sm:text-[32px] md:text-[38px] lg:text-[44px] text-[#F4F4F5] leading-[1.3] tracking-[-0.02em] select-none px-6 sm:px-12 text-center">
              Cold lists lose.{" "}
              <em className="text-[#8F47AE]">Context wins.</em> SIFT turns a market full of noise
              into scored accounts, mapped stakeholders, and cited buying triggers. Argus finds the
              motion. Lynx maps the room. Intelligence writes the play — delivered in seventy-two
              hours.
            </h2>
          </motion.div>
        </div>

        {/* Stats carousel */}
        <div className="w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] relative mt-16 pointer-events-auto overflow-hidden">
          <AetherStats />
        </div>

        <ProcessSection />
        <EnginesSection />
        <PricingSection />
        <FaqSection />
        <ContactSection />
        <SiftFooter />
      </motion.main>
    </div>
  );
}
