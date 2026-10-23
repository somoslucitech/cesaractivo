"use client";

import { useState } from "react";
import { WhatsappLogo } from "@phosphor-icons/react";
import { PaypalPaymentOption } from "./PaypalPaymentOption";
import { useCheckout } from "./checkout-context";
import { pagoManualMessage, whatsappUrl, type MedioManual } from "@/lib/contact";
import { formatPrice } from "@/lib/pricing";

type Method = "paypal" | null;

/**
 * Binance (cripto) volvio el 2026-10-22 como medio manual, igual que Pago
 * Movil y Zelle. La pasarela ApoloPay sigue fuera: su componente y sus rutas
 * siguen en el repo por si se retoma.
 */
const MEDIOS_MANUALES: MedioManual[] = ["Pago Móvil", "Zelle", "Binance"];

interface PaymentStepProps {
  leadId: string;
  leadName: string;
  onSuccess: () => void;
}

export function PaymentStep({ leadId, leadName, onSuccess }: PaymentStepProps) {
  const { precios } = useCheckout();
  const [method, setMethod] = useState<Method>(null);

  const optionBase =
    "rounded-2xl border-2 px-4 py-3 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-texto";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-tinta-suave">Total a pagar</p>
        <p className="font-display text-4xl text-azul-texto">
          {precios.enOferta && (
            <span className="mr-2 align-middle text-xl font-normal text-tinta-suave line-through">
              {formatPrice(precios.normal, precios.currency)}
            </span>
          )}
          {formatPrice(precios.efectivo, precios.currency)} {precios.currency.toUpperCase()}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setMethod("paypal")}
          aria-pressed={method === "paypal"}
          className={`${optionBase} ${
            method === "paypal" ? "border-azul bg-tinte-azul" : "border-linea"
          }`}
        >
          <p className="font-semibold text-tinta">Tarjeta de crédito</p>
          <p className="text-sm text-tinta-suave">O tu cuenta PayPal, sin registrarte</p>
        </button>

        {/* Pago Movil, Zelle y Binance se cobran a mano: no abren un widget,
            salen de la pagina a WhatsApp con el mensaje ya escrito. */}
        {MEDIOS_MANUALES.map((medio) => (
          <a
            key={medio}
            href={whatsappUrl(pagoManualMessage(leadName, medio))}
            target="_blank"
            rel="noopener noreferrer"
            className={`${optionBase} border-linea hover:border-[#25D366]`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-tinta">{medio}</p>
                <p className="text-sm text-tinta-suave">Coordinamos por WhatsApp</p>
              </div>
              <WhatsappLogo size={22} weight="fill" className="shrink-0 text-[#25D366]" />
            </div>
          </a>
        ))}
      </div>

      <div className="min-h-[96px]">
        {method === "paypal" && <PaypalPaymentOption leadId={leadId} onSuccess={onSuccess} />}
        {method === null && (
          <p className="text-sm text-tinta-suave">Elige un método de pago para continuar.</p>
        )}
      </div>
    </div>
  );
}
