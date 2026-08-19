# 001 — Tokens de duración en CSS
Commit base: `d62c377`

## Problema
`src/lib/motion.ts` afirma en su docstring: *"Los mismos valores existen como
custom properties en globals.css"*. Es falso para las duraciones: en
`src/app/globals.css` solo existen `--ease-signature` y `--ease-exit`
(líneas 151-152). No hay ningún token de duración, así que las 14 transiciones
CSS del proyecto hardcodean `duration-150` y `duration-200`.

## Cambio
En `src/app/globals.css`, justo después de la línea 152, dentro del mismo
bloque, añadir:

```css
  /* Espejo de DUR en src/lib/motion.ts. Tailwind v4 no tiene namespace de
     duracion, asi que se consumen como duration-[var(--dur-hover)]. */
  --dur-hover: 90ms;
  --dur-press: 140ms;
  --dur-settle: 240ms;
```

Valores tomados de `DUR.hover = 0.09`, `DUR.press = 0.14`,
`DUR.settle = 0.24`. No aproximar.

## Fuera de alcance
No tocar componentes en este plan. Solo declarar los tokens.

## Verificación
`npm run build` y comprobar en el navegador que
`getComputedStyle(document.documentElement).getPropertyValue('--dur-hover')`
devuelve ` 90ms`.
