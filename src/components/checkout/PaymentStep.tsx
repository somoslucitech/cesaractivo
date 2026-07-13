"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PaypalPaymentOption } from "./PaypalPaymentOption";

// @apolopay-sdk/ui registra un custom element (Lit/HTMLElement) al cargar
// el modulo. HTMLElement no existe en el runtime SSR, asi que este
// componente solo puede importarse en cliente.
const ApoloPayPaymentOption = dynamic(
  () => import("./ApoloPayPaymentOption").then((mod) => mod.ApoloPayPaymentOption),
  {
    ssr: false,
    loading: () => (
      <p className="text-sm text-texto-medio">Cargando pago con criptomoneda...</p>
    ),
  },
);

type Method = "paypal" | "apolopay" | null;

interface PaymentStepProps {
  leadId: string;
  onSuccess: () => void;
}

export function PaymentStep({ leadId, onSuccess }: PaymentStepProps) {
  const [method, setMethod] = useState<Method>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-texto-medio">Total a pagar</p>
        <p className="font-display text-4xl text-azul-oscuro">$18 USD</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setMethod("paypal")}
          aria-pressed={method === "paypal"}
          className={`rounded-2xl border-2 px-4 py-3 text-left transition-colors duration-150 ${
            method === "paypal" ? "border-azul bg-azul-suave" : "border-crema"
          }`}
        >
          <p className="font-semibold text-texto-oscuro">PayPal</p>
          <p className="text-sm text-texto-medio">Tarjeta o saldo PayPal</p>
        </button>
        <button
          type="button"
          onClick={() => setMethod("apolopay")}
          aria-pressed={method === "apolopay"}
          className={`rounded-2xl border-2 px-4 py-3 text-left transition-colors duration-150 ${
            method === "apolopay" ? "border-azul bg-azul-suave" : "border-crema"
          }`}
        >
          <p className="font-semibold text-texto-oscuro">Criptomoneda</p>
          <p className="text-sm text-texto-medio">Via ApoloPay</p>
        </button>
      </div>

      <div className="min-h-[96px]">
        {method === "paypal" && <PaypalPaymentOption leadId={leadId} onSuccess={onSuccess} />}
        {method === "apolopay" && <ApoloPayPaymentOption leadId={leadId} onSuccess={onSuccess} />}
        {method === null && (
          <p className="text-sm text-texto-medio">Elige un metodo de pago para continuar.</p>
        )}
      </div>
    </div>
  );
}
