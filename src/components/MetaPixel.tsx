"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  esRutaMedida,
  iniciarPixel,
  trackMeta,
  useConsentimiento,
} from "@/lib/meta-pixel";

/**
 * Carga el pixel de Meta solo si hay ID y la visitante acepto cookies, y
 * envia un PageView en cada cambio de ruta: el App Router navega sin recargar
 * y el snippet de Meta por si solo contaria unicamente la primera pagina.
 *
 * Si acepta en el banner, el pixel arranca en ese momento sin recargar. Si
 * despues rechaza, trackMeta deja de enviar eventos y la siguiente carga ya
 * no descarga el script.
 */
export function MetaPixel({ pixelId }: { pixelId: string | undefined }) {
  const pathname = usePathname();
  const aceptado = useConsentimiento() === "aceptado";
  const ultimaRegistrada = useRef<string | null>(null);

  useEffect(() => {
    if (!pixelId || !aceptado || !esRutaMedida(pathname)) return;
    // Misma guarda que PageTracker: evita PageView duplicados en desarrollo.
    if (ultimaRegistrada.current === pathname) return;
    ultimaRegistrada.current = pathname;
    iniciarPixel(pixelId);
    trackMeta("PageView");
  }, [pixelId, aceptado, pathname]);

  return null;
}
