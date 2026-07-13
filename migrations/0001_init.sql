-- Leads del Plan Detox5. Un lead se crea al llenar el form de registro,
-- antes de que exista ningun pago. payment_status pasa a 'paid' solo cuando
-- el webhook del proveedor (fuente de verdad) lo confirma.
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  amount_usd REAL NOT NULL DEFAULT 18,
  payment_method TEXT CHECK (payment_method IN ('paypal', 'apolopay')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'expired')),
  apolopay_process_id TEXT,
  paypal_order_id TEXT,
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_apolopay_process_id ON leads(apolopay_process_id);
CREATE INDEX IF NOT EXISTS idx_leads_paypal_order_id ON leads(paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_leads_payment_status ON leads(payment_status);
