# 004 — Separar press de hover en el CTA
Commit base: `d62c377`

## Problema
`src/components/checkout/CtaButton.tsx:37-39` declara `whileHover` y
`whileTap` compartiendo una única `transition` de `DUR.hover` (90 ms). El
token `DUR.press` (0.14) está definido y documentado en motion.ts pero
**no se usa en ningún punto del proyecto**.

## Código actual
```tsx
      whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -1 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96, y: 0 }}
      transition={{ duration: DUR.hover, ease: EASE_SIGNATURE }}
```

## Cambio
```tsx
      whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -1 }}
      whileTap={
        shouldReduceMotion
          ? undefined
          : { scale: 0.96, y: 0, transition: { duration: DUR.press, ease: EASE_SIGNATURE } }
      }
      transition={{ duration: DUR.hover, ease: EASE_SIGNATURE }}
```
El `transition` dentro de `whileTap` sobrescribe solo esa variante.

## Verificación
El hover sigue en 90 ms; la pulsación debe asentar algo más lenta, sin rebote.
