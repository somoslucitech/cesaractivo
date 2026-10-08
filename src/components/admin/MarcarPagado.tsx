"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "@phosphor-icons/react";

/**
 * Confirma a mano el pago de un lead.
 *
 * Existe por Zelle y Pago Movil: esos pagos se cierran por WhatsApp y no
 * dejan ningun rastro automatico en la base, asi que sin este boton esas
 * personas quedarian como "casi compro" para siempre y los ingresos del
 * panel saldrian por debajo de lo real.
 */
export function MarcarPagado({ leadId, nombre }: { leadId: string; nombre: string }) {
  const [abierto, setAbierto] = useState(false);
  const [metodo, setMetodo] = useState<"zelle" | "pago_movil" | "otro">("zelle");
  const [nota, setNota] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendiente, startTransition] = useTransition();
  const router = useRouter();

  async function confirmar() {
    setError(null);
    const res = await fetch(`/api/admin/leads/${leadId}/mark-paid`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metodo, nota: nota.trim() || undefined }),
    });

    if (!res.ok) {
      const cuerpo = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(cuerpo?.error ?? "No se pudo guardar. Inténtalo de nuevo.");
      return;
    }

    setAbierto(false);
    setNota("");
    // refresh() revalida el Server Component: la fila desaparece de
    // "pendientes" y los ingresos suben sin recargar la pagina entera.
    startTransition(() => router.refresh());
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-linea px-3 py-1.5 text-xs font-semibold text-tinta-suave transition-colors duration-[var(--dur-hover)] hover:border-azul/30 hover:text-azul-texto"
      >
        <CheckCircle size={14} weight="bold" />
        Marcar pagado
      </button>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-superficie-2 p-4">
      <p className="text-sm font-medium text-tinta">Confirmar el pago de {nombre}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {(
          [
            ["zelle", "Zelle"],
            ["pago_movil", "Pago Móvil"],
            ["otro", "Otro"],
          ] as const
        ).map(([valor, etiqueta]) => (
          <button
            key={valor}
            type="button"
            onClick={() => setMetodo(valor)}
            aria-pressed={metodo === valor}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-[var(--dur-hover)] ${
              metodo === valor
                ? "bg-tinte-azul text-azul-texto"
                : "text-tinta-suave hover:text-tinta"
            }`}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      <label className="mt-3 block">
        <span className="sr-only">Nota sobre el pago</span>
        <input
          type="text"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Nota opcional: referencia, quién lo verificó…"
          maxLength={300}
          className="w-full rounded-xl border border-linea bg-tarjeta px-3 py-2 text-sm text-tinta placeholder:text-tinta-suave focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-texto"
        />
      </label>

      {error && (
        <p role="alert" className="mt-2 text-xs text-error">
          {error}
        </p>
      )}

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={confirmar}
          disabled={pendiente}
          className="rounded-full bg-azul px-4 py-2 text-xs font-semibold text-blanco-calido transition-transform duration-[var(--dur-press)] ease-signature active:scale-[0.97] disabled:opacity-60"
        >
          {pendiente ? "Guardando…" : "Confirmar pago"}
        </button>
        <button
          type="button"
          onClick={() => {
            setAbierto(false);
            setError(null);
          }}
          className="rounded-full px-4 py-2 text-xs font-semibold text-tinta-suave transition-colors duration-[var(--dur-hover)] hover:text-tinta"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
