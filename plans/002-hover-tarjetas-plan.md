# 002 — Hover de las tarjetas del plan a 90 ms
Commit base: `d62c377`
Depende de: 001

## Problema
`src/components/sections/ProductOffer.tsx:102` usa `duration-200` para el
`hover:-translate-y-1` de las 6 tarjetas de inclusiones. El token del proyecto
es `DUR.hover = 0.09` (90 ms) y su comentario dice literalmente *"El skill
exige <100ms"*. 200 ms es más del doble del presupuesto propio.

## Código actual (línea 102)
El className de la tarjeta contiene, entre otras clases:

    transition-transform duration-200 ease-signature hover:-translate-y-1

## Cambio
Sustituir `duration-200` por `duration-[var(--dur-hover)]`. Nada más.
No tocar `ease-signature`, ni la sombra, ni `hover:-translate-y-1`.

## Verificación
Pasar el ratón por una tarjeta: el levantamiento debe sentirse inmediato.
Feel-check en cámara lenta (DevTools > Rendering > 25% speed).
