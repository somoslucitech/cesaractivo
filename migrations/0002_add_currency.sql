-- Soporte de moneda (USD/EUR). No tocamos amount_usd: sigue siendo el
-- precio de referencia en dolares para todos los leads, se pagaron en la
-- moneda que se hayan pagado. amount_eur y currency registran que moneda
-- eligio el cliente y cuanto se le cobro realmente en esa moneda.
ALTER TABLE leads ADD COLUMN currency TEXT NOT NULL DEFAULT 'usd' CHECK (currency IN ('usd', 'eur'));
ALTER TABLE leads ADD COLUMN amount_eur REAL;

CREATE INDEX IF NOT EXISTS idx_leads_currency ON leads(currency);
