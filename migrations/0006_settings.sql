-- Ajustes editables desde el panel.
--
-- Hasta ahora el precio vivia como constante en src/lib/pricing.ts: cambiarlo
-- exigia tocar codigo y desplegar. Ahora vive aqui y el panel lo edita.
--
-- Todos los valores se guardan como TEXT y se interpretan al leerlos. Es la
-- forma habitual de una tabla clave/valor y evita tener que migrar el esquema
-- cada vez que aparece un ajuste nuevo. Cadena vacia = sin definir.
--
-- Las fechas de la oferta se guardan en ISO-8601 UTC, igual que leads, para
-- poder compararlas con strftime sin conversiones.

CREATE TABLE settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  updated_by TEXT REFERENCES admins(id)
);

INSERT INTO settings (key, value, updated_at) VALUES
  -- Precio normal en dolares. Se acabo el soporte de euros: el cliente pidio
  -- dejar solo USD para simplificar el cobro.
  ('precio_usd',        '18', unixepoch() * 1000),
  -- Oferta. Si oferta_precio_usd esta vacio no hay oferta activa, pase lo que
  -- pase con las fechas.
  ('oferta_precio_usd', '',   unixepoch() * 1000),
  -- Ambas opcionales: sin inicio la oferta vale desde ya, sin fin no caduca.
  ('oferta_inicio',     '',   unixepoch() * 1000),
  ('oferta_fin',        '',   unixepoch() * 1000);
