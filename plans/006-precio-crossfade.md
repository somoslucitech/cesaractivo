# 006 — Transición al cambiar de moneda
Commit base: `d62c377`

## Oportunidad
`src/components/checkout/PriceTag.tsx` devuelve texto plano. Al pulsar
USD/EUR el precio salta de golpe. Es el cambio de estado más brusco que queda
en la página y ocurre justo en el momento de compra.

## Cambio
Convertirlo en un crossfade corto con `AnimatePresence mode="wait"` keyed por
moneda. Usar `DUR.stepIn`/`DUR.stepOut` (0.28 / 0.16) y `EASE_SIGNATURE`
/ `EASE_EXIT`, que ya son los tokens de crossfade del proyecto.

Debe seguir siendo un `<span>` en línea: se renderiza dentro de `<p>` en
ProductOffer y en Faq.

Respetar `useReducedMotion`: si está activo, devolver el texto sin animar.

## Verificación
Alternar USD/EUR varias veces seguidas: no debe encolarse ni parpadear.
