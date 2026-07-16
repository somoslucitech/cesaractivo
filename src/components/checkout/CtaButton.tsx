"use client";

import { useCheckout } from "./checkout-context";

export const CTA_LABEL = "Iniciar mi Detox5";

interface CtaButtonProps {
  className?: string;
  variant?: "solid" | "outline";
}

export function CtaButton({ className = "", variant = "solid" }: CtaButtonProps) {
  const { open } = useCheckout();

  const base =
    "inline-flex items-center justify-center whitespace-nowrap rounded-full px-8 py-4 font-semibold transition-transform duration-150 ease-out active:scale-[0.97]";
  const variants: Record<string, string> = {
    // El amarillo siempre lleva texto oscuro, en ambos temas.
    solid: "bg-amarillo text-texto-oscuro hover:bg-amarillo-oscuro",
    outline: "border-2 border-azul-texto text-azul-texto hover:bg-tinte-azul",
  };

  return (
    <button type="button" onClick={open} className={`${base} ${variants[variant]} ${className}`}>
      {CTA_LABEL}
    </button>
  );
}
