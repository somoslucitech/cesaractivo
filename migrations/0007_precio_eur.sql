-- Vuelve el euro, con reglas distintas a las de antes.
--
-- El cliente lo habia retirado para simplificar el cobro y lo recupera ahora.
-- La diferencia: los metodos de pago ya no son los mismos en cada moneda.
--   USD -> PayPal, criptomoneda (ApoloPay) y WhatsApp (Zelle / Pago Movil)
--   EUR -> PayPal y WhatsApp
-- ApoloPay queda fuera del euro porque solo liquida en dolares.
--
-- La ventana de la oferta (oferta_inicio / oferta_fin) es COMPARTIDA por las
-- dos monedas: es una sola promocion con dos precios, no dos promociones
-- independientes. Si una moneda no tiene precio de oferta, esa moneda no
-- tiene oferta aunque la ventana este abierta.

INSERT INTO settings (key, value, updated_at) VALUES
  ('precio_eur',        '17', unixepoch() * 1000),
  ('oferta_precio_eur', '',   unixepoch() * 1000)
ON CONFLICT(key) DO NOTHING;
