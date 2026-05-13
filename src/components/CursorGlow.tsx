"use client";

import { useEffect, useRef } from "react";

const SIZE = 700;
const LERP = 0.08;

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Skip on touch-only devices and when reduced motion is preferred
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = glowRef.current;
    if (!el) return;

    let initialized = false;

    const onMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!initialized) {
        // Snap to position on first move to avoid sliding in from 0,0
        pos.current = { x: e.clientX, y: e.clientY };
        initialized = true;
        el.style.opacity = "1";
      }
    };

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * LERP;
      pos.current.y += (target.current.y - pos.current.y) * LERP;
      el.style.transform = `translate(${pos.current.x - SIZE / 2}px, ${pos.current.y - SIZE / 2}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: SIZE,
        height: SIZE,
        borderRadius: "9999px",
        pointerEvents: "none",
        zIndex: 40,
        opacity: 0,
        transition: "opacity 0.6s ease",
        background:
          "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}
