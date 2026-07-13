import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { z } from "zod";
import { markLeadPaidByPaypalOrderId } from "@/lib/db";
import { capturePaypalOrder } from "@/lib/paypal";

const bodySchema = z.object({ orderId: z.string().min(1) });

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "orderId invalido" }, { status: 400 });
  }

  const { env } = await getCloudflareContext({ async: true });
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) {
    return NextResponse.json(
      { error: "PayPal no esta configurado todavia" },
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

  // Actualizacion optimista para la UI. El webhook de PayPal
  // (PAYMENT.CAPTURE.COMPLETED) es la fuente de verdad definitiva.
  if (capture.status === "COMPLETED") {
    await markLeadPaidByPaypalOrderId(parsed.data.orderId);
  }

  return NextResponse.json({ status: capture.status });
}
