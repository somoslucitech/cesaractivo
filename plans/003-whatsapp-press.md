# 003 — Hover y press de la burbuja de WhatsApp
Commit base: `d62c377` · Depende de: 001

## Problema
`src/components/layout/WhatsappBubble.tsx:16` aplica `duration-200` a
`hover:scale-105 active:scale-95`. Es el CTA fijo siempre visible: el press a
200 ms se siente pastoso. El token de press del proyecto es 140 ms.

## Cambio
En el className, sustituir `duration-200` por:
```
duration-[var(--dur-hover)] active:duration-[var(--dur-press)]
```
Mantener `ease-signature` y el resto de clases sin tocar.

## Verificación
Mantener pulsado en un móvil real: el hundido debe responder al instante y
soltar sin arrastre.
