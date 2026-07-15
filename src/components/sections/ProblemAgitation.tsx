"use client";

import { motion, useReducedMotion } from "motion/react";
import { HeartStraight } from "@phosphor-icons/react/dist/ssr";

const PAIN_POINTS = [
  "Despertar cansada, salir cansada y regresar a casa cansada.",
  "Inflamación abdominal, incluso tomando solo agua.",
  "Hacer ejercicio sin ver cambios significativos.",
  "Frustración por el efecto rebote.",
  "Depender de medicamentos para la hipertensión y la diabetes.",
];

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function ProblemAgitation() {
  const shouldReduceMotion = useReducedMotion();
  const desireDelay = 0.2 + PAIN_POINTS.length * 0.1 + 0.15;

  return (
    <section className="bg-crema/50 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.h2
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="max-w-2xl font-display text-3xl text-texto-oscuro md:text-4xl"
        >
          ¿Sientes que por más ejercicio que haces, tu cuerpo simplemente no responde?
        </motion.h2>
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.08, ease: EASE_OUT }}
          className="mt-4 max-w-2xl text-base text-texto-medio sm:text-lg"
        >
          Con los años las reglas del juego cambian. El estrés, los desarreglos hormonales y
          las dietas restrictivas bloquean tu diseño biológico. No es falta de fuerza de
          voluntad, es un organismo inflamado.
        </motion.p>

        <ul className="mt-10 flex flex-col border-t border-texto-oscuro/10">
          {PAIN_POINTS.map((text, index) => {
            const rowDelay = 0.2 + index * 0.1;
            return (
              <motion.li
                key={text}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: rowDelay, ease: EASE_OUT }}
                className="flex items-start gap-4 border-b border-texto-oscuro/10 py-6"
              >
                <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-azul" />
                <p className="font-display text-xl leading-snug text-texto-oscuro sm:text-2xl">
                  {text}
                </p>
              </motion.li>
            );
          })}
        </ul>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, delay: desireDelay, ease: EASE_OUT }}
          className="mt-8 text-sm text-texto-medio"
        >
          Y en el fondo:
        </motion.p>
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: desireDelay + 0.1, ease: EASE_OUT }}
          className="mt-3 flex items-center gap-4 rounded-2xl border-l-4 border-amarillo bg-amarillo-claro px-6 py-5"
        >
          <motion.span
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              delay: desireDelay + 0.3,
              type: "spring",
              stiffness: 300,
              damping: 14,
            }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amarillo"
          >
            <HeartStraight size={24} weight="duotone" className="text-texto-oscuro" />
          </motion.span>
          <p className="font-display text-lg text-texto-oscuro sm:text-xl">
            Una vejez saludable, con movilidad para disfrutar a tu familia.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
