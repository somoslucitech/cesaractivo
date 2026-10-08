import { NextResponse, type NextRequest } from "next/server";
import { cf } from "@/lib/cloudflare";
import { getOrCreateDeviceId } from "@/lib/device";
import { readGeo, readDeviceKind } from "@/lib/geo";
import { trackEvent, type EventType } from "@/lib/analytics";

/**
 * Ingesta de eventos que se disparan desde el navegador.
 *
 * Solo se admiten los dos que no se pueden observar desde el servidor. Los
 * eventos "de valor" (lead_created, payment_method_selected, purchase) se
 * emiten en el servidor desde sus propias rutas: si se aceptaran aqui,
 * cualquiera podria inflar las ventas con un curl.
 */
const PERMITIDOS: EventType[] = ["page_view", "checkout_open"];

export async function POST(req: NextRequest) {
  let body: { type?: string; path?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "cuerpo invalido" }, { status: 400 });
  }

  if (!PERMITIDOS.includes(body.type as EventType)) {
    return NextResponse.json({ error: "evento no permitido" }, { status: 400 });
  }

  const { request } = await cf();
  const deviceId = await getOrCreateDeviceId();

  await trackEvent({
    type: body.type as EventType,
    deviceId,
    path: body.path ?? null,
    referrer: req.headers.get("referer"),
    deviceKind: readDeviceKind(req.headers.get("user-agent")),
    ...readGeo(request),
  });

  return NextResponse.json({ ok: true });
}
