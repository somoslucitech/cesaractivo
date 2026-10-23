import type { Lead } from "./types";
import { getDb } from "./cloudflare";

export async function createLead(input: {
  name: string;
  email: string;
  whatsapp: string;
  currency: "usd" | "eur";
  /**
   * Importes ya con la oferta aplicada si la habia. Los calcula quien llama,
   * SIEMPRE en el servidor: se guarda el precio del momento porque una
   * oferta que caduque manana no debe cambiar lo que figura que pago alguien
   * hoy.
   *
   * montoUsd va siempre poblado (es el precio de referencia, se haya pagado
   * en la moneda que se haya pagado); montoEur solo cuando currency es "eur".
   */
  montoUsd: number;
  montoEur?: number | null;
  /** Atribucion: de donde venia quien dejo sus datos. Opcional a proposito. */
  visitorHash?: string | null;
  country?: string | null;
  referrer?: string | null;
}): Promise<Lead> {
  const db = await getDb();
  const id = crypto.randomUUID();

  await db
    .prepare(
      `INSERT INTO leads (id, name, email, whatsapp, amount_usd, amount_eur, currency, visitor_hash, country, referrer)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      input.name,
      input.email,
      input.whatsapp,
      input.montoUsd,
      input.currency === "eur" ? (input.montoEur ?? null) : null,
      input.currency,
      input.visitorHash ?? null,
      input.country ?? null,
      input.referrer ?? null,
    )
    .run();

  const lead = await db
    .prepare(`SELECT * FROM leads WHERE id = ?`)
    .bind(id)
    .first<Lead>();

  if (!lead) throw new Error("No se pudo crear el lead");
  return lead;
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const db = await getDb();
  return db.prepare(`SELECT * FROM leads WHERE id = ?`).bind(id).first<Lead>();
}

export async function attachApoloPayProcess(leadId: string, processId: string) {
  const db = await getDb();
  await db
    .prepare(
      `UPDATE leads
       SET payment_method = 'apolopay', apolopay_process_id = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
       WHERE id = ?`,
    )
    .bind(processId, leadId)
    .run();
}

export async function attachPaypalOrder(leadId: string, orderId: string) {
  const db = await getDb();
  await db
    .prepare(
      `UPDATE leads
       SET payment_method = 'paypal', paypal_order_id = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
       WHERE id = ?`,
    )
    .bind(orderId, leadId)
    .run();
}

/**
 * Resultado de marcar un pago. `recienPagado` dice si ESTA llamada fue la que
 * lo paso a pagado: la captura de PayPal y su webhook llegan casi a la vez y
 * solo el primero debe enviar los correos.
 */
export type ResultadoPago = { lead: Lead; recienPagado: boolean };

async function markPaidByColumn(
  column: "apolopay_process_id" | "paypal_order_id",
  value: string,
): Promise<ResultadoPago | null> {
  const db = await getDb();

  // El "AND payment_status != 'paid'" hace atomico el cambio: si dos
  // peticiones llegan a la vez, solo una ve changes = 1. Leer primero y
  // escribir despues dejaba una ventana en la que ambas creian ser la primera.
  const res = await db
    .prepare(
      `UPDATE leads
       SET payment_status = 'paid', paid_at = strftime('%Y-%m-%dT%H:%M:%fZ','now'), updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
       WHERE ${column} = ? AND payment_status != 'paid'`,
    )
    .bind(value)
    .run();

  const lead = await db
    .prepare(`SELECT * FROM leads WHERE ${column} = ?`)
    .bind(value)
    .first<Lead>();

  if (!lead) return null;
  return { lead, recienPagado: (res.meta.changes ?? 0) > 0 };
}

export async function markLeadPaidByApoloPayProcessId(processId: string) {
  return markPaidByColumn("apolopay_process_id", processId);
}

export async function markLeadPaidByPaypalOrderId(orderId: string) {
  return markPaidByColumn("paypal_order_id", orderId);
}
