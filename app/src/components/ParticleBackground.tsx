import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const isActiveRef = useRef(true);

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const container = containerRef.current;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];
    const originalPositions: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 50;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions.push({ x, y, z });
      velocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.01,
      });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xc9943a,
      size: 0.5,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xc9943a,
      transparent: true,
      opacity: 0.15,
    });

    const lineGeometry = new THREE.BufferGeometry();
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    let frameCount = 0;
    const animate = () => {
      if (!isActiveRef.current) return;
      rafRef.current = requestAnimationFrame(animate);

      frameCount++;
      if (frameCount % 2 !== 0) return;

      const positions = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const orig = originalPositions[i];
        const vel = velocities[i];

        positions[idx] += vel.x + Math.sin(Date.now() * 0.001 + i) * 0.01;
        positions[idx + 1] += vel.y + Math.cos(Date.now() * 0.001 + i) * 0.01;
        positions[idx + 2] += vel.z;

        const dx = positions[idx] - mouseRef.current.x * 30;
        const dy = positions[idx + 1] - mouseRef.current.y * 30;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 15) {
          const force = (15 - dist) / 15;
          positions[idx] += (dx / dist) * force * 0.5;
          positions[idx + 1] += (dy / dist) * force * 0.5;
        }

        positions[idx] += (orig.x - positions[idx]) * 0.01;
        positions[idx + 1] += (orig.y - positions[idx + 1]) * 0.01;
        positions[idx + 2] += (orig.z - positions[idx + 2]) * 0.01;

        if (Math.abs(positions[idx]) > 60) velocities[i].x *= -1;
        if (Math.abs(positions[idx + 1]) > 60) velocities[i].y *= -1;
        if (Math.abs(positions[idx + 2]) > 30) velocities[i].z *= -1;
      }

      geometry.attributes.position.needsUpdate = true;

      const linePositions: number[] = [];
      const maxDistance = 20;
      const maxConnections = 3;

      for (let i = 0; i < particleCount; i++) {
        let connections = 0;
        for (let j = i + 1; j < particleCount; j++) {
          if (connections >= maxConnections) break;

          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            linePositions.push(
              positions[i * 3],
              positions[i * 3 + 1],
              positions[i * 3 + 2],
              positions[j * 3],
              positions[j * 3 + 1],
              positions[j * 3 + 2]
            );
            connections++;
          }
        }
      }

      lineGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePositions, 3)
      );

      particles.rotation.y += 0.0005;
      lines.rotation.y += 0.0005;

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
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[0]"
      style={{ opacity: 0.7 }}
    />
  );
}
