"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useCheckout } from "./checkout-context";

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

type Status = "idle" | "processing" | "error";

export function PaypalPaymentOption({ leadId, onSuccess }: PaypalPaymentOptionProps) {
  // El SDK de PayPal exige que el query param "currency" coincida con la
  // moneda de la orden que crea create-order (que a su vez lee lead.currency
  // desde la base), o el boton falla al pagar.
  const { currency } = useCheckout();
  const currencyCode = currency === "eur" ? "EUR" : "USD";
  const [clientId, setClientId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
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

  // Se dispara cuando el <Script> del SDK termina de cargar. Antes esto
  // nunca ocurria: el render se quedaba mostrando "Cargando PayPal..." para
  // siempre porque esa pantalla dependia de `status`, y aqui nunca se
  // actualizaba `status` tras recibir el clientId. Ahora el gate de carga es
  // `!clientId`, asi que en cuanto llega el clientId se monta el <Script> y
  // este callback si se ejecuta.
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
  }

  if (status === "error") {
    return (
      <p className="text-sm text-tinta-suave">
        PayPal no está disponible en este momento. Intenta con la otra opción de pago.
      </p>
    );
  }

  if (!clientId) {
    return <p className="text-sm text-tinta-suave">Cargando PayPal...</p>;
  }

  return (
    <div>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currencyCode}&intent=capture`}
        strategy="lazyOnload"
        onLoad={handleSdkReady}
        onReady={handleSdkReady}
      />
      <div ref={containerRef} />
      {status === "processing" && (
        <p className="mt-2 text-sm text-tinta-suave">Confirmando tu pago...</p>
      )}
    </div>
  );
}
