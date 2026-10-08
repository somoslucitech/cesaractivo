"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCheckout } from "./checkout-context";
import { formatPrice } from "@/lib/pricing";
import { DUR, EASE_EXIT, EASE_SIGNATURE } from "@/lib/motion";

/**
 * Unico lugar que formatea el precio visible fuera del modal (ProductOffer,
 * Faq). Lee del contexto de checkout, que recibe los precios calculados en el
 * servidor.
 *
 * Cuando hay oferta se tacha el precio normal y se destaca el rebajado. El
 * tachado va antes y en pequeno: es la referencia, no el protagonista.
 *
 * inline-block y no block: esto se renderiza dentro de <p>.
 */
export function PriceTag() {
  const { precios } = useCheckout();
  const reducirMovimiento = useReducedMotion();

  const contenido = (
    <>
      {precios.enOferta && (
        <span className="mr-2 align-middle text-[0.55em] font-normal text-tinta-suave line-through opacity-80">
          {formatPrice(precios.normal, precios.currency)}
        </span>
      )}
      <span className="align-middle">{formatPrice(precios.efectivo, precios.currency)}</span>
    </>
  );

  if (reducirMovimiento) return <span>{contenido}</span>;

  return (
    <span className="inline-block">
      {/* El crossfade sobrevive de cuando el precio cambiaba al alternar
          moneda. Se conserva porque el precio tambien cambia al entrar o
          salir una oferta, y saltar de golpe se veria como un fallo. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`${precios.currency}-${precios.efectivo}-${precios.enOferta}`}
          className="inline-block"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6, transition: { duration: DUR.stepOut, ease: EASE_EXIT } }}
          transition={{ duration: DUR.stepIn, ease: EASE_SIGNATURE }}
        >
          {contenido}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
