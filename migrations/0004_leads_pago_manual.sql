-- Amplia payment_method y anade atribucion a la tabla leads.
--
-- POR QUE SE RECONSTRUYE LA TABLA Y NO SE USA ALTER TABLE:
-- payment_method tenia CHECK (payment_method IN ('paypal','apolopay')), y
-- SQLite no permite modificar una restriccion CHECK existente. La unica via
-- es crear la tabla nueva, copiar las filas, borrar la vieja y renombrar.
--
-- EL PROBLEMA QUE RESUELVE:
-- quien paga por Zelle o Pago Movil se va a WhatsApp desde PaymentStep.tsx
-- con un simple <a href>, sin que se escriba nada en la base. Ese lead queda
-- en 'pending' para siempre aunque haya pagado. Sin poder marcarlo a mano,
-- el panel contaria como "casi compro" a gente que ya pago y reportaria
-- menos ingresos de los reales.
--
-- Esta migracion es destructiva por naturaleza (DROP TABLE). Verificar el
-- numero de filas de leads antes y despues de aplicarla.

CREATE TABLE leads_nueva (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  amount_usd REAL NOT NULL DEFAULT 18,
  -- Se suman zelle, pago_movil y otro para los pagos confirmados a mano.
  payment_method TEXT CHECK (payment_method IN ('paypal', 'apolopay', 'zelle', 'pago_movil', 'otro')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'expired')),
  apolopay_process_id TEXT,
  paypal_order_id TEXT,
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  currency TEXT NOT NULL DEFAULT 'usd' CHECK (currency IN ('usd', 'eur')),
  amount_eur REAL,
  -- Rastro de quien confirmo un pago a mano y por que. Sin esto no habria
  -- forma de auditar un ingreso que nadie pudo verificar automaticamente.
  marked_paid_by TEXT REFERENCES admins(id),
  marked_paid_at TEXT,
  marked_paid_note TEXT,
  -- Atribucion: de donde venia quien dejo sus datos.
  visitor_hash TEXT,
  country TEXT,
  referrer TEXT
);

INSERT INTO leads_nueva (
  id, name, email, whatsapp, amount_usd, payment_method, payment_status,
  apolopay_process_id, paypal_order_id, paid_at, created_at, updated_at,
  currency, amount_eur
)
SELECT
  id, name, email, whatsapp, amount_usd, payment_method, payment_status,
  apolopay_process_id, paypal_order_id, paid_at, created_at, updated_at,
  currency, amount_eur
FROM leads;

DROP TABLE leads;

ALTER TABLE leads_nueva RENAME TO leads;

-- Los indices se pierden con el DROP: hay que recrearlos todos.
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_apolopay_process_id ON leads(apolopay_process_id);
CREATE INDEX IF NOT EXISTS idx_leads_paypal_order_id ON leads(paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_leads_payment_status ON leads(payment_status);
CREATE INDEX IF NOT EXISTS idx_leads_currency ON leads(currency);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
