import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { z } from "zod";
import { markLeadPaidByPaypalOrderId } from "@/lib/db";
import { capturePaypalOrder } from "@/lib/paypal";
import { notificarPagoConfirmado } from "@/lib/notificaciones";

const bodySchema = z.object({ orderId: z.string().min(1) });

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "orderId inválido" }, { status: 400 });
  }

  const { env } = await getCloudflareContext({ async: true });
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) {
    return NextResponse.json(
      { error: "PayPal no está configurado todavía" },
      { status: 503 },
    );
  }

  const capture = await capturePaypalOrder(
    {
      clientId: env.PAYPAL_CLIENT_ID,
      clientSecret: env.PAYPAL_CLIENT_SECRET,
      environment: env.PAYPAL_ENV ?? "sandbox",
    },
    parsed.data.orderId,
  );

  // La captura COMPLETED ya es la confirmacion de PayPal de que el dinero
  // entro. El webhook (PAYMENT.CAPTURE.COMPLETED) llega despues y cubre el
  // caso de que la compradora cierre la pestana antes de esta respuesta. Los
  // correos los envia el primero de los dos que marque el pago.
  if (capture.status === "COMPLETED") {
    const resultado = await markLeadPaidByPaypalOrderId(parsed.data.orderId);
    if (resultado?.recienPagado) {
      await notificarPagoConfirmado(resultado.lead, { avisarCoach: true });
    }
  }

  return NextResponse.json({ status: capture.status });
}
