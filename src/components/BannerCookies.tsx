"use client";

import { usePathname } from "next/navigation";
import {
  esRutaMedida,
  guardarConsentimiento,
  useConsentimiento,
} from "@/lib/meta-pixel";

/**
 * Aviso de cookies. Solo existe por el pixel de Meta: la analitica propia
 * (PageTracker) es de primera parte y no lo necesita. Por eso no se muestra
 * mientras no haya ID de pixel configurado.
 *
 * Solo aparece con consentimiento null (sin elegir). En el servidor vale
 * "desconocido", asi que el HTML inicial nunca lo trae y no hay desajuste
 * de hidratacion.
 */
export function BannerCookies({ pixelId }: { pixelId: string | undefined }) {
  const pathname = usePathname();
  const consentimiento = useConsentimiento();

  if (!pixelId || consentimiento !== null || !esRutaMedida(pathname)) return null;

  // guardarConsentimiento dispara el evento al que esta suscrito
  // useConsentimiento, asi que el banner se oculta solo.
  function elegir(valor: "aceptado" | "rechazado") {
    guardarConsentimiento(valor);
  }

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-linea bg-tarjeta px-4 py-4 shadow-[0_-12px_30px_-18px_rgba(0,0,0,0.35)] sm:px-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-tinta-suave">
          Usamos cookies de Meta para medir nuestros anuncios. ¿Nos lo permites?
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => elegir("rechazado")}
            className="rounded-full border border-tinta-suave/40 px-5 py-2.5 text-sm font-semibold text-tinta transition-transform duration-150 ease-signature active:scale-[0.97]"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => elegir("aceptado")}
            className="rounded-full bg-azul px-5 py-2.5 text-sm font-semibold text-blanco-calido transition-transform duration-150 ease-signature active:scale-[0.97]"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
