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
  const rotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const brandGold = new THREE.Color("#c9943a");
    const warmGold = new THREE.Color("#e0a94c");

    // --- Programmatic glow sprite texture ---
    const createGlowTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.Texture();
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, "rgba(255, 236, 190, 1)");
      gradient.addColorStop(0.25, "rgba(224, 169, 76, 0.55)");
      gradient.addColorStop(0.55, "rgba(201, 148, 58, 0.18)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const glowTexture = createGlowTexture();

    // --- Signal Core group ---
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner energy orb
    const coreGeometry = new THREE.SphereGeometry(0.9, 48, 48);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: warmGold,
      transparent: true,
      opacity: 0.95,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    coreGroup.add(coreMesh);

    // Inner soft shell
    const innerShellMaterial = new THREE.MeshBasicMaterial({
      color: brandGold,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const innerShell = new THREE.Mesh(new THREE.SphereGeometry(1.2, 40, 40), innerShellMaterial);
    coreGroup.add(innerShell);

    // Outer glow sprite
    const glowSpriteMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: brandGold,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowSprite = new THREE.Sprite(glowSpriteMaterial);
    glowSprite.scale.set(5.5, 5.5, 1);
    coreGroup.add(glowSprite);

    // Secondary tighter glow sprite
    const tightGlowMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: warmGold,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const tightGlow = new THREE.Sprite(tightGlowMaterial);
    tightGlow.scale.set(2.8, 2.8, 1);
    coreGroup.add(tightGlow);

    // Point light to illuminate rings
    const coreLight = new THREE.PointLight(brandGold, 1.6, 16);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.08);
    scene.add(ambientLight);

    // --- Orbiting rings ---
    const ringConfigs = [
      { radius: 1.65, tube: 0.012, speed: 0.004, tiltX: 0, tiltY: 0, scale: 1 },
      { radius: 2.1, tube: 0.009, speed: -0.003, tiltX: Math.PI / 2.8, tiltY: Math.PI / 6, scale: 1 },
      { radius: 2.55, tube: 0.007, speed: 0.002, tiltX: -Math.PI / 4, tiltY: Math.PI / 3, scale: 1 },
      { radius: 3.0, tube: 0.005, speed: 0.0015, tiltX: Math.PI / 5, tiltY: -Math.PI / 5, scale: 1 },
    ];

    const rings: { mesh: THREE.Mesh; speed: number; axis: THREE.Vector3 }[] = [];
    const ringGeometryBase = new THREE.TorusGeometry(1, 0.015, 16, 128);

    ringConfigs.forEach((config) => {
      const material = new THREE.MeshBasicMaterial({
        color: brandGold,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeometryBase, material);
      ring.scale.set(config.radius, config.radius, config.radius);
      ring.rotation.x = config.tiltX;
      ring.rotation.y = config.tiltY;
      coreGroup.add(ring);
      rings.push({
        mesh: ring,
        speed: config.speed,
        axis: new THREE.Vector3(Math.sin(config.tiltY), Math.cos(config.tiltX), 0).normalize(),
      });
    });

    // --- Particle constellation ---
    const particleCount = 70;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleAngles = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);
    const particleSpeeds = new Float32Array(particleCount);
    const particleHeights = new Float32Array(particleCount);
    const particlePhases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particleAngles[i] = Math.random() * Math.PI * 2;
      particleRadii[i] = 2.2 + Math.random() * 2.6;
      particleSpeeds[i] = 0.004 + Math.random() * 0.008;
      particleHeights[i] = (Math.random() - 0.5) * 2.2;
      particlePhases[i] = Math.random() * Math.PI * 2;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleTexture = (() => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.Texture();
      const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, "rgba(255, 255, 255, 1)");
      g.addColorStop(0.45, "rgba(224, 169, 76, 0.5)");
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(canvas);
    })();

    const particleMaterial = new THREE.PointsMaterial({
      color: warmGold,
      size: 0.18,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- Data wave / sonar ring ---
    const waveGeometry = new THREE.RingGeometry(0.85, 0.95, 96);
    const waveMaterial = new THREE.MeshBasicMaterial({
      color: warmGold,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
    waveMesh.rotation.x = -Math.PI / 2;
    scene.add(waveMesh);

    let waveProgress = 0;

    // --- Mouse interaction ---
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    container.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // --- Animation loop ---
    let frameCount = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isActiveRef.current) return;
      rafRef.current = requestAnimationFrame(animate);

      frameCount++;
      if (frameCount % 2 !== 0) return;

      const time = clock.getElapsedTime();

      // Smooth mouse-reactive tilt
      rotationRef.current.x += (mouseRef.current.y * 0.35 - rotationRef.current.x) * 0.06;
      rotationRef.current.y += (mouseRef.current.x * 0.35 - rotationRef.current.y) * 0.06;

      coreGroup.rotation.x = rotationRef.current.x * 0.25 + Math.sin(time * 0.35) * 0.04;
      coreGroup.rotation.y = rotationRef.current.y * 0.25 + time * 0.05;

      // Core pulse
      const pulse = 1 + Math.sin(time * 1.8) * 0.04;
      coreMesh.scale.set(pulse, pulse, pulse);
      innerShell.scale.set(pulse * 1.05, pulse * 1.05, pulse * 1.05);
      glowSprite.material.opacity = 0.5 + Math.sin(time * 2.2) * 0.08;
      tightGlow.material.opacity = 0.32 + Math.cos(time * 2.5) * 0.06;
      coreLight.intensity = 1.4 + Math.sin(time * 2.0) * 0.35;

      // Rings orbit with subtle wobble
      rings.forEach((ring, index) => {
        ring.mesh.rotateOnAxis(ring.axis, ring.speed * 2);
        ring.mesh.rotation.z += Math.sin(time * 0.4 + index) * 0.0008;
        const opacityBase = 0.25 + Math.sin(time * 0.7 + index * 1.3) * 0.08;
        (ring.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0.12, opacityBase);
      });

      // Particles orbit and pulse
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        particleAngles[i] += particleSpeeds[i];
        const hPulse = Math.sin(time * 1.2 + particlePhases[i]) * 0.15;
        positions[i * 3] = Math.cos(particleAngles[i]) * particleRadii[i];
        positions[i * 3 + 1] = particleHeights[i] + hPulse;
        positions[i * 3 + 2] = Math.sin(particleAngles[i]) * particleRadii[i];
      }
      particleGeometry.attributes.position.needsUpdate = true;
      particles.rotation.y = time * 0.02;
      particleMaterial.opacity = 0.75 + Math.sin(time * 1.5) * 0.1;

      // Sonar data wave
      waveProgress += 0.008;
      if (waveProgress >= 1) {
        waveProgress = 0;
      }
      const waveScale = 1 + waveProgress * 5.5;
      waveMesh.scale.set(waveScale, waveScale, 1);
      waveMaterial.opacity = waveProgress < 0.2
        ? waveProgress / 0.2 * 0.45
        : (1 - waveProgress) * 0.45;
      waveMesh.position.y = Math.sin(time * 0.6) * 0.1;
      waveMesh.rotation.z = time * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleVisibility = () => {
      isActiveRef.current = !document.hidden;
      if (isActiveRef.current) {
        clock.start();
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

      // Dispose geometries and materials
      coreGeometry.dispose();
      coreMaterial.dispose();
      innerShellMaterial.dispose();
      (glowSprite.material as THREE.SpriteMaterial).dispose();
      (tightGlow.material as THREE.SpriteMaterial).dispose();
      ringGeometryBase.dispose();
      rings.forEach((ring) => (ring.mesh.material as THREE.MeshBasicMaterial).dispose());
      particleGeometry.dispose();
      particleMaterial.dispose();
      waveGeometry.dispose();
      waveMaterial.dispose();
      glowTexture.dispose();
      particleTexture.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-[#c9943a]/20 blur-xl animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#e0a94c] to-[#c9943a] shadow-[0_0_30px_rgba(201,148,58,0.6)] animate-pulse" />
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
