"use client";

import { useEffect, useRef } from "react";
import { useUIStore } from "@/stores/ui-store";

interface ParticleFieldProps {
  count?: number;
  color?: string;
  maxSize?: number;
  speed?: number;
  className?: string;
  interactive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  opacityDelta: number;
}

export function ParticleField({
  count = 80,
  color = "124, 58, 237",
  maxSize = 2,
  speed = 0.3,
  className,
  interactive = true,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Init particles
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: Math.random() * maxSize + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      opacityDelta: (Math.random() - 0.5) * 0.01,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", () => {
        mouseRef.current = { x: -9999, y: -9999 };
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        // Mouse interaction
        if (interactive) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx ** 2 + dy ** 2);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.vx -= (dx / dist) * force * 0.3;
            p.vy -= (dy / dist) * force * 0.3;
          }
        }

        // Apply velocity with damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Restore to base speed
        const baseSpeed = speed * 0.5;
        const currentSpeed = Math.sqrt(p.vx ** 2 + p.vy ** 2);
        if (currentSpeed < baseSpeed) {
          p.vx += (Math.random() - 0.5) * 0.02;
          p.vy += (Math.random() - 0.5) * 0.02;
        }

        // Cap speed
        if (currentSpeed > speed * 3) {
          p.vx = (p.vx / currentSpeed) * speed * 3;
          p.vy = (p.vy / currentSpeed) * speed * 3;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Opacity pulse
        p.opacity += p.opacityDelta;
        if (p.opacity <= 0.05 || p.opacity >= 0.6) {
          p.opacityDelta *= -1;
        }

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particlesRef.current.forEach((a, i) => {
        particlesRef.current.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx ** 2 + dy ** 2);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${color}, ${(1 - dist / 100) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [count, color, maxSize, speed, interactive, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
