# 005 — prefers-reduced-motion en el Nav
Commit base: `d62c377`

## Problema
`src/components/layout/Nav.tsx` es el único componente con motion/react que
**no** usa `useReducedMotion`. Los otros diez sí. El bloque global de
`globals.css:174` no lo cubre: solo afecta a `animation-duration` y
`transition-duration` de CSS, y motion/react anima por JS.

## Cambio
1. Importar el hook: `import { AnimatePresence, motion, useReducedMotion } from "motion/react";`
2. Dentro del componente: `const shouldReduceMotion = useReducedMotion();`
3. En el `<motion.div id="menu-mobile">`, sustituir la transición por:
```tsx
transition={{ duration: shouldReduceMotion ? 0 : DUR.backdrop, ease: EASE_SIGNATURE }}
```
Mismo patrón que ya usa `src/components/sections/Faq.tsx:123`.

## Verificación
Activar "reducir movimiento" en el SO y abrir el menú móvil: debe aparecer sin
desplazamiento vertical.
