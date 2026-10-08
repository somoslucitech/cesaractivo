-- Eventos del embudo.
--
-- Hasta ahora la landing no registraba absolutamente nada: no habia forma de
-- saber cuanta gente entraba, cuanta abria el checkout ni donde se caia.
-- Esta tabla es la fuente de los tres primeros pasos del embudo del panel;
-- los dos ultimos (metodo de pago elegido y pago confirmado) salen de leads.
--
-- Va despues de 0004 a proposito: lead_id referencia leads, y 0004 hace un
-- DROP TABLE leads para reconstruirla. Si esta migracion fuera antes, la
-- clave foranea quedaria apuntando a una tabla que deja de existir.
--
-- Se eligio una tabla D1 y no Workers Analytics Engine: el volumen de una
-- landing de una sola pagina es bajo, asi los numeros son exactos (Analytics
-- Engine muestrea), el historial es permanente (alli son 3 meses) y no hacen
-- falta CF_ACCOUNT_ID ni CF_API_TOKEN.
--
-- NUNCA se guarda la IP. El visitante se identifica por visitor_hash, que es
-- un hash con sal de una cookie anonima: suficiente para contar unicos, pero
-- no reversible, asi que el registro no se convierte en un dato personal.
-- Pais, region y ciudad los resuelve Cloudflare en el borde.

CREATE TABLE events (
  id           TEXT PRIMARY KEY,
  -- page_view | checkout_open | lead_created
  -- Los pasos "eligio metodo de pago" y "pago" no son eventos: salen de la
  -- tabla leads, que ya es la fuente de verdad de ambos.
  type         TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  lead_id      TEXT REFERENCES leads(id),
  path         TEXT,
  referrer     TEXT,
  country      TEXT,
  region       TEXT,
  city         TEXT,
  device_kind  TEXT,
  -- JSON libre para lo que no merece columna propia (moneda, metodo elegido).
  meta         TEXT,
  created_at   INTEGER NOT NULL
);

-- El panel consulta casi siempre por tipo dentro de un rango de fechas.
CREATE INDEX idx_events_type_created ON events(type, created_at);
CREATE INDEX idx_events_visitor      ON events(visitor_hash);
CREATE INDEX idx_events_lead         ON events(lead_id);
