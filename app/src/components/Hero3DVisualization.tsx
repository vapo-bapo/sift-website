import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Hero3DVisualizationProps {
  className?: string;
}

export function Hero3DVisualization({ className = "" }: Hero3DVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const isActiveRef = useRef(true);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 8;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Main geometry - Icosahedron for futuristic signal look
    const geometry = new THREE.IcosahedronGeometry(1.8, 1);

    // Wireframe material with amber glow
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xc9943a,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });

    // Inner glow material
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0xc9943a,
      transparent: true,
      opacity: 0.08,
    });

    const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
    const innerMesh = new THREE.Mesh(geometry, innerMaterial);
    innerMesh.scale.set(0.95, 0.95, 0.95);

    scene.add(wireframeMesh);
    scene.add(innerMesh);

    // Orbital rings
    const ringGeometry = new THREE.RingGeometry(2.2, 2.25, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xc9943a,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    });

    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
    const ring3 = new THREE.Mesh(ringGeometry, ringMaterial);

    ring2.scale.set(1.3, 1.3, 1.3);
    ring2.rotation.x = Math.PI / 3;
    ring3.scale.set(1.6, 1.6, 1.6);
    ring3.rotation.y = Math.PI / 4;

    scene.add(ring1);
    scene.add(ring2);
    scene.add(ring3);

    // Particles orbiting
    const particleCount = 40;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds: number[] = [];
    const particleRadii: number[] = [];
    const particleAngles: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.5 + Math.random() * 2;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3;

      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;

      particleSpeeds.push(0.005 + Math.random() * 0.01);
      particleRadii.push(radius);
      particleAngles.push(angle);
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xe0a94c,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Core glow light
    const coreLight = new THREE.PointLight(0xc9943a, 1, 10);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    container.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Resize handler
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Animation
    let frameCount = 0;
    const animate = () => {
      if (!isActiveRef.current) return;
      rafRef.current = requestAnimationFrame(animate);

      frameCount++;
      if (frameCount % 2 !== 0) return;

      const time = Date.now() * 0.001;

      // Rotate main geometry
      wireframeMesh.rotation.x += 0.003;
      wireframeMesh.rotation.y += 0.005;
      innerMesh.rotation.x += 0.003;
      innerMesh.rotation.y += 0.005;

      // Mouse interaction - subtle tilt
      wireframeMesh.rotation.x += mouseRef.current.y * 0.01;
      wireframeMesh.rotation.y += mouseRef.current.x * 0.01;

      // Rotate rings
      ring1.rotation.z += 0.002;
      ring1.rotation.x = Math.sin(time * 0.5) * 0.1;
      ring2.rotation.x += 0.003;
      ring2.rotation.y = Math.PI / 3 + Math.sin(time * 0.3) * 0.1;
      ring3.rotation.y += 0.002;
      ring3.rotation.z = Math.sin(time * 0.4) * 0.1;

      // Update orbiting particles
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        particleAngles[i] += particleSpeeds[i];
        positions[i * 3] = Math.cos(particleAngles[i]) * particleRadii[i];
        positions[i * 3 + 2] = Math.sin(particleAngles[i]) * particleRadii[i];
        positions[i * 3 + 1] += Math.sin(time + i) * 0.002;
      }
      particleGeometry.attributes.position.needsUpdate = true;
      particles.rotation.y -= 0.001;

      // Pulse core light
      coreLight.intensity = 0.8 + Math.sin(time * 2) * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    // Visibility handling
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
      geometry.dispose();
      wireframeMaterial.dispose();
      innerMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Don't render on mobile
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-32 h-32 rounded-full border-2 border-[#c9943a]/30 flex items-center justify-center animate-pulse">
            <div className="w-24 h-24 rounded-full border border-[#c9943a]/50" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
