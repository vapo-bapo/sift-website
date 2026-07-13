import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const NODE_COUNT = 160;
const LINK_DISTANCE = 18;
const MAX_LINKS = 3;
const ACCENT = 0x4ade80; // green dot-matrix
const BG = 0x09090b;

export function AetherField() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<HTMLSpanElement>(null);
  const linksRef = useRef<HTMLSpanElement>(null);
  const fpsRef = useRef<HTMLSpanElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isActiveRef = useRef(true);

  useEffect(() => {
    if (!canvasRef.current || !wrapRef.current) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    let width = wrap.clientWidth;
    let height = wrap.clientHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(DPR);
    renderer.setSize(width, height);
    renderer.setClearColor(BG, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 60;

    // Particles
    const positions = new Float32Array(NODE_COUNT * 3);
    const phases = new Float32Array(NODE_COUNT);
    const sizes = new Float32Array(NODE_COUNT);
    const originalPositions: { x: number; y: number; z: number }[] = [];
    const velocities: { x: number; y: number; z: number }[] = [];

    const spreadX = 110;
    const spreadY = 70;
    const spreadZ = 45;

    for (let i = 0; i < NODE_COUNT; i++) {
      const x = (Math.random() - 0.5) * spreadX;
      const y = (Math.random() - 0.5) * spreadY;
      const z = (Math.random() - 0.5) * spreadZ;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalPositions.push({ x, y, z });
      velocities.push({
        x: (Math.random() - 0.5) * 0.012,
        y: (Math.random() - 0.5) * 0.012,
        z: (Math.random() - 0.5) * 0.006,
      });
      phases[i] = Math.random() * Math.PI * 2;
      sizes[i] = 1.0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(ACCENT) },
        uPixelRatio: { value: DPR },
        uPointSize: { value: 3.2 },
      },
      vertexShader: `
        attribute float phase;
        attribute float size;
        varying float vDepth;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uPointSize;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          float depthScale = smoothstep(70.0, 0.0, -mvPosition.z);
          float breath = 0.92 + 0.08 * sin(uTime * 0.6 + phase);
          gl_PointSize = uPointSize * uPixelRatio * (0.5 + 0.5 * depthScale) * breath * size;
          vDepth = depthScale;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vDepth;
        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.35, 0.5, dist);
          alpha *= (0.35 + 0.65 * vDepth);
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: ACCENT,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lineGeometry = new THREE.BufferGeometry();
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Mouse
    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    wrap.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!wrapRef.current) return;
      width = wrapRef.current.clientWidth;
      height = wrapRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // FPS
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 60;
    let rafId = 0;
    let skip = 0;

    const posArray = geometry.attributes.position.array as Float32Array;

    const animate = () => {
      if (!isActiveRef.current) return;
      rafId = requestAnimationFrame(animate);

      skip++;
      if (skip % 2 !== 0) return;

      const now = performance.now();
      const dt = now - lastTime;
      if (dt >= 500) {
        fps = Math.round((frameCount * 1000) / dt);
        lastTime = now;
        frameCount = 0;
        if (fpsRef.current) fpsRef.current.textContent = String(fps);
      }
      frameCount++;

      const time = now * 0.001;
      material.uniforms.uTime.value = time;

      // Camera parallax
      camera.position.x += (mouseRef.current.x * 3 - camera.position.x) * 0.02;
      camera.position.y += (mouseRef.current.y * 3 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      let totalLinks = 0;

      for (let i = 0; i < NODE_COUNT; i++) {
        const idx = i * 3;
        const orig = originalPositions[i];
        const vel = velocities[i];

        // Drift + breathing
        posArray[idx] += vel.x + Math.sin(time * 0.4 + phases[i]) * 0.0025;
        posArray[idx + 1] += vel.y + Math.cos(time * 0.35 + phases[i]) * 0.0025;
        posArray[idx + 2] += vel.z + Math.sin(time * 0.25 + phases[i]) * 0.0012;

        // Soft bounds
        if (Math.abs(posArray[idx]) > spreadX * 0.55) velocities[i].x *= -1;
        if (Math.abs(posArray[idx + 1]) > spreadY * 0.55) velocities[i].y *= -1;
        if (Math.abs(posArray[idx + 2]) > spreadZ * 0.55) velocities[i].z *= -1;

        // Return to origin
        posArray[idx] += (orig.x - posArray[idx]) * 0.006;
        posArray[idx + 1] += (orig.y - posArray[idx + 1]) * 0.006;
        posArray[idx + 2] += (orig.z - posArray[idx + 2]) * 0.006;

        // Pointer drift (subtle repulsion)
        const dx = posArray[idx] - mouseRef.current.x * 35;
        const dy = posArray[idx + 1] - mouseRef.current.y * 25;
        const dist2d = Math.sqrt(dx * dx + dy * dy);
        if (dist2d < 18 && dist2d > 0.1) {
          const force = (18 - dist2d) / 18;
          posArray[idx] += (dx / dist2d) * force * 0.12;
          posArray[idx + 1] += (dy / dist2d) * force * 0.12;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      // Build links
      const linePositions: number[] = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        let connections = 0;
        for (let j = i + 1; j < NODE_COUNT; j++) {
          if (connections >= MAX_LINKS) break;
          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < LINK_DISTANCE) {
            linePositions.push(
              posArray[i * 3], posArray[i * 3 + 1], posArray[i * 3 + 2],
              posArray[j * 3], posArray[j * 3 + 1], posArray[j * 3 + 2]
            );
            connections++;
            totalLinks++;
          }
        }
      }
      lineGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePositions, 3)
      );
      lineGeometry.attributes.position.needsUpdate = true;

      // Pulse line opacity
      lineMaterial.opacity = 0.06 + Math.sin(time * 0.6) * 0.02;

      renderer.render(scene, camera);

      if (nodesRef.current) nodesRef.current.textContent = String(NODE_COUNT);
      if (linksRef.current) linksRef.current.textContent = String(totalLinks);
    };

    animate();

    const handleVisibility = () => {
      isActiveRef.current = !document.hidden;
      if (isActiveRef.current) {
        lastTime = performance.now();
        animate();
      } else {
        cancelAnimationFrame(rafId);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      isActiveRef.current = false;
      cancelAnimationFrame(rafId);
      wrap.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return (
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundColor: "#09090B",
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(75,75,160,0.12) 0%, transparent 60%),
            radial-gradient(rgba(74,222,128,0.22) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 32px 32px",
        }}
      />
    );
  }

  return (
    <div ref={wrapRef} className="fixed inset-0 -z-10 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />
      {/* Vignette + depth fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(9,9,11,0.55) 100%)",
        }}
      />

      {/* HUD overlay */}
      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 font-mono text-[11px] sm:text-[12px] tracking-widest text-[#A1A1AA]/80 pointer-events-none hidden sm:flex flex-col gap-1">
        <div className="flex items-center gap-4">
          <span className="w-16">NODES</span>
          <span ref={nodesRef} className="text-[#F4F4F5]">160</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-16">LINKS</span>
          <span ref={linksRef} className="text-[#F4F4F5]">0</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-16">FPS</span>
          <span ref={fpsRef} className="text-[#F4F4F5]">60</span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-widest text-[#A1A1AA]/60 pointer-events-none">
        <span className="inline-block w-2 h-2 rounded-full border border-[#A1A1AA]/40" />
        MOVE CURSOR
      </div>
    </div>
  );
}
