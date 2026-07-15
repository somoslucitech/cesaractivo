import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { z } from "zod";
import { attachApoloPayProcess, getLeadById } from "@/lib/db";
import { createApoloPayPreorder } from "@/lib/apolopay";

const bodySchema = z.object({ leadId: z.string().uuid() });

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "leadId inválido" }, { status: 400 });
  }

  const lead = await getLeadById(parsed.data.leadId);
  if (!lead) {
    return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
  }

  const { env } = await getCloudflareContext({ async: true });
  if (!env.APOLOPAY_SECRET_KEY || !env.APOLOPAY_PUBLIC_KEY) {
    return NextResponse.json(
      { error: "ApoloPay no está configurado todavía" },
      { status: 503 },
    );
  }

  const { processId } = await createApoloPayPreorder(
    env.APOLOPAY_SECRET_KEY,
    lead.amount_usd,
    { orderId: lead.id, customerEmail: lead.email },
  );

  await attachApoloPayProcess(lead.id, processId);

  return NextResponse.json({
    processId,
    publicKey: env.APOLOPAY_PUBLIC_KEY,
  });
}
