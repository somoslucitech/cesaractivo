import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/db";
import { leadSchema } from "@/lib/schemas";
import { cf } from "@/lib/cloudflare";
import { getOrCreateDeviceId } from "@/lib/device";
import { readGeo, readDeviceKind } from "@/lib/geo";
import { hashVisitor, trackEvent } from "@/lib/analytics";
import { obtenerConfigPrecio } from "@/lib/settings";
import { calcularPrecios } from "@/lib/pricing";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // La atribucion se guarda en la propia fila del lead ademas de en el evento:
  // asi el panel puede mostrar de donde venia cada persona sin tener que cruzar
  // dos tablas con formatos de fecha distintos.
  const { request: cfRequest } = await cf();
  const geo = readGeo(cfRequest);
  const referrer = request.headers.get("referer");

  let visitorHash: string | null = null;
  let deviceId: string | null = null;
  try {
    deviceId = await getOrCreateDeviceId();
    visitorHash = await hashVisitor(deviceId);
  } catch (error) {
    // Sin cookie de dispositivo el lead se crea igual: la atribucion es
    // deseable, pero jamas puede impedir que alguien se registre.
    console.error("[cesaractivo] no se pudo resolver el visitante:", error);
  }

  // El precio se resuelve aqui, en el servidor, y NO se acepta del cliente:
  // si el importe viniera del cuerpo, cualquiera podria registrarse por un
  // euro. Se calculan ambas monedas: amount_usd queda siempre como precio de
  // referencia, se haya pagado en la moneda que se haya pagado.
  const config = await obtenerConfigPrecio();
  const preciosUsd = calcularPrecios(config, "usd");
  const precioElegido = calcularPrecios(config, parsed.data.currency);

  const lead = await createLead({
    ...parsed.data,
    montoUsd: preciosUsd.efectivo,
    montoEur: parsed.data.currency === "eur" ? precioElegido.efectivo : null,
    visitorHash,
    country: geo.country ?? null,
    referrer,
  });

  await trackEvent({
    type: "lead_created",
    deviceId,
    leadId: lead.id,
    referrer,
    deviceKind: readDeviceKind(request.headers.get("user-agent")),
    meta: {
      currency: parsed.data.currency,
      monto: precioElegido.efectivo,
      enOferta: precioElegido.enOferta,
    },
    ...geo,
  });

  return NextResponse.json({ leadId: lead.id });
}
