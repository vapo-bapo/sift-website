import React, { useEffect, useRef, useState } from "react";

export function FuturisticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mousePos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check for touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Track hoverable elements
    const handleElementMouseEnter = () => setIsHovering(true);
    const handleElementMouseLeave = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleElementMouseEnter);
      el.addEventListener("mouseleave", handleElementMouseLeave);
    });

    // Animation loop
    let rafId: number;
    const animate = () => {
      // Dot follows immediately
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.2;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.2;

      // Ring follows with delay
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.1;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.1;

      // Trail follows with more delay
      trailPos.current.x += (mousePos.current.x - trailPos.current.x) * 0.05;
      trailPos.current.y += (mousePos.current.y - trailPos.current.y) * 0.05;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x - 3}px, ${dotPos.current.y - 3}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trailPos.current.x - 10}px, ${trailPos.current.y - 10}px)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleElementMouseEnter);
        el.removeEventListener("mouseleave", handleElementMouseLeave);
      });
    };
  }, [isVisible]);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="fixed inset-0 pointer-events-none z-[99999]"
      style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.3s ease" }}
    >
      {/* Main dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full bg-[#c9943a]"
        style={{
          boxShadow: isHovering
            ? "0 0 20px #c9943a, 0 0 40px #c9943a, 0 0 60px #e0a94c"
            : "0 0 10px #c9943a, 0 0 20px #c9943a",
          transform: "translate(-50%, -50%)",
          transition: "box-shadow 0.2s ease, width 0.2s ease, height 0.2s ease",
          width: isHovering ? "12px" : "6px",
          height: isHovering ? "12px" : "6px",
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-[40px] h-[40px] rounded-full border border-[#c9943a]/40"
        style={{
          transform: "translate(-50%, -50%)",
          transition: "all 0.2s ease",
          width: isHovering ? "60px" : "40px",
          height: isHovering ? "60px" : "40px",
          borderColor: isHovering ? "rgba(201, 148, 58, 0.8)" : "rgba(201, 148, 58, 0.4)",
          backgroundColor: isHovering ? "rgba(201, 148, 58, 0.05)" : "transparent",
        }}
      />

      {/* Trail */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-[20px] h-[20px] rounded-full border border-[#c9943a]/20"
        style={{
          transform: "translate(-50%, -50%)",
          transition: "opacity 0.3s ease",
          opacity: isHovering ? 0.5 : 0.3,
        }}
      />

      {/* Glow effect on hover */}
      {isHovering && (
        <div
          className="fixed pointer-events-none"
          style={{
            left: mousePos.current.x - 50,
            top: mousePos.current.y - 50,
            width: 100,
            height: 100,
            background: "radial-gradient(circle, rgba(201, 148, 58, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            transition: "opacity 0.2s ease",
          }}
        />
      )}
    </div>
  );
}
