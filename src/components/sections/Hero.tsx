"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { CtaButton } from "@/components/checkout/CtaButton";
import { VideoLoop } from "@/components/ui/VideoLoop";

/**
 * Zoom Parallax Hero. El fondo es el gradiente de marca animado
 * (.detox5-animated-gradient, definido en globals.css) y no un video: el
 * video anterior mostraba a una persona entrenando, lo que hacia leer la
 * pagina como un programa de entrenamiento cuando lo que se vende es un
 * plan de alimentacion. De paso desaparecen 6.3 MB del LCP.
 *
 * El scrim cumple doble funcion: garantiza el contraste del texto blanco
 * sobre el gradiente y amortigua el movimiento de los blobs, que a pantalla
 * completa distraeria de la lectura.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      id="top"
      ref={sectionRef}
      // pt-28: el nav es fijo y flota encima. Sin este colchon, en pantallas
      // bajas (portatiles, tablets apaisadas) el contenido se centra tan
      // arriba que el badge del logo queda por debajo de la barra.
      className="relative flex min-h-[100dvh] items-center overflow-hidden pt-28 pb-16 sm:pt-32"
    >
      {/* El fondo es una cocina real con comida real, que es lo que vende la
          pagina. El scrim va en degradado y no plano: asegura el contraste del
          H1 (apoyado arriba a la izquierda) sin apagar la comida del lado
          derecho, que es justo lo que tiene que leerse. */}
      <motion.div
        className="absolute inset-0 bg-azul-oscuro"
        style={shouldReduceMotion ? undefined : { scale: backgroundScale, y: backgroundY }}
      >
        <VideoLoop nombre="video3" alt="Mujer preparando un plato con vegetales frescos" preload="metadata" />
        <div className="absolute inset-0 bg-gradient-to-br from-azul-oscuro/85 via-azul-oscuro/65 to-texto-oscuro/75" />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-4 sm:px-6"
        style={shouldReduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="flex flex-col items-start gap-3">
          <span className="inline-flex items-center rounded-xl bg-blanco-calido px-4 py-2">
            <Image
              src="/logos/plan-detox.webp"
              alt="Detox5"
              width={815}
              height={320}
              className="h-8 w-auto sm:h-9"
              priority
            />
          </span>
          {/* Desambigua "DETOX5" para quien no llega a leer el H1: sin esta
              linea el wordmark solo podria ser jugoterapia o un bootcamp. */}
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amarillo sm:text-sm">
            Programa de alimentación · Reinicio metabólico de 7 días
          </p>
        </div>
        <h1 className="max-w-xl font-display text-4xl leading-[1.05] text-blanco-calido md:text-5xl lg:text-6xl">
          Desinflama tu cuerpo en 7 días, comiendo comida real
        </h1>
        <p className="max-w-md text-base text-blanco-calido/85 sm:text-lg">
          Reinicio metabólico y hormonal para mujeres de 40 a 70. Comida de verdad que consigues
          en tu mercado, sin pasar hambre ni suplementos, con acompañamiento diario.
        </p>
        <CtaButton />

        {/* Chip de confianza. Sustituye al recorte de cuerpo entero que habia
            aqui: aquella figura quedaba cortada a media pierna, sin suelo ni
            contexto, y se leia como una calcomania pegada sobre el gradiente.
            Ademas mostraba camiseta Nike, visera de running y cronometro, que
            es justo lo que hacia parecer que esto vende entrenamiento.
            Recortado al rostro se conserva la persona (que es lo que genera
            confianza) y desaparece toda la indumentaria deportiva. */}
        <div className="mt-2 flex items-center gap-3">
          <span
            role="img"
            aria-label="César Villegas"
            className="h-14 w-14 shrink-0 rounded-full bg-blanco-calido/10 ring-1 ring-blanco-calido/30"
            // Encuadre calibrado sobre el rostro. El origen es un recorte con
            // fondo transparente, asi que un encuadre mas abierto deja ver un
            // creciente del fondo por el borde del circulo; con este zoom la
            // ventana cae entera dentro de la cara y ademas queda fuera la
            // visera.
            style={{
              backgroundImage: "url(/photos/cesar-retrato.webp)",
              backgroundSize: "250% auto",
              backgroundPosition: "60% 8%",
              backgroundRepeat: "no-repeat",
            }}
          />
          <span className="text-sm leading-tight text-blanco-calido/80">
            <span className="block font-medium text-blanco-calido">César Villegas</span>
            Coach de bienestar · 14 años acompañando mujeres
          </span>
        </div>
      </motion.div>
    </section>
  );
}
