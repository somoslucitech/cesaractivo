"use client";

import { useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { CtaButton } from "@/components/checkout/CtaButton";

const FAQS = [
  {
    question: "¿Cuanto cuesta y que metodos de pago aceptan?",
    answer:
      "La fase diagnostica del Plan Detox5 tiene una inversion unica de $18. Puedes pagar con Pago Movil, Zelle, tarjeta internacional, PayPal o criptomoneda.",
  },
  {
    question: "¿Cuales son los horarios de los entrenamientos en vivo?",
    answer:
      "Team Puro Power Online tiene mas de 18 horarios de clases en vivo por semana. En Caracas entrenamos presencial en el Parque del Este de lunes a viernes, y los domingos desde las 7:00 am hacemos el Encuentro de Bienestar comunitario.",
  },
  {
    question: "No tengo buena condicion fisica, ¿puedo hacerlo a mis anos?",
    answer:
      "Totalmente. El metodo esta disenado para mujeres entre 40 y 70 anos. Las rutinas se adaptan a tu rango de movimiento actual para proteger tus articulaciones y evitar lesiones.",
  },
  {
    question: "¿El seguimiento se puede hacer solo presencial, en el parque?",
    answer:
      "Los entrenamientos tienen horarios fijos en el parque o por streaming. El acompanamiento central, la supervision de tus habitos y el control de tu alimentacion se hacen a diario por WhatsApp: ahi esta el verdadero valor del metodo.",
  },
  {
    question: "¿Debo comprar suplementos costosos o pasar hambre?",
    answer:
      "No. No vendemos pastillas ni batidos milagrosos. El metodo te ensena a comer comida real, sabrosa y accesible que consigues en cualquier supermercado.",
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
        <div className="detox5-animated-gradient flex flex-col items-center justify-center rounded-[24px] px-10 py-20 text-center text-blanco-calido shadow-[0_10px_30px_rgba(0,61,115,0.25)]">
          <h2 className="max-w-sm font-display text-4xl leading-[1.1] sm:text-5xl">
            El cambio empieza en 7 dias
          </h2>
          <p className="mt-4 text-sm text-blanco-calido/90 sm:text-base">
            Diagnostico, guia y acompanamiento diario por $18.
          </p>
          <CtaButton className="mt-8" />
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
