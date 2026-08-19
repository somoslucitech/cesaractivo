"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { DUR, EASE_SIGNATURE } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distancia vertical inicial en px (default 24). */
  y?: number;
  as?: "div" | "li" | "section";
}

/**
 * Entrada por scroll reutilizable: fade + subida suave, una sola vez,
 * respetando prefers-reduced-motion. Usa la curva y duracion Premium
 * (src/lib/motion.ts) para que todas las secciones se sientan de un mismo
 * sistema de movimiento, igual que ya comparten el sistema de color.
 */
export function Reveal({ children, className, delay = 0, y = 24, as = "div" }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      initial={shouldReduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: DUR.standard, delay, ease: EASE_SIGNATURE }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
