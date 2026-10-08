import { cf } from "./cloudflare";
import { newId } from "./ids";

/**
 * Registro de eventos del embudo en la tabla `events` de D1.
 *
 * Se eligio D1 y no Workers Analytics Engine porque el volumen de una landing
 * de una sola pagina es bajo: asi los numeros son exactos (Analytics Engine
 * muestrea con volumen alto), el historial es permanente (alli son 3 meses) y
 * no hacen falta dos secretos mas para poder leerlos.
 */

/**
 * Solo estos tres. Los pasos "eligio metodo de pago" y "pago" NO son eventos:
 * salen de la propia tabla leads (payment_method y payment_status), que ya es
 * la fuente de verdad. Duplicarlos aqui crearia dos versiones del mismo dato
 * y tarde o temprano una de las dos mentiria.
 */
export type EventType = "page_view" | "checkout_open" | "lead_created";

export type TrackEventInput = {
  type: EventType;
  /** Valor crudo de la cookie de dispositivo. Se hashea antes de guardarlo. */
  deviceId?: string | null;
  leadId?: string | null;
  path?: string | null;
  referrer?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  deviceKind?: string | null;
  meta?: Record<string, unknown> | null;
};

/**
 * Hash con sal del identificador de dispositivo. Irreversible a proposito:
 * permite contar visitantes unicos sin que la fila sea un dato personal.
 */
async function hashDeviceId(deviceId: string, salt: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(salt + deviceId));
  return Array.from(new Uint8Array(buf).slice(0, 8), (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
}

export async function hashVisitor(deviceId: string): Promise<string> {
  const { env } = await cf();
  return hashDeviceId(deviceId, env.SESSION_SECRET);
}

/**
 * Registra un evento. NUNCA lanza: medir no puede romperle la compra a nadie.
 * Si la escritura falla, se anota en los logs del Worker y se sigue adelante.
 */
export async function trackEvent(input: TrackEventInput): Promise<void> {
  try {
    const { env } = await cf();
    const visitorHash = input.deviceId
      ? await hashDeviceId(input.deviceId, env.SESSION_SECRET)
      : "anonimo";

    await env.DB.prepare(
      `INSERT INTO events (id, type, visitor_hash, lead_id, path, referrer, country, region, city, device_kind, meta, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        newId("ev"),
        input.type,
        visitorHash,
        input.leadId ?? null,
        input.path ?? null,
        input.referrer ?? null,
        input.country ?? null,
        input.region ?? null,
        input.city ?? null,
        input.deviceKind ?? null,
        input.meta ? JSON.stringify(input.meta) : null,
        Date.now(),
      )
      .run();
  } catch (error) {
    console.error("[cesaractivo] no se pudo registrar el evento:", error);
  }
}
