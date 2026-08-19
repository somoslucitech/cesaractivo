"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCheckout } from "./checkout-context";
import { formatPrice } from "@/lib/pricing";
import { DUR, EASE_EXIT, EASE_SIGNATURE } from "@/lib/motion";

/**
 * Unico lugar que formatea el precio visible fuera del modal (ProductOffer,
 * Faq). Componente de cliente aislado para que esas secciones sigan
 * renderizando en servidor; solo este nodo necesita el contexto de moneda.
 *
 * El crossfade no es decoracion: antes el importe saltaba de golpe al cambiar
 * de moneda, y era el cambio de estado mas brusco que quedaba en la pagina,
 * justo en el momento de compra. Se usan los mismos tokens que el crossfade
 * entre pasos del checkout.
 *
 * inline-block y no block: esto se renderiza dentro de <p>.
 */
export function PriceTag() {
  const { currency } = useCheckout();
  const reducirMovimiento = useReducedMotion();

  if (reducirMovimiento) return <span>{formatPrice(currency)}</span>;

  return (
    <span className="inline-block">
      {/* mode="wait": si alguien alterna rapido USD/EUR, las salidas no se
          encolan encima de las entradas. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={currency}
          className="inline-block"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6, transition: { duration: DUR.stepOut, ease: EASE_EXIT } }}
          transition={{ duration: DUR.stepIn, ease: EASE_SIGNATURE }}
        >
          {formatPrice(currency)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
