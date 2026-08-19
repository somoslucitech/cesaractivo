import type { Currency } from "./pricing";

export type PaymentMethod = "paypal" | "apolopay";
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
  currency: Currency;
  payment_method: PaymentMethod | null;
  payment_status: PaymentStatus;
  apolopay_process_id: string | null;
  paypal_order_id: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}
