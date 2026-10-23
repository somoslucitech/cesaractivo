import { cf } from "./cloudflare";
import { enviarAgradecimientoCompra, notifyCoachNewPaidLead } from "./email";
import type { Lead } from "./types";

/**
 * Correos que salen cuando un pago queda confirmado: el aviso al coach y el
 * agradecimiento a la compradora.
 *
 * Solo debe llamarse cuando el pago ACABA de pasar a pagado (recienPagado en
 * db.ts), sea por la captura de PayPal, su webhook, el de ApoloPay o el
 * panel. Antes el aviso al coach dependia solo del webhook: si PayPal tardaba
 * o fallaba, nadie se enteraba de la venta.
 *
 * Va en waitUntil para no retrasar la respuesta del pago, y cada correo por
 * separado: que falle uno (por ejemplo, el dominio de Resend sin verificar)
 * no puede impedir el otro ni romper la compra.
 */
export async function notificarPagoConfirmado(lead: Lead, opts: { avisarCoach: boolean }) {
  const { env, ctx } = await cf();
  if (!env.RESEND_API_KEY || !env.COACH_FROM_EMAIL) {
    console.error("[cesaractivo] correos de pago sin enviar: faltan RESEND_API_KEY o COACH_FROM_EMAIL");
    return;
  }
  const apiKey = env.RESEND_API_KEY;
  const from = env.COACH_FROM_EMAIL;

  const envios: Promise<void>[] = [
    enviarAgradecimientoCompra(apiKey, { fromAddress: from, lead }).catch((error) =>
      console.error(`[cesaractivo] fallo el correo de agradecimiento del lead ${lead.id}:`, error),
    ),
  ];

  if (opts.avisarCoach && env.COACH_NOTIFY_EMAIL) {
    envios.push(
      notifyCoachNewPaidLead(apiKey, {
        fromAddress: from,
        toAddress: env.COACH_NOTIFY_EMAIL,
        lead,
      }).catch((error) =>
        console.error(`[cesaractivo] fallo el aviso al coach del lead ${lead.id}:`, error),
      ),
    );
  }

  ctx.waitUntil(Promise.all(envios));
}
