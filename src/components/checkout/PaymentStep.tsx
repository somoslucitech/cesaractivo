"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { WhatsappLogo } from "@phosphor-icons/react";
import { PaypalPaymentOption } from "./PaypalPaymentOption";
import { pagoMovilMessage, whatsappUrl } from "@/lib/contact";

// @apolopay-sdk/ui registra un custom element (Lit/HTMLElement) al cargar
// el módulo. HTMLElement no existe en el runtime SSR, así que este
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
  leadName: string;
  onSuccess: () => void;
}

export function PaymentStep({ leadId, leadName, onSuccess }: PaymentStepProps) {
  const [method, setMethod] = useState<Method>(null);

  const optionBase =
    "rounded-2xl border-2 px-4 py-3 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul";

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
          className={`${optionBase} ${
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
          className={`${optionBase} ${
            method === "apolopay" ? "border-azul bg-azul-suave" : "border-crema"
          }`}
        >
          <p className="font-semibold text-texto-oscuro">Criptomoneda</p>
          <p className="text-sm text-texto-medio">Vía ApoloPay</p>
        </button>

        {/* Pago Movil se coordina a mano por WhatsApp: no abre un widget,
            sale de la pagina con el mensaje ya escrito. */}
        <a
          href={whatsappUrl(pagoMovilMessage(leadName))}
          target="_blank"
          rel="noopener noreferrer"
          className={`${optionBase} border-crema hover:border-[#25D366] sm:col-span-2`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-texto-oscuro">Pago Móvil</p>
              <p className="text-sm text-texto-medio">
                Coordinamos tu pago por WhatsApp
              </p>
            </div>
            <WhatsappLogo size={26} weight="fill" className="shrink-0 text-[#25D366]" />
          </div>
        </a>
      </div>

      <div className="min-h-[96px]">
        {method === "paypal" && <PaypalPaymentOption leadId={leadId} onSuccess={onSuccess} />}
        {method === "apolopay" && <ApoloPayPaymentOption leadId={leadId} onSuccess={onSuccess} />}
        {method === null && (
          <p className="text-sm text-texto-medio">Elige un método de pago para continuar.</p>
        )}
      </div>
    </div>
  );
}
