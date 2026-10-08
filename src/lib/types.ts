
/**
 * zelle, pago_movil y otro solo los escribe el panel al confirmar un pago a
 * mano: esos dos metodos se cierran por WhatsApp y no dejan rastro
 * automatico. Los dos primeros los escribe la pasarela.
 */
export type PaymentMethod = "paypal" | "apolopay" | "zelle" | "pago_movil" | "otro";
export type PaymentStatus = "pending" | "paid" | "failed" | "expired";

export interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  /** Precio de referencia en USD, siempre poblado sin importar la moneda pagada. */
  amount_usd: number;
  /** Monto en euros si currency es "eur"; null si el lead eligio USD. */
  amount_eur: number | null;
  currency: "usd" | "eur";
  payment_method: PaymentMethod | null;
  payment_status: PaymentStatus;
  apolopay_process_id: string | null;
  paypal_order_id: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  /** Quien confirmo el pago a mano desde el panel, si fue el caso. */
  marked_paid_by: string | null;
  marked_paid_at: string | null;
  marked_paid_note: string | null;
  /** Atribucion. Hash del visitante, nunca su identificador crudo ni su IP. */
  visitor_hash: string | null;
  country: string | null;
  referrer: string | null;
}
