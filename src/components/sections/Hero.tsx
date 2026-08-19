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
  // Se mueve menos que el fondo: al ir mas lento se lee como primer plano.
  const figuraY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

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

      {/* Cesar anclado al borde inferior, no centrado en vertical: el recorte
          de la foto termina justo donde termina la seccion, asi que se lee
          como encuadre deliberado y no como una figura cortada flotando. Solo
          desde lg, que es donde hay ancho de sobra sin invadir el titular. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 hidden w-[34%] max-w-[26rem] lg:block xl:right-[max(0px,calc((100vw-80rem)/2))]"
        style={shouldReduceMotion ? undefined : { y: figuraY }}
      >
        {/* Pool de luz frio detras: sobre un video en movimiento hace falta
            separar la figura del fondo, y se separa con luz, no con sombra
            negra. El tono sale del azul lavado de marca. */}
        <div
          className="absolute inset-0 -z-10 translate-y-6 scale-110"
          style={{
            background:
              "radial-gradient(50% 42% at 52% 58%, rgba(230,240,248,0.22) 0%, rgba(0,61,115,0.28) 45%, transparent 72%)",
          }}
        />
        <Image
          src="/photos/cesar-retrato.webp"
          alt=""
          width={693}
          height={1150}
          sizes="(min-width: 1024px) 34vw, 0px"
          className="h-auto w-full [filter:saturate(.82)_brightness(.93)_contrast(1.03)_drop-shadow(0_18px_44px_rgba(0,26,51,0.45))]"
          priority
        />
      </motion.div>

      {/* Asienta la base de la figura: sin este degradado el recorte termina
          en un canto duro contra la seccion siguiente. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-azul-oscuro/70 to-transparent lg:block"
      />

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

        {/* Credencial en texto. Antes habia aqui un avatar con su cara, pero
            desde que la figura vive a la derecha eran dos veces el mismo
            retrato en el mismo viewport. */}
        <div className="mt-1 flex items-center gap-3">
          <span aria-hidden className="h-px w-8 shrink-0 bg-amarillo" />
          <span className="text-sm text-blanco-calido/80">
            <span className="font-medium text-blanco-calido">César Villegas</span> · Coach de
            bienestar · 14 años acompañando mujeres
          </span>
        </div>
      </motion.div>
    </section>
  );
}
