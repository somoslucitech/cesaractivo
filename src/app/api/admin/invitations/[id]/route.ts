import { NextResponse } from "next/server";
import { ownerDeApi } from "@/lib/auth/guard";
import { revocarInvitacion } from "@/lib/admins";

/** Revoca una invitación pendiente. Solo el propietario. */
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const sesion = await ownerDeApi();
  if (!sesion.ok) {
    return NextResponse.json(
      { error: sesion.estado === 401 ? "No autorizado" : "Solo el propietario puede revocar" },
      { status: sesion.estado },
    );
  }

  const { id } = await ctx.params;
  const hecho = await revocarInvitacion(id);
  if (!hecho) {
    return NextResponse.json(
      { error: "Esa invitación no existe o ya estaba revocada." },
      { status: 409 },
    );
  }

  return NextResponse.json({ ok: true });
}
