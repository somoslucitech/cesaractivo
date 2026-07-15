"use client";

import { useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { CtaButton } from "@/components/checkout/CtaButton";

const FAQS = [
  {
    question: "¿Cuánto cuesta y qué métodos de pago aceptan?",
    answer:
      "La fase diagnóstica del Plan Detox5 tiene una inversión única de $18. Puedes pagar con Pago Móvil, Zelle, tarjeta internacional, PayPal o criptomoneda.",
  },
  {
    question: "¿Cuáles son los horarios de los entrenamientos en vivo?",
    answer:
      "Team Puro Power Online tiene más de 18 horarios de clases en vivo por semana. En Caracas entrenamos presencial en el Parque del Este de lunes a viernes, y los domingos desde las 7:00 am hacemos el Encuentro de Bienestar comunitario.",
  },
  {
    question: "No tengo buena condición física, ¿puedo hacerlo a mis años?",
    answer:
      "Totalmente. El método está diseñado para mujeres entre 40 y 70 años. Las rutinas se adaptan a tu rango de movimiento actual para proteger tus articulaciones y evitar lesiones.",
  },
  {
    question: "¿El seguimiento se puede hacer solo presencial, en el parque?",
    answer:
      "Los entrenamientos tienen horarios fijos en el parque o por streaming. El acompañamiento central, la supervisión de tus hábitos y el control de tu alimentación se hacen a diario por WhatsApp: ahí está el verdadero valor del método.",
  },
  {
    question: "¿Debo comprar suplementos costosos o pasar hambre?",
    answer:
      "No. No vendemos pastillas ni batidos milagrosos. El método te enseña a comer comida real, sabrosa y accesible que consigues en cualquier supermercado.",
  },
];

export function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

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
              Diagnóstico, guía y acompañamiento diario.
            </p>

            <div className="mt-10 flex flex-col items-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blanco-calido/75">
                Acceso completo por
              </p>
              <p className="mt-1 font-display text-7xl leading-none text-amarillo drop-shadow-[0_4px_16px_rgba(0,61,115,0.5)] sm:text-8xl">
                $18
              </p>
              <p className="mt-2 text-sm font-medium text-blanco-calido/85">
                Pago único por los 7 días
              </p>
            </div>

            <CtaButton className="mt-10" />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3">
          <h3 className="mb-1 font-display text-2xl text-texto-oscuro">Preguntas frecuentes</h3>
          {FAQS.map((faq, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={faq.question}
                className={`rounded-[10px] border bg-blanco-calido px-5 py-[18px] transition-all duration-200 ${
                  isActive ? "border-azul/30 shadow-md" : "border-crema shadow-sm hover:border-azul/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isActive}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <span className="text-sm font-medium text-texto-oscuro sm:text-base">
                    {faq.question}
                  </span>
                  {isActive ? (
                    <CaretUp size={20} weight="bold" className="shrink-0 text-azul" />
                  ) : (
                    <CaretDown size={20} weight="bold" className="shrink-0 text-texto-medio" />
                  )}
                </button>
                <div
                  className={`grid transition-all duration-200 ease-out ${
                    isActive ? "grid-rows-[1fr] pt-3 opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <p className="overflow-hidden text-sm leading-relaxed text-texto-medio">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
