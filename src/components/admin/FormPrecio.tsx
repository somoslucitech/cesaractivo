"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { calcularPrecios, formatPrice, type ConfigPrecio } from "@/lib/pricing";

/** ISO a "2026-09-20T14:30", que es lo que entiende <input datetime-local>. */
function aLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function FormPrecio({ inicial }: { inicial: ConfigPrecio }) {
  const [precioUsd, setPrecioUsd] = useState(String(inicial.precioUsd));
  const [precioEur, setPrecioEur] = useState(String(inicial.precioEur));
  const [ofertaUsd, setOfertaUsd] = useState(
    inicial.ofertaPrecioUsd === null ? "" : String(inicial.ofertaPrecioUsd),
  );
  const [ofertaEur, setOfertaEur] = useState(
    inicial.ofertaPrecioEur === null ? "" : String(inicial.ofertaPrecioEur),
  );
  const [inicio, setInicio] = useState(aLocal(inicial.ofertaInicio));
  const [fin, setFin] = useState(aLocal(inicial.ofertaFin));
  const [error, setError] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);
  const [pendiente, startTransition] = useTransition();
  const router = useRouter();

  // Vista previa en vivo: lo mismo que calcula el servidor, para que se vea
  // el efecto antes de guardar. La decision real la toma siempre el servidor.
  const configPrevia: ConfigPrecio = {
    precioUsd: Number(precioUsd) || 0,
    precioEur: Number(precioEur) || 0,
    ofertaPrecioUsd: ofertaUsd.trim() === "" ? null : Number(ofertaUsd),
    ofertaPrecioEur: ofertaEur.trim() === "" ? null : Number(ofertaEur),
    ofertaInicio: inicio ? new Date(inicio).toISOString() : null,
    ofertaFin: fin ? new Date(fin).toISOString() : null,
  };
  const previaUsd = calcularPrecios(configPrevia, "usd");
  const previaEur = calcularPrecios(configPrevia, "eur");

  async function guardar() {
    setError(null);
    setGuardado(false);

    const res = await fetch("/api/admin/settings/pricing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        precioUsd: Number(precioUsd),
        precioEur: Number(precioEur),
        ofertaPrecioUsd: ofertaUsd.trim() === "" ? null : Number(ofertaUsd),
        ofertaPrecioEur: ofertaEur.trim() === "" ? null : Number(ofertaEur),
        ofertaInicio: inicio || undefined,
        ofertaFin: fin || undefined,
      }),
    });

    if (!res.ok) {
      const cuerpo = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(cuerpo?.error ?? "No se pudo guardar.");
      return;
    }

    setGuardado(true);
    startTransition(() => router.refresh());
  }

  const campo =
    "w-full rounded-xl border border-linea bg-superficie px-3 py-2 text-sm text-tinta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-texto";
  const etiqueta = "block text-sm font-medium text-tinta";

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl border border-linea bg-tarjeta p-6 shadow-[0_16px_36px_-24px_rgba(0,61,115,0.4)] sm:p-8">
        <h2 className="font-display text-xl text-tinta">Precio del Plan Detox5</h2>
        <p className="mt-1 text-sm text-tinta-suave">
          Son dos importes fijos e independientes, no una conversión: cada moneda tiene su propio
          precio y su propia oferta.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block max-w-[12rem]">
            <span className={etiqueta}>Precio normal en USD</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-display text-xl text-tinta-suave">$</span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={precioUsd}
                onChange={(e) => setPrecioUsd(e.target.value)}
                className={campo}
              />
            </div>
          </label>

          <label className="block max-w-[12rem]">
            <span className={etiqueta}>Precio normal en EUR</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-display text-xl text-tinta-suave">€</span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={precioEur}
                onChange={(e) => setPrecioEur(e.target.value)}
                className={campo}
              />
            </div>
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-linea bg-tarjeta p-6 shadow-[0_16px_36px_-24px_rgba(0,61,115,0.4)] sm:p-8">
        <h2 className="font-display text-xl text-tinta">Oferta</h2>
        <p className="mt-1 text-sm text-tinta-suave">
          Deja el precio de oferta vacío en la moneda que no quieras rebajar. Las fechas son
          compartidas: es una sola promoción con un precio distinto por moneda. Sin fecha de
          inicio empieza ya; sin fecha de fin no caduca.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={etiqueta}>Precio de oferta en USD</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-display text-xl text-tinta-suave">$</span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={ofertaUsd}
                onChange={(e) => setOfertaUsd(e.target.value)}
                placeholder="sin oferta"
                className={campo}
              />
            </div>
          </label>

          <label className="block">
            <span className={etiqueta}>Precio de oferta en EUR</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-display text-xl text-tinta-suave">€</span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={ofertaEur}
                onChange={(e) => setOfertaEur(e.target.value)}
                placeholder="sin oferta"
                className={campo}
              />
            </div>
          </label>

          <label className="block">
            <span className={etiqueta}>Empieza</span>
            <input
              type="datetime-local"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              className={`${campo} mt-1`}
            />
          </label>

          <label className="block">
            <span className={etiqueta}>Termina</span>
            <input
              type="datetime-local"
              value={fin}
              onChange={(e) => setFin(e.target.value)}
              className={`${campo} mt-1`}
            />
          </label>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { etiqueta: "Así se verá en USD", precios: previaUsd, sinOferta: ofertaUsd.trim() === "" },
            { etiqueta: "Así se verá en EUR", precios: previaEur, sinOferta: ofertaEur.trim() === "" },
          ].map(({ etiqueta: et, precios, sinOferta }) => (
            <div key={et} className="rounded-2xl bg-superficie-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-acento">{et}</p>
              <p className="mt-2 font-display text-3xl text-azul-texto">
                {precios.enOferta && (
                  <span className="mr-2 align-middle text-lg font-normal text-tinta-suave line-through">
                    {formatPrice(precios.normal, precios.currency)}
                  </span>
                )}
                {formatPrice(precios.efectivo, precios.currency)}
              </p>
              <p className="mt-1 text-sm text-tinta-suave">
                {precios.enOferta
                  ? "Oferta activa en este momento."
                  : sinOferta
                    ? "Sin oferta configurada."
                    : "Configurada, pero no vigente ahora mismo."}
              </p>
            </div>
          ))}
        </div>
      </section>

      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
      {guardado && !error && (
        <p role="status" className="text-sm text-azul-texto">
          Guardado. El precio ya cambió en la página.
        </p>
      )}

      <div>
        <button
          type="button"
          onClick={guardar}
          disabled={pendiente}
          className="rounded-full bg-azul px-6 py-3 font-semibold text-blanco-calido transition-transform duration-[var(--dur-press)] ease-signature active:scale-[0.97] disabled:opacity-60"
        >
          {pendiente ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
