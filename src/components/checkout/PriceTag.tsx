"use client";

import { useCheckout } from "./checkout-context";
import { formatPrice } from "@/lib/pricing";

/**
 * Unico lugar que formatea el precio visible fuera del modal (ProductOffer,
 * Faq). Componente de cliente aislado para que esas secciones sigan
 * renderizando en servidor; solo este nodo necesita el contexto de moneda.
 */
export function PriceTag() {
  const { currency } = useCheckout();
  return formatPrice(currency);
}
