import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { ownerDeApi } from "@/lib/auth/guard";
import { cambiarEstadoAdmin } from "@/lib/admins";

const cuerpo = z.object({ estado: z.enum(["activo", "suspendido"]) });

const MOTIVOS: Record<string, string> = {
  no_existe: "Ese administrador no existe.",
  es_uno_mismo: "No puedes suspenderte a ti mismo.",
  ultimo_propietario: "No puedes suspender al único propietario activo.",
};

/** Suspende o reactiva a un administrador. Solo el propietario. */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const sesion = await ownerDeApi();
  if (!sesion.ok) {
    return NextResponse.json(
      { error: sesion.estado === 401 ? "No autorizado" : "Solo el propietario puede hacer esto" },
      { status: sesion.estado },
    );
  }

  const parsed = cuerpo.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { id } = await ctx.params;
  const res = await cambiarEstadoAdmin(id, parsed.data.estado, sesion.admin.adminId);
  if (!res.ok) {
    return NextResponse.json({ error: MOTIVOS[res.motivo] }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
