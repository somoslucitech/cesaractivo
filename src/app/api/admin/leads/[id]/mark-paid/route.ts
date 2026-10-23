import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { adminDeApi } from "@/lib/auth/guard";
import { marcarPagadoAMano } from "@/lib/stats";
import { getLeadById } from "@/lib/db";
import { notificarPagoConfirmado } from "@/lib/notificaciones";

const cuerpo = z.object({
  metodo: z.enum(["zelle", "pago_movil", "otro"]),
  nota: z.string().trim().max(300).optional(),
});

/**
 * Confirma a mano el pago de un lead.
 *
 * La comprobacion de sesion va en la primera linea: las rutas de API NO pasan
 * por el layout del panel, asi que sin esto quedaria abierta a cualquiera que
 * adivinase la URL.
 *
 * Se usa adminDeApi() y no requireAdmin() para responder 401 en lugar de un
 * redirect: fetch() seguiria la redireccion hasta el login, recibiria un 200
 * con HTML y el panel creeria que el pago quedo confirmado.
 */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const admin = await adminDeApi();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await ctx.params;

  const parsed = cuerpo.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const cambiado = await marcarPagadoAMano({
    leadId: id,
    adminId: admin.adminId,
    metodo: parsed.data.metodo,
    nota: parsed.data.nota ?? null,
  });

  // No cambiar nada significa que no existe o que ya estaba pagado. Devolver
  // 409 y no 404 para que el panel pueda distinguirlo de un id inventado.
  if (!cambiado) {
    return NextResponse.json(
      { error: "Ese registro no existe o ya estaba marcado como pagado." },
      { status: 409 },
    );
  }

  // Zelle y Pago Movil: el coach ya lo sabe (es quien lo confirma), asi que
  // solo sale el agradecimiento a la compradora.
  const lead = await getLeadById(id);
  if (lead) await notificarPagoConfirmado(lead, { avisarCoach: false });

  return NextResponse.json({ ok: true });
}
