import { useSyncExternalStore } from "react";

/**
 * Pixel de Meta (Facebook/Instagram Ads), solo en el navegador.
 *
 * El ID vive en `vars` de wrangler.jsonc (META_PIXEL_ID): el layout lo lee en
 * el servidor y lo pasa por props. Es publico, asi que no hace falta Secret.
 * Si falta, el pixel no se carga y el banner de cookies no aparece.
 */

/**
 * Clave de localStorage con la eleccion del banner de cookies. Sin "aceptado"
 * guardado, el script de Meta no se descarga (RGPD: hay trafico en EUR).
 */
export const CLAVE_CONSENTIMIENTO = "consentimiento-cookies";
export const EVENTO_CONSENTIMIENTO = "consentimiento-cambio";

/**
 * Rutas donde se mide. Es una lista de permitidas y no de excluidas porque la
 * URL del panel es secreta y el navegador no la conoce.
 */
const RUTAS_MEDIDAS = ["/", "/gracias"];

export function esRutaMedida(pathname: string): boolean {
  return RUTAS_MEDIDAS.includes(pathname);
}

export type Consentimiento = "aceptado" | "rechazado" | null;

function suscribirConsentimiento(avisar: () => void) {
  window.addEventListener(EVENTO_CONSENTIMIENTO, avisar);
  // "storage" cubre el caso de elegir en otra pestana.
  window.addEventListener("storage", avisar);
  return () => {
    window.removeEventListener(EVENTO_CONSENTIMIENTO, avisar);
    window.removeEventListener("storage", avisar);
  };
}

/**
 * Eleccion actual del banner. En el servidor devuelve "desconocido": no puede
 * saber que eligio la visitante, y asi el HTML inicial no muestra el banner
 * ni carga el pixel hasta que el navegador lo decida.
 */
export function useConsentimiento(): Consentimiento | "desconocido" {
  return useSyncExternalStore(
    suscribirConsentimiento,
    leerConsentimiento,
    () => "desconocido" as const,
  );
}

/** Respaldo para cuando localStorage esta bloqueado: vale solo esta visita. */
let consentimientoEnMemoria: Consentimiento = null;

export function leerConsentimiento(): Consentimiento {
  try {
    const v = localStorage.getItem(CLAVE_CONSENTIMIENTO);
    return v === "aceptado" || v === "rechazado" ? v : consentimientoEnMemoria;
  } catch {
    return consentimientoEnMemoria;
  }
}

export function guardarConsentimiento(valor: "aceptado" | "rechazado") {
  consentimientoEnMemoria = valor;
  try {
    localStorage.setItem(CLAVE_CONSENTIMIENTO, valor);
  } catch {
    // Modo privado o storage bloqueado: queda el respaldo en memoria.
  }
  window.dispatchEvent(new CustomEvent(EVENTO_CONSENTIMIENTO, { detail: valor }));
}

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

/**
 * Equivalente al snippet base de Meta, sin el PageView final (lo envia
 * MetaPixel en cada cambio de ruta). Deja window.fbq definido al instante con
 * una cola, asi que cualquier evento enviado antes de que baje fbevents.js se
 * entrega igual. Idempotente: llamarlo dos veces no carga el script dos veces.
 */
export function iniciarPixel(pixelId: string) {
  if (!pixelId || window.fbq) return;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", pixelId);
}

/**
 * Envia un evento estandar de Meta. Si el pixel no esta cargado (sin ID, sin
 * consentimiento o bloqueado por un adblocker) no hace nada: medir nunca debe
 * romper la compra.
 *
 * `eventId` permite que Meta descarte duplicados si mas adelante se suma la
 * API de Conversiones desde el servidor con el mismo id.
 */
export function trackMeta(evento: string, params?: Record<string, unknown>, eventId?: string) {
  if (typeof window === "undefined" || !window.fbq) return;
  // Si rechazo despues de aceptar, fbq sigue en memoria hasta recargar.
  if (leerConsentimiento() !== "aceptado") return;
  try {
    if (eventId) window.fbq("track", evento, params ?? {}, { eventID: eventId });
    else window.fbq("track", evento, params ?? {});
  } catch {
    // Nada: ver comentario de arriba.
  }
}
