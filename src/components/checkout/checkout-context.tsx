"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { CheckoutModal } from "./CheckoutModal";

type Step = "form" | "payment" | "success";

interface CheckoutContextValue {
  isOpen: boolean;
  step: Step;
  leadId: string | null;
  /** Nombre del formulario: lo usa Pago Movil para armar el mensaje de WhatsApp. */
  leadName: string;
  open: () => void;
  close: () => void;
  setStep: (step: Step) => void;
  setLead: (lead: { id: string; name: string }) => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [leadName, setLeadName] = useState("");

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
      value={{ isOpen, step, leadId, leadName, open, close, setStep, setLead }}
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
