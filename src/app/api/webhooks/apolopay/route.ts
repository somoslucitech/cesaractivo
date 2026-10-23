import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyApoloPaySignature, type ApoloPayWebhookEvent } from "@/lib/apolopay";
import { markLeadPaidByApoloPayProcessId } from "@/lib/db";
import { notificarPagoConfirmado } from "@/lib/notificaciones";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const { env } = await getCloudflareContext({ async: true });

  if (!env.APOLOPAY_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "ApoloPay webhook no está configurado todavía" },
      { status: 503 },
    );
  }

  const signature = request.headers.get("x-signature");
  const isValid = await verifyApoloPaySignature(
    rawBody,
    signature,
    env.APOLOPAY_WEBHOOK_SECRET,
  );

  if (!isValid) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as ApoloPayWebhookEvent;

  if (event.event !== "payment.completed") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const resultado = await markLeadPaidByApoloPayProcessId(event.processId);
  if (resultado?.recienPagado) {
    await notificarPagoConfirmado(resultado.lead, { avisarCoach: true });
  }

  return NextResponse.json({ ok: true });
}
