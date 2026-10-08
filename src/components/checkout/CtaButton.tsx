"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCheckout } from "./checkout-context";
import { registrarAperturaCheckout } from "@/components/PageTracker";
import { DUR, EASE_SIGNATURE } from "@/lib/motion";
import { trackMeta } from "@/lib/meta-pixel";
import { CURRENCY_LABEL } from "@/lib/pricing";

export const CTA_LABEL = "Iniciar mi Detox5";

interface CtaButtonProps {
  className?: string;
  variant?: "solid" | "outline";
}

/**
 * Unico lugar de la pagina con acento Energetic: es el elemento que
 * convierte, se repite 6 veces, y el skill de motion pide que la
 * intensidad de la animacion sea proporcional a la importancia de la
 * interaccion. Todo lo demas en la landing es Premium (sin overshoot);
 * este boton sí lo tiene, apenas un 6% para que se sienta vivo sin
 * volverse juguetón. Dos capas: la sombra (secundaria) se hunde bajo el
 * boton al presionar, dandole peso fisico al gesto.
 */
export function CtaButton({ className = "", variant = "solid" }: CtaButtonProps) {
  const { open, precios } = useCheckout();
  const shouldReduceMotion = useReducedMotion();

  const variants: Record<string, string> = {
    // El amarillo siempre lleva texto oscuro, en ambos temas.
    solid: "bg-amarillo text-texto-oscuro hover:bg-amarillo-oscuro shadow-[0_10px_24px_-8px_rgba(200,168,0,0.55)]",
    outline: "border-2 border-azul-texto text-azul-texto hover:bg-tinte-azul",
  };

  return (
    <motion.button
      type="button"
      // Este clic es el paso "abrio el checkout" del embudo del panel: el
      // momento exacto en que una visita pasa de mirar a querer comprar.
      // El registro va antes de open() pero no se espera: si la analitica
      // tarda o falla, el modal tiene que abrirse igual.
      onClick={() => {
        registrarAperturaCheckout();
        trackMeta("InitiateCheckout", {
          value: precios.efectivo,
          currency: CURRENCY_LABEL[precios.currency],
        });
        open();
      }}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -1 }}
      // El press lleva su propia transicion: DUR.press (140ms) frente a los
      // 90ms del hover. Compartir una sola hacia que la pulsacion se sintiera
      // igual de ligera que pasar el raton por encima.
      whileTap={
        shouldReduceMotion
          ? undefined
          : { scale: 0.96, y: 0, transition: { duration: DUR.press, ease: EASE_SIGNATURE } }
      }
      transition={{ duration: DUR.hover, ease: EASE_SIGNATURE }}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-8 py-4 font-semibold ${variants[variant]} ${className}`}
    >
      {CTA_LABEL}
    </motion.button>
  );
}
