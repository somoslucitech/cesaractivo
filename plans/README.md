# Planes de animación — Detox5

Auditoría con `improve-animations` sobre el commit `d62c377`.

Diagnóstico de fondo: el sistema de movimiento (`src/lib/motion.ts`) está bien
construido y es fuente única, pero **el CSS no lo obedece**: las transiciones
Tailwind hardcodean 150/200 ms mientras el token dice 90 ms para hover.

## Orden de ejecución

| # | Plan | Depende de | Estado |
|---|---|---|---|
| 001 | tokens-duracion-css | — | APLICADO |
| 002 | hover-tarjetas-plan | 001 | APLICADO |
| 003 | whatsapp-press | 001 | APLICADO |
| 004 | cta-press-token | — | APLICADO |
| 005 | nav-reduced-motion | — | APLICADO |
| 006 | precio-crossfade | — | APLICADO |
| 007 | caret-rotacion | — | APLICADO |

001 va primero: crea los tokens que 002 y 003 consumen.
