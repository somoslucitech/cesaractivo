import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { ownerDeApi } from "@/lib/auth/guard";
import { invitarAdmin } from "@/lib/admins";

const cuerpo = z.object({
  email: z.string().trim().email("Correo inválido").max(180),
});

const MOTIVOS: Record<string, string> = {
  ya_es_admin: "Ese correo ya tiene acceso al panel.",
  ya_invitado: "Ese correo ya tiene una invitación pendiente.",
};

/** Invita a alguien por correo. Solo el propietario. */
export async function POST(req: NextRequest) {
  const sesion = await ownerDeApi();
  if (!sesion.ok) {
    return NextResponse.json(
      { error: sesion.estado === 401 ? "No autorizado" : "Solo el propietario puede invitar" },
      { status: sesion.estado },
    );
  }

  const parsed = cuerpo.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 },
    );
  }

  const res = await invitarAdmin(parsed.data.email, sesion.admin.adminId);
  if (!res.ok) {
    return NextResponse.json({ error: MOTIVOS[res.motivo] }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
