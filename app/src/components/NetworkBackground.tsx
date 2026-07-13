import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const GOLD = 0xc9943a;
const DARK_BG = 0x070600;

export function NetworkBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const linesRef = useRef<THREE.LineSegments | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const isActiveRef = useRef(true);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    dimensionsRef.current = { width, height };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(DARK_BG);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 60;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: container.querySelector("canvas") ?? undefined,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const isMobile = width < 768;
    const particleCount = isMobile ? 60 : 120;
    const spreadX = 110;
    const spreadY = 70;
    const spreadZ = 40;

    const positions = new Float32Array(particleCount * 3);
    const originalPositions: { x: number; y: number; z: number }[] = [];
    const velocities: { x: number; y: number; z: number }[] = [];
    const phases: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * spreadX;
      const y = (Math.random() - 0.5) * spreadY;
      const z = (Math.random() - 0.5) * spreadZ;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions.push({ x, y, z });
      velocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: (Math.random() - 0.5) * 0.015,
        z: (Math.random() - 0.5) * 0.008,
      });
      phases.push(Math.random() * Math.PI * 2);
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: GOLD,
      size: 0.55,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    const lineMaterial = new THREE.LineBasicMaterial({
      color: GOLD,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });

    const lineGeometry = new THREE.BufferGeometry();
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);
    linesRef.current = lines;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    container.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      dimensionsRef.current = { width: newWidth, height: newHeight };
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    let frameCount = 0;
    const maxDistance = isMobile ? 16 : 18;
    const maxConnections = 3;

    const animate = () => {
      if (!isActiveRef.current) return;
      rafRef.current = requestAnimationFrame(animate);

      frameCount++;
      if (frameCount % 2 !== 0) return;

      const time = Date.now() * 0.001;
      const posArray = particleGeometry.attributes.position.array as Float32Array;

      // Breathing pulse
      const breath = 0.92 + Math.sin(time * 0.6) * 0.08;
      particleMaterial.size = 0.55 * breath;
      particleMaterial.opacity = 0.65 + Math.sin(time * 0.6) * 0.1;
      lineMaterial.opacity = 0.08 + Math.sin(time * 0.6) * 0.04;

      // Camera subtle parallax
      if (cameraRef.current) {
        cameraRef.current.position.x += (mouseRef.current.x * 2 - cameraRef.current.position.x) * 0.02;
        cameraRef.current.position.y += (mouseRef.current.y * 2 - cameraRef.current.position.y) * 0.02;
        cameraRef.current.lookAt(0, 0, 0);
      }

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const orig = originalPositions[i];
        const vel = velocities[i];
        const phase = phases[i];

        posArray[idx] += vel.x + Math.sin(time * 0.4 + phase) * 0.003;
        posArray[idx + 1] += vel.y + Math.cos(time * 0.35 + phase) * 0.003;
        posArray[idx + 2] += vel.z + Math.sin(time * 0.25 + phase) * 0.0015;

        // Soft bounds
        if (Math.abs(posArray[idx]) > spreadX * 0.55) velocities[i].x *= -1;
        if (Math.abs(posArray[idx + 1]) > spreadY * 0.55) velocities[i].y *= -1;
        if (Math.abs(posArray[idx + 2]) > spreadZ * 0.55) velocities[i].z *= -1;

        // Return to origin drift
        posArray[idx] += (orig.x - posArray[idx]) * 0.008;
        posArray[idx + 1] += (orig.y - posArray[idx + 1]) * 0.008;
        posArray[idx + 2] += (orig.z - posArray[idx + 2]) * 0.008;
      }

      particleGeometry.attributes.position.needsUpdate = true;

      // Build connections
      const linePositions: number[] = [];
      for (let i = 0; i < particleCount; i++) {
        let connections = 0;
        for (let j = i + 1; j < particleCount; j++) {
          if (connections >= maxConnections) break;

          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            linePositions.push(
              posArray[i * 3],
              posArray[i * 3 + 1],
              posArray[i * 3 + 2],
              posArray[j * 3],
              posArray[j * 3 + 1],
              posArray[j * 3 + 2]
            );
            connections++;
          }
        }
      }

      lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
      lineGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleVisibility = () => {
      isActiveRef.current = !document.hidden;
      if (isActiveRef.current) {
        animate();
      } else {
        cancelAnimationFrame(rafRef.current);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      isActiveRef.current = false;
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Mobile / coarse pointer fallback
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return (
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          backgroundColor: "#070600",
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(201,148,58,0.08) 0%, transparent 60%),
            radial-gradient(rgba(201,148,58,0.35) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 28px 28px",
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{ backgroundColor: "#070600" }}
    />
  );
}
