"use client";

import { useCheckout } from "@/components/checkout/checkout-context";
import { CURRENCY_LABEL, type Currency } from "@/lib/pricing";

const OPCIONES: readonly Currency[] = ["usd", "eur"];

/**
 * Selector de moneda del nav. Vive en el contexto de checkout (no en
 * localStorage como el tema): es una eleccion de la sesion de compra, y
 * afecta el precio mostrado en toda la pagina ademas del monto real que
 * se cobra en el modal.
 */
export function SelectorMoneda({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useCheckout();

  return (
    <div
      role="group"
      aria-label="Moneda de los precios"
      className={`inline-flex items-center gap-0.5 rounded-full border border-linea p-0.5 ${className}`}
    >
      {OPCIONES.map((valor) => {
        const activo = currency === valor;
        return (
          <button
            key={valor}
            type="button"
            onClick={() => setCurrency(valor)}
            aria-label={`Ver precios en ${CURRENCY_LABEL[valor]}`}
            aria-pressed={activo}
            className={`inline-flex h-7 items-center justify-center rounded-full px-2.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-texto ${
              activo ? "bg-tinte-azul text-azul-texto" : "text-tinta-suave hover:text-tinta"
            }`}
          >
            {CURRENCY_LABEL[valor]}
          </button>
        );
      })}
    </div>
  );
}
