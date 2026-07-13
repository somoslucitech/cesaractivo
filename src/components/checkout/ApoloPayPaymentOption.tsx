"use client";

import { useEffect, useState } from "react";
import { ApoloPayButton, ApoloPayClient } from "@apolopay-sdk/react";

interface ApoloPayPaymentOptionProps {
  leadId: string;
  onSuccess: () => void;
}

type State =
  | { status: "loading" }
  | { status: "ready"; client: ApoloPayClient; processId: string }
  | { status: "error" };

export function ApoloPayPaymentOption({ leadId, onSuccess }: ApoloPayPaymentOptionProps) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetch("/api/checkout/apolopay/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId }),
    })
      .then((res) => res.json() as Promise<{ processId?: string; publicKey?: string }>)
      .then((data) => {
        if (cancelled) return;
        if (!data.processId || !data.publicKey) {
          setState({ status: "error" });
          return;
        }
        setState({
          status: "ready",
          client: new ApoloPayClient({ publicKey: data.publicKey }),
          processId: data.processId,
        });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [leadId]);

  if (state.status === "loading") {
    return <p className="text-sm text-texto-medio">Preparando pago con criptomoneda...</p>;
  }

  if (state.status === "error") {
    return (
      <p className="text-sm text-texto-medio">
        El pago con criptomoneda no esta disponible en este momento. Intenta con PayPal.
      </p>
    );
  }

  return (
    <ApoloPayButton
      client={state.client}
      processId={state.processId}
      productTitle="Plan Detox5"
      lang="es"
      label="Pagar con criptomoneda"
      onSuccess={() => onSuccess()}
      onError={() => setState({ status: "error" })}
    />
  );
}
