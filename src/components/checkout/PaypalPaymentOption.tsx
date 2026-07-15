"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: Record<string, unknown>) => { render: (el: HTMLElement) => void };
    };
  }
}

interface PaypalPaymentOptionProps {
  leadId: string;
  onSuccess: () => void;
}

type Status = "loading-config" | "ready" | "processing" | "error";

export function PaypalPaymentOption({ leadId, onSuccess }: PaypalPaymentOptionProps) {
  const [clientId, setClientId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading-config");
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/checkout/paypal/config")
      .then((res) => res.json() as Promise<{ clientId: string | null }>)
      .then((data) => {
        if (cancelled) return;
        if (!data.clientId) {
          setStatus("error");
          return;
        }
        setClientId(data.clientId);
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleSdkReady() {
    if (renderedRef.current || !containerRef.current || !window.paypal) return;
    renderedRef.current = true;

    window.paypal
      .Buttons({
        style: { layout: "vertical", color: "blue", shape: "pill", label: "pay" },
        createOrder: async () => {
          const res = await fetch("/api/checkout/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ leadId }),
          });
          const data = (await res.json()) as { orderId?: string };
          if (!data.orderId) throw new Error("No se pudo crear la orden de PayPal");
          return data.orderId;
        },
        onApprove: async (data: { orderID: string }) => {
          setStatus("processing");
          try {
            const res = await fetch("/api/checkout/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderID }),
            });
            const result = (await res.json()) as { status?: string };
            if (result.status === "COMPLETED") {
              onSuccess();
            } else {
              setStatus("error");
            }
          } catch {
            setStatus("error");
          }
        },
        onError: () => setStatus("error"),
      })
      .render(containerRef.current);

    setStatus("ready");
  }

  if (status === "loading-config") {
    return <p className="text-sm text-texto-medio">Cargando PayPal...</p>;
  }

  if (status === "error" || !clientId) {
    return (
      <p className="text-sm text-texto-medio">
        PayPal no está disponible en este momento. Intenta con la otra opción de pago.
      </p>
    );
  }

  return (
    <div>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`}
        strategy="lazyOnload"
        onLoad={handleSdkReady}
        onReady={handleSdkReady}
      />
      <div ref={containerRef} />
      {status === "processing" && (
        <p className="mt-2 text-sm text-texto-medio">Confirmando tu pago...</p>
      )}
    </div>
  );
}
