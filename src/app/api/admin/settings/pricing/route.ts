import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { adminDeApi } from "@/lib/auth/guard";
import { guardarConfigPrecio } from "@/lib/settings";

/**
 * Fecha opcional en formato de <input type="datetime-local"> ("2026-09-20T14:30").
 * Se normaliza a ISO UTC para guardarla igual que el resto de fechas.
 */
const fechaOpcional = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v && v.length > 0 ? v : null))
  .refine((v) => v === null || !Number.isNaN(Date.parse(v)), "Fecha inválida")
  .transform((v) => (v === null ? null : new Date(v).toISOString()));

const cuerpo = z
  .object({
    precioUsd: z.number().positive().max(100000),
    precioEur: z.number().positive().max(100000),
    ofertaPrecioUsd: z.number().positive().max(100000).nullable().optional().default(null),
    ofertaPrecioEur: z.number().positive().max(100000).nullable().optional().default(null),
    // Ventana compartida por las dos monedas: es una sola promocion con dos
    // precios, no dos promociones independientes.
    ofertaInicio: fechaOpcional,
    ofertaFin: fechaOpcional,
  })
  .refine((d) => d.ofertaPrecioUsd === null || d.ofertaPrecioUsd < d.precioUsd, {
    message: "El precio de oferta en USD tiene que ser menor que el normal",
    path: ["ofertaPrecioUsd"],
  })
  .refine((d) => d.ofertaPrecioEur === null || d.ofertaPrecioEur < d.precioEur, {
    message: "El precio de oferta en EUR tiene que ser menor que el normal",
    path: ["ofertaPrecioEur"],
  })
  .refine(
    (d) => !d.ofertaInicio || !d.ofertaFin || Date.parse(d.ofertaInicio) < Date.parse(d.ofertaFin),
    { message: "La fecha de fin tiene que ser posterior a la de inicio", path: ["ofertaFin"] },
  );

export async function PATCH(req: NextRequest) {
  const admin = await adminDeApi();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const parsed = cuerpo.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 },
    );
  }

  await guardarConfigPrecio(
    {
      precioUsd: parsed.data.precioUsd,
      precioEur: parsed.data.precioEur,
      ofertaPrecioUsd: parsed.data.ofertaPrecioUsd ?? null,
      ofertaPrecioEur: parsed.data.ofertaPrecioEur ?? null,
      ofertaInicio: parsed.data.ofertaInicio,
      ofertaFin: parsed.data.ofertaFin,
    },
    admin.adminId,
  );

  return NextResponse.json({ ok: true });
}
