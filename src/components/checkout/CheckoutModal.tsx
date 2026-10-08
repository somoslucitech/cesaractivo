"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, SealCheck } from "@phosphor-icons/react";
import { useCheckout } from "./checkout-context";
import { LeadForm } from "./LeadForm";
import { PaymentStep } from "./PaymentStep";
import { DUR, EASE_EXIT, EASE_SIGNATURE, FOLLOW_THROUGH } from "@/lib/motion";
import { trackMeta } from "@/lib/meta-pixel";
import { CURRENCY_LABEL } from "@/lib/pricing";

/** Back-out con leve overshoot, solo para el acento Energetic del exito. */
const EASE_OVERSHOOT = [0.34, 1.56, 0.64, 1] as const;

export function CheckoutModal() {
  const { isOpen, close, step, leadId, leadName, precios, setStep, setLead } = useCheckout();
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
          transition={{ duration: DUR.backdrop, ease: EASE_SIGNATURE }}
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          {/* Panel: entra 350-400ms (foco entrando), sale ~30% mas rapido.
              50ms de rezago sobre el fondo (recipe "Modal Open" del skill de
              motion) para que se lea como dos capas, no un solo bloque. */}
          <motion.div
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-tarjeta p-6 shadow-2xl sm:p-8"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: DUR.modalOut, ease: EASE_EXIT } }}
            transition={{ duration: DUR.modalIn, delay: 0.05, ease: EASE_SIGNATURE }}
            onClick={(event) => event.stopPropagation()}
          >
            {/* Follow-through: el contenido llega despues que el panel. */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DUR.quick, delay: 0.05 + FOLLOW_THROUGH, ease: EASE_SIGNATURE }}
            >
              <AnimatePresence mode="wait">
                {step === "form" && (
                  <motion.div
                    key="form"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8, transition: { duration: DUR.stepOut, ease: EASE_EXIT } }}
                    transition={{ duration: DUR.stepIn, ease: EASE_SIGNATURE }}
                  >
                    <h2 className="font-display text-2xl text-azul-titulo">Inicia tu Detox5</h2>
                    <p className="mb-6 mt-1 text-sm text-tinta-suave">
                      Registra tus datos para que César y su equipo te acompañen desde el
                      primer día.
                    </p>
                    <LeadForm
                      onCreated={(lead) => {
                        setLead(lead);
                        trackMeta("Lead", {}, lead.id);
                        setStep("payment");
                      }}
                    />
                  </motion.div>
                )}

                {step === "payment" && leadId && (
                  <motion.div
                    key="payment"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8, transition: { duration: DUR.stepOut, ease: EASE_EXIT } }}
                    transition={{ duration: DUR.stepIn, ease: EASE_SIGNATURE }}
                  >
                    <h2 className="font-display text-2xl text-azul-titulo">
                      Elige tu método de pago
                    </h2>
                    <p className="mb-6 mt-1 text-sm text-tinta-suave">
                      Acceso inmediato tras la confirmación del pago.
                    </p>
                    <PaymentStep
                      leadId={leadId}
                      leadName={leadName}
                      onSuccess={() => {
                        // Valor de pantalla, no el cobrado: para medir
                        // anuncios basta. leadId hace de eventID para que
                        // Meta descarte duplicados.
                        trackMeta(
                          "Purchase",
                          { value: precios.efectivo, currency: CURRENCY_LABEL[precios.currency] },
                          `purchase-${leadId}`,
                        );
                        setStep("success");
                      }}
                    />
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DUR.stepIn, ease: EASE_SIGNATURE }}
                    className="py-4 text-center"
                  >
                    {/* Unico otro momento Energetic ademas del CTA: es el pico
                        emocional del embudo, el usuario acaba de pagar. Pop
                        con leve overshoot en vez del fade plano que tenia
                        antes (arrancaba en 0, sin celebracion). */}
                    <motion.span
                      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: DUR.settle, delay: FOLLOW_THROUGH, ease: EASE_OVERSHOOT }}
                      className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-tinte-azul"
                    >
                      <SealCheck size={30} weight="fill" className="text-azul-texto" />
                    </motion.span>
                    <h2 className="mt-4 font-display text-2xl text-azul-titulo">
                      Listo, ya eres parte del reto
                    </h2>
                    <p className="mt-2 text-tinta-suave">
                      En breve el equipo de César te escribe por WhatsApp para activar tu
                      ficha C.A.D.D. y darte acceso al grupo de enfoque.
                    </p>
                    <button
                      type="button"
                      onClick={close}
                      className="mt-6 rounded-full bg-azul px-6 py-3 font-semibold text-blanco-calido transition-transform duration-150 ease-signature active:scale-[0.97]"
                    >
                      Entendido
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Cierra al final del gesto de entrada (recipe "Modal Open"). */}
            <motion.button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: DUR.quick, delay: 0.15, ease: EASE_SIGNATURE }}
              className="absolute right-4 top-4 rounded-full p-1.5 text-tinta-suave transition-transform duration-150 ease-signature hover:bg-superficie-2 active:scale-90"
            >
              <X size={20} weight="bold" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
