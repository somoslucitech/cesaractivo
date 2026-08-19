# 007 — Rotar el caret de la FAQ
Commit base: `d62c377`

## Oportunidad
`src/components/sections/Faq.tsx:110-114` intercambia dos componentes
distintos (`CaretUp` / `CaretDown`) de golpe. Rotar uno solo es más suave y
más barato que montar y desmontar iconos.

## Cambio
Dejar solo `CaretDown` envuelto en `motion.span`, con
`animate={{ rotate: isActive ? 180 : 0 }}` y
`transition={{ duration: shouldReduceMotion ? 0 : DUR.quick, ease: EASE_SIGNATURE }}`.
`shouldReduceMotion` ya existe en ese componente (línea 40).

Conservar el cambio de color: `text-azul-texto` activo, `text-tinta-suave`
inactivo. Retirar el import de `CaretUp` si queda sin uso.

## Verificación
Abrir y cerrar rápido: la rotación debe poder interrumpirse a mitad sin saltar.
