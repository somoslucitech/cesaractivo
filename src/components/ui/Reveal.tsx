"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

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
 * respetando prefers-reduced-motion. Mantiene la misma curva y ritmo en
 * toda la pagina para que las secciones se sientan de un mismo sistema.
 */
export function Reveal({ children, className, delay = 0, y = 24, as = "div" }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      initial={shouldReduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
