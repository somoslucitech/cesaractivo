import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  const { env } = await getCloudflareContext({ async: true });
  return NextResponse.json({ clientId: env.PAYPAL_CLIENT_ID ?? null });
}
