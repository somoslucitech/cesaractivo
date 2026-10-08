"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Registra una visita cada vez que cambia la ruta. Va montado en el layout
 * raiz para que cubra tanto la carga inicial como la navegacion del App
 * Router, que no recarga la pagina y por tanto no dispararia nada sola.
 *
 * No registra el panel de administracion: mide la landing, no el trabajo
 * interno de quien la gestiona.
 */
export function PageTracker() {
  const pathname = usePathname();
  const ultimaRegistrada = useRef<string | null>(null);

  useEffect(() => {
    // React monta dos veces en desarrollo y el App Router puede repetir el
    // efecto sin que la ruta cambie: sin esta guarda se contarian visitas
    // de mas.
    if (ultimaRegistrada.current === pathname) return;
    ultimaRegistrada.current = pathname;

    // Si falla no pasa nada: medir nunca debe romper la pagina.
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "page_view", path: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}

/**
 * Registra que alguien abrio el checkout. Se llama desde el CTA, que es el
 * momento exacto en que una visita pasa de mirar a querer comprar.
 */
export function registrarAperturaCheckout() {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "checkout_open", path: window.location.pathname }),
    keepalive: true,
  }).catch(() => {});
}
