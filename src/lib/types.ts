export type PaymentMethod = "paypal" | "apolopay";
export type PaymentStatus = "pending" | "paid" | "failed" | "expired";

export interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  amount_usd: number;
  payment_method: PaymentMethod | null;
  payment_status: PaymentStatus;
  apolopay_process_id: string | null;
  paypal_order_id: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}
