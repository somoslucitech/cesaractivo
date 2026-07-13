import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { markLeadPaidByPaypalOrderId } from "@/lib/db";
import { verifyPaypalWebhookSignature } from "@/lib/paypal";
import { notifyCoachNewPaidLead } from "@/lib/email";

interface PaypalCaptureCompletedEvent {
  event_type: string;
  resource: {
    supplementary_data?: {
      related_ids?: { order_id?: string };
    };
    custom_id?: string;
  };
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const { env } = await getCloudflareContext({ async: true });

  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET || !env.PAYPAL_WEBHOOK_ID) {
    return NextResponse.json(
      { error: "PayPal webhook no esta configurado todavia" },
      { status: 503 },
    );
  }

  const transmissionId = request.headers.get("paypal-transmission-id");
  const transmissionTime = request.headers.get("paypal-transmission-time");
  const certUrl = request.headers.get("paypal-cert-url");
  const authAlgo = request.headers.get("paypal-auth-algo");
  const transmissionSig = request.headers.get("paypal-transmission-sig");

  if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
    return NextResponse.json({ error: "Headers de PayPal incompletos" }, { status: 400 });
  }

  const event = JSON.parse(rawBody) as PaypalCaptureCompletedEvent;

  const isValid = await verifyPaypalWebhookSignature(
    {
      clientId: env.PAYPAL_CLIENT_ID,
      clientSecret: env.PAYPAL_CLIENT_SECRET,
      environment: env.PAYPAL_ENV ?? "sandbox",
    },
    env.PAYPAL_WEBHOOK_ID,
    { transmissionId, transmissionTime, certUrl, authAlgo, transmissionSig },
    event,
  );

  if (!isValid) {
    return NextResponse.json({ error: "Firma invalida" }, { status: 401 });
  }

  if (event.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const orderId = event.resource.supplementary_data?.related_ids?.order_id;
  if (!orderId) {
    return NextResponse.json({ error: "order_id ausente en el evento" }, { status: 400 });
  }

  const lead = await markLeadPaidByPaypalOrderId(orderId);

  if (lead && env.COACH_NOTIFY_EMAIL && env.COACH_FROM_EMAIL) {
    await notifyCoachNewPaidLead(env.EMAIL, {
      fromAddress: env.COACH_FROM_EMAIL,
      toAddress: env.COACH_NOTIFY_EMAIL,
      lead,
    });
  }

  return NextResponse.json({ ok: true });
}
