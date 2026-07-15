"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { CtaButton } from "@/components/checkout/CtaButton";

/**
 * Zoom Parallax Hero: el video de fondo escala y se desplaza atado al
 * scroll de la propia sección (useScroll + useTransform, nunca scrollY en
 * React state). Un scrim oscuro uniforme garantiza el contraste del texto
 * sin importar qué frame del video quede detrás. Mismo video en todas las
 * resoluciones (autoplay, muted, loop, sin controles).
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={sectionRef} className="relative flex min-h-[100dvh] items-center overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-azul-oscuro"
        style={shouldReduceMotion ? undefined : { scale: imageScale, y: imageY }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/photos/hero-bg.webp"
          className="h-full w-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-texto-oscuro/45" />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-4 sm:px-6"
        style={shouldReduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <span className="inline-flex items-center rounded-xl bg-blanco-calido px-4 py-2">
          <Image
            src="/logos/plan-detox.png"
            alt="Detox5"
            width={480}
            height={140}
            className="h-8 w-auto sm:h-9"
            priority
          />
        </span>
        <h1 className="max-w-xl font-display text-4xl leading-[1.05] text-blanco-calido md:text-5xl lg:text-6xl">
          Recupera el control de tu cuerpo en 7 días
        </h1>
        <p className="max-w-md text-base text-blanco-calido/85 sm:text-lg">
          Activa tu metabolismo, recupera tu balance hormonal y desintoxica tu cuerpo con
          comida real, sin pasar hambre.
        </p>
        <CtaButton />
      </motion.div>
    </section>
  );
}
