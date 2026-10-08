"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { CheckoutModal } from "./CheckoutModal";
import { calcularPrecios, type ConfigPrecio, type Currency, type Precios } from "@/lib/pricing";

type Step = "form" | "payment" | "success";

interface CheckoutContextValue {
  isOpen: boolean;
  step: Step;
  leadId: string | null;
  /** Nombre del formulario: lo usa Pago Movil para armar el mensaje de WhatsApp. */
  leadName: string;
  /**
   * Moneda elegida en el selector del nav. Vive aca y no en localStorage:
   * es una eleccion de la sesion de compra, no una preferencia durable como
   * el tema.
   */
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  /**
   * Precios de la moneda elegida.
   *
   * Son SOLO para mostrar. El importe que se cobra se recalcula en el
   * servidor en cada operacion: si el navegador pudiera decidir el precio,
   * cualquiera se llevaria el plan por un euro.
   */
  precios: Precios;
  open: () => void;
  close: () => void;
  setStep: (step: Step) => void;
  setLead: (lead: { id: string; name: string }) => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({
  children,
  config,
}: {
  children: ReactNode;
  /** Configuracion cruda leida en el servidor. El calculo por moneda se hace
   *  aqui para que cambiar de moneda sea instantaneo, sin ida y vuelta. */
  config: ConfigPrecio;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [leadName, setLeadName] = useState("");
  const [currency, setCurrency] = useState<Currency>("usd");

  const precios = useMemo(() => calcularPrecios(config, currency), [config, currency]);

  function open() {
    setStep("form");
    setLeadId(null);
    setLeadName("");
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  function setLead({ id, name }: { id: string; name: string }) {
    setLeadId(id);
    setLeadName(name);
  }

  return (
    <CheckoutContext.Provider
      value={{
        isOpen,
        step,
        leadId,
        leadName,
        currency,
        setCurrency,
        precios,
        open,
        close,
        setStep,
        setLead,
      }}
    >
      {children}
      <CheckoutModal />
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) {
    throw new Error("useCheckout debe usarse dentro de CheckoutProvider");
  }
  return ctx;
}
