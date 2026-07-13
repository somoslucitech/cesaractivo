"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "@phosphor-icons/react";
import { useCheckout } from "./checkout-context";
import { LeadForm } from "./LeadForm";
import { PaymentStep } from "./PaymentStep";

export function CheckoutModal() {
  const { isOpen, close, step, leadId, setStep, setLeadId } = useCheckout();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-texto-oscuro/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-blanco-calido p-6 shadow-2xl sm:p-8"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="absolute right-4 top-4 rounded-full p-1.5 text-texto-medio transition-transform duration-150 hover:bg-crema active:scale-90"
            >
              <X size={20} weight="bold" />
            </button>

            {step === "form" && (
              <>
                <h2 className="font-display text-2xl text-azul-oscuro">Inicia tu Detox5</h2>
                <p className="mb-6 mt-1 text-sm text-texto-medio">
                  Registra tus datos para que Cesar y su equipo te acompanen desde el primer
                  dia.
                </p>
                <LeadForm
                  onCreated={(id) => {
                    setLeadId(id);
                    setStep("payment");
                  }}
                />
              </>
            )}

            {step === "payment" && leadId && (
              <>
                <h2 className="font-display text-2xl text-azul-oscuro">
                  Elige tu metodo de pago
                </h2>
                <p className="mb-6 mt-1 text-sm text-texto-medio">
                  Acceso inmediato tras la confirmacion del pago.
                </p>
                <PaymentStep leadId={leadId} onSuccess={() => setStep("success")} />
              </>
            )}

            {step === "success" && (
              <div className="py-4 text-center">
                <h2 className="font-display text-2xl text-azul-oscuro">
                  Listo, ya eres parte del reto
                </h2>
                <p className="mt-2 text-texto-medio">
                  En breve el equipo de Cesar te escribe por WhatsApp para activar tu ficha
                  C.A.D.D. y darte acceso al grupo de enfoque.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-6 rounded-full bg-azul px-6 py-3 font-semibold text-blanco-calido transition-transform duration-150 ease-out active:scale-[0.97]"
                >
                  Entendido
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
