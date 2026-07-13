"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { CheckoutModal } from "./CheckoutModal";

type Step = "form" | "payment" | "success";

interface CheckoutContextValue {
  isOpen: boolean;
  step: Step;
  leadId: string | null;
  open: () => void;
  close: () => void;
  setStep: (step: Step) => void;
  setLeadId: (id: string) => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [leadId, setLeadId] = useState<string | null>(null);

  function open() {
    setStep("form");
    setLeadId(null);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <CheckoutContext.Provider
      value={{ isOpen, step, leadId, open, close, setStep, setLeadId }}
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
