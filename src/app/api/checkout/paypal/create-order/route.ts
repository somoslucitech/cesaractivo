import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { z } from "zod";
import { attachPaypalOrder, getLeadById } from "@/lib/db";
import { createPaypalOrder } from "@/lib/paypal";

const bodySchema = z.object({ leadId: z.string().uuid() });

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "leadId invalido" }, { status: 400 });
  }

  const lead = await getLeadById(parsed.data.leadId);
  if (!lead) {
    return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
  }

  const { env } = await getCloudflareContext({ async: true });
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) {
    return NextResponse.json(
      { error: "PayPal no esta configurado todavia" },
      { status: 503 },
    );
  }

  const { orderId } = await createPaypalOrder(
    {
      clientId: env.PAYPAL_CLIENT_ID,
      clientSecret: env.PAYPAL_CLIENT_SECRET,
      environment: env.PAYPAL_ENV ?? "sandbox",
    },
    lead.amount_usd,
    lead.id,
  );

  await attachPaypalOrder(lead.id, orderId);

  return NextResponse.json({ orderId });
}
