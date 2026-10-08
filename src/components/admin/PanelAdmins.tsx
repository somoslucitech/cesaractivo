"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Prohibit, ArrowCounterClockwise, X } from "@phosphor-icons/react";
import type { FilaAdmin, FilaInvitacion } from "@/lib/admins";

function fecha(ms: number): string {
  return new Date(ms).toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric" });
}

export function PanelAdmins({
  admins,
  invitaciones,
  esPropietario,
  miId,
  urlPanel,
}: {
  admins: FilaAdmin[];
  invitaciones: FilaInvitacion[];
  esPropietario: boolean;
  miId: string;
  urlPanel: string;
}) {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [pendiente, startTransition] = useTransition();
  const router = useRouter();

  async function llamar(url: string, init: RequestInit, exito: string) {
    setError(null);
    setAviso(null);
    const res = await fetch(url, init);
    if (!res.ok) {
      const c = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(c?.error ?? "No se pudo completar la acción.");
      return false;
    }
    setAviso(exito);
    startTransition(() => router.refresh());
    return true;
  }

  async function invitar() {
    const ok = await llamar(
      "/api/admin/invitations",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: correo }),
      },
      `Invitación creada. Pásale la dirección del panel a ${correo} para que entre con Google.`,
    );
    if (ok) setCorreo("");
  }

  return (
    <section className="rounded-3xl border border-linea bg-tarjeta p-6 shadow-[0_16px_36px_-24px_rgba(0,61,115,0.4)] sm:p-8">
      <h2 className="font-display text-xl text-tinta">Quién puede entrar</h2>
      <p className="mt-1 text-sm text-tinta-suave">
        {esPropietario
          ? "Invita por correo. La persona entra con su cuenta de Google en la dirección del panel; no se envía ningún correo automático."
          : "Solo el propietario puede invitar o suspender."}
      </p>

      {esPropietario && (
        <div className="mt-5 flex flex-wrap items-end gap-3">
          <label className="min-w-[16rem] flex-1">
            <span className="block text-sm font-medium text-tinta">Correo de Google</span>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="persona@gmail.com"
              className="mt-1 w-full rounded-xl border border-linea bg-superficie px-3 py-2 text-sm text-tinta placeholder:text-tinta-suave focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-texto"
            />
          </label>
          <button
            type="button"
            onClick={invitar}
            disabled={pendiente || correo.trim() === ""}
            className="inline-flex items-center gap-1.5 rounded-full bg-azul px-5 py-2.5 text-sm font-semibold text-blanco-calido transition-transform duration-[var(--dur-press)] ease-signature active:scale-[0.97] disabled:opacity-60"
          >
            <UserPlus size={16} weight="bold" />
            Invitar
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-error">
          {error}
        </p>
      )}
      {aviso && !error && (
        <p role="status" className="mt-3 rounded-2xl bg-tinte-azul p-3 text-sm text-azul-texto">
          {aviso}
        </p>
      )}

      {esPropietario && (
        <p className="mt-4 rounded-2xl bg-superficie-2 p-3 text-xs text-tinta-suave">
          Dirección del panel: <span className="font-medium text-tinta">{urlPanel}</span>
        </p>
      )}

      <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-acento">
        Administradores
      </h3>
      <ul className="mt-3 flex flex-col divide-y divide-linea">
        {admins.map((a) => {
          const suspendido = a.status === "suspendido";
          return (
            <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
              <div className="min-w-0">
                <p className="font-medium text-tinta">
                  {a.name}
                  {a.id === miId && <span className="ml-2 text-xs text-tinta-suave">(tú)</span>}
                </p>
                <p className="truncate text-sm text-tinta-suave">{a.email}</p>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  a.role === "owner" ? "bg-tinte-amarillo text-acento" : "bg-superficie-2 text-tinta-suave"
                }`}
              >
                {a.role === "owner" ? "Propietario" : "Admin"}
              </span>

              {suspendido && (
                <span className="rounded-full bg-superficie-2 px-2.5 py-1 text-xs font-semibold text-error">
                  Suspendido
                </span>
              )}

              <span className="text-xs text-tinta-suave">
                {a.last_login_at ? `Entró ${fecha(a.last_login_at)}` : "Nunca entró"}
              </span>

              {esPropietario && a.id !== miId && (
                <button
                  type="button"
                  disabled={pendiente}
                  onClick={() =>
                    llamar(
                      `/api/admin/admins/${a.id}`,
                      {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ estado: suspendido ? "activo" : "suspendido" }),
                      },
                      suspendido ? "Acceso reactivado." : "Acceso suspendido.",
                    )
                  }
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-linea px-3 py-1.5 text-xs font-semibold text-tinta-suave transition-colors duration-[var(--dur-hover)] hover:text-tinta disabled:opacity-60"
                >
                  {suspendido ? (
                    <>
                      <ArrowCounterClockwise size={14} weight="bold" />
                      Reactivar
                    </>
                  ) : (
                    <>
                      <Prohibit size={14} weight="bold" />
                      Suspender
                    </>
                  )}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {invitaciones.length > 0 && (
        <>
          <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-acento">
            Invitaciones pendientes
          </h3>
          <ul className="mt-3 flex flex-col divide-y divide-linea">
            {invitaciones.map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                <span className="text-sm text-tinta">{inv.email}</span>
                <span className="text-xs text-tinta-suave">
                  caduca el {fecha(inv.expires_at)}
                </span>
                {esPropietario && (
                  <button
                    type="button"
                    disabled={pendiente}
                    onClick={() =>
                      llamar(
                        `/api/admin/invitations/${inv.id}`,
                        { method: "DELETE" },
                        "Invitación revocada.",
                      )
                    }
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-linea px-3 py-1.5 text-xs font-semibold text-tinta-suave transition-colors duration-[var(--dur-hover)] hover:text-tinta disabled:opacity-60"
                  >
                    <X size={14} weight="bold" />
                    Revocar
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
