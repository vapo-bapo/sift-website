import React, { useEffect, useRef, useState } from "react";

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
  id: number;
}

function isTouchDevice() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

export function FuturisticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailContainerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mousePos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const magneticTarget = useRef<{ x: number; y: number } | null>(null);
  const trail = useRef<TrailPoint[]>([]);
  const nextTrailId = useRef(0);
  const visibleRef = useRef(false);

  if (isTouchDevice()) return null;

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }
    };

    const handleMouseEnter = () => {
      visibleRef.current = true;
      setIsVisible(true);
    };
    const handleMouseLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
    };

    const handleElementMouseEnter = (e: Event) => {
      setIsHovering(true);
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      magneticTarget.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    };

    const handleElementMouseLeave = () => {
      setIsHovering(false);
      magneticTarget.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleElementMouseEnter);
      el.addEventListener("mouseleave", handleElementMouseLeave);
    });

    let rafId: number;
    let lastTrailTime = 0;

    const animate = () => {
      const now = performance.now();
      const target = magneticTarget.current ?? mousePos.current;

      // Magnetic pull: the ring eases toward the hovered element center while the
      // dot stays closer to the actual pointer so the cursor still feels precise.
      const pullStrength = magneticTarget.current ? 0.18 : 0.1;
      ringPos.current.x += (target.x - ringPos.current.x) * pullStrength;
      ringPos.current.y += (target.y - ringPos.current.y) * pullStrength;

      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.35;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.35;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x - 3}px, ${dotPos.current.y - 3}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;
      }

      // Spawn trail dots every ~18ms for a flowing, fading wake.
      if (now - lastTrailTime > 18) {
        lastTrailTime = now;
        trail.current.unshift({
          x: dotPos.current.x,
          y: dotPos.current.y,
          alpha: 1,
          id: nextTrailId.current++,
        });
        if (trail.current.length > 12) trail.current.pop();
      }

      trail.current.forEach((point) => {
        point.alpha *= 0.92;
      });
      trail.current = trail.current.filter((point) => point.alpha > 0.02);

      if (trailContainerRef.current) {
        const count = trail.current.length;
        trailContainerRef.current.innerHTML = "";
        trail.current.forEach((point, index) => {
          const size = 2 + (count - index) * 0.9;
          const el = document.createElement("div");
          el.className = "absolute rounded-full border border-[#c9943a] pointer-events-none";
          el.style.left = `${point.x}px`;
          el.style.top = `${point.y}px`;
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
          el.style.transform = "translate(-50%, -50%)";
          el.style.opacity = `${point.alpha * 0.55}`;
          el.style.boxShadow = `0 0 ${4 + point.alpha * 8}px rgba(201, 148, 58, ${point.alpha * 0.4})`;
          trailContainerRef.current!.appendChild(el);
        });
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
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed inset-0 pointer-events-none z-[99999]"
      style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.3s ease" }}
    >
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

      <div ref={trailContainerRef} className="fixed inset-0 pointer-events-none" />

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
