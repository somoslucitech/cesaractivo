"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { CtaButton } from "@/components/checkout/CtaButton";
import { PriceTag } from "@/components/checkout/PriceTag";
import { DUR, EASE_SIGNATURE } from "@/lib/motion";
import { FAQS, PRECIO } from "@/lib/faq";

/**
 * Orden y contenido pensados para el Detox5 y solo para el Detox5 (los
 * horarios de Team Puro Power viven en OtherServices). Los textos estan en
 * src/lib/faq.ts porque tambien alimentan el JSON-LD FAQPage. El precio se
 * interpola con PriceTag en lugar de escribirse a mano, que era como se colaba
 * "$18" incluso con la moneda en euros.
 */
function Respuesta({ texto }: { texto: string }) {
  const [antes, despues] = texto.split(PRECIO);
  if (despues === undefined) return <>{texto}</>;
  return (
    <>
      {antes}
      <PriceTag />
      {despues}
    </>
  );
}

export function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  function toggle(index: number) {
    setActiveIndex((current) => (current === index ? null : index));
  }

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-stretch gap-8 px-4 sm:px-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="detox5-animated-gradient relative overflow-hidden rounded-[24px] shadow-[0_10px_30px_rgba(0,61,115,0.25)]">
          <div className="absolute inset-0 bg-azul-oscuro/45" />
          {/* h-full: la tarjeta se estira a la altura del FAQ, sin esto el
              justify-center no centra nada y el contenido queda arriba. */}
          <div className="relative flex h-full flex-col items-center justify-center px-8 py-16 text-center text-blanco-calido sm:px-10">
            <h2 className="max-w-sm font-display text-4xl leading-[1.1] sm:text-5xl">
              El cambio empieza en 7 días
            </h2>
            <p className="mt-4 max-w-xs text-sm text-blanco-calido/85 sm:text-base">
              Diagnóstico, guía de comida real y acompañamiento diario.
            </p>

            <div className="mt-10 flex flex-col items-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blanco-calido/75">
                Acceso completo por
              </p>
              <p className="mt-1 font-display text-7xl leading-none text-amarillo drop-shadow-[0_4px_16px_rgba(0,61,115,0.5)] sm:text-8xl">
                <PriceTag />
              </p>
              <p className="mt-2 text-sm font-medium text-blanco-calido/85">
                Pago único por los 7 días
              </p>
            </div>

            <CtaButton className="mt-10" />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3">
          {/* h2: es una seccion propia, no un apartado de la tarjeta de precio. */}
          <h2 className="mb-1 font-display text-2xl text-tinta">Preguntas frecuentes</h2>
          {FAQS.map((faq, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={faq.question}
                className={`rounded-[10px] border bg-tarjeta px-5 py-[18px] transition-colors duration-[var(--dur-hover)] ${
                  isActive ? "border-azul/30 shadow-md" : "border-linea shadow-sm hover:border-azul/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isActive}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <span className="text-sm font-medium text-tinta sm:text-base">
                    {faq.question}
                  </span>
                  {/* Un solo icono que rota, en vez de montar y desmontar dos
                      componentes distintos: mas suave, mas barato, y la
                      rotacion se puede interrumpir a mitad de camino. */}
                  <motion.span
                    aria-hidden
                    className="shrink-0"
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : DUR.quick, ease: EASE_SIGNATURE }}
                  >
                    <CaretDown
                      size={20}
                      weight="bold"
                      className={isActive ? "text-azul-texto" : "text-tinta-suave"}
                    />
                  </motion.span>
                </button>
                {/* Alto animado con motion (mide "auto" en vez de interpolar
                    grid-template-rows). Animar la fila del grid recalcula
                    layout en cada frame; esto solo mide una vez al abrir y
                    al cerrar. */}
                <motion.div
                  initial={false}
                  animate={{ height: isActive ? "auto" : 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : DUR.quick, ease: EASE_SIGNATURE }}
                  className="overflow-hidden"
                >
                  <motion.p
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : DUR.quick, ease: EASE_SIGNATURE }}
                    className="pt-3 text-sm leading-relaxed text-tinta-suave"
                  >
                    <Respuesta texto={faq.answer} />
                  </motion.p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
