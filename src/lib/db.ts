import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Lead } from "./types";

async function getDb() {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}

export const DETOX5_AMOUNT_USD = 18;

export async function createLead(input: {
  name: string;
  email: string;
  whatsapp: string;
}): Promise<Lead> {
  const db = await getDb();
  const id = crypto.randomUUID();

  await db
    .prepare(
      `INSERT INTO leads (id, name, email, whatsapp, amount_usd) VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(id, input.name, input.email, input.whatsapp, DETOX5_AMOUNT_USD)
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

async function markPaidByColumn(column: "apolopay_process_id" | "paypal_order_id", value: string): Promise<Lead | null> {
  const db = await getDb();

  const lead = await db
    .prepare(`SELECT * FROM leads WHERE ${column} = ?`)
    .bind(value)
    .first<Lead>();

  if (!lead) return null;
  if (lead.payment_status === "paid") return lead;

  await db
    .prepare(
      `UPDATE leads
       SET payment_status = 'paid', paid_at = strftime('%Y-%m-%dT%H:%M:%fZ','now'), updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
       WHERE id = ?`,
    )
    .bind(lead.id)
    .run();

  return { ...lead, payment_status: "paid" };
}

export async function markLeadPaidByApoloPayProcessId(processId: string) {
  return markPaidByColumn("apolopay_process_id", processId);
}

export async function markLeadPaidByPaypalOrderId(orderId: string) {
  return markPaidByColumn("paypal_order_id", orderId);
}
