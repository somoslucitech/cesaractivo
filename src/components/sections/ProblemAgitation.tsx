"use client";

import { motion, useReducedMotion } from "motion/react";
import { HeartStraight } from "@phosphor-icons/react/dist/ssr";
import { DUR, EASE_SIGNATURE, FOLLOW_THROUGH, STAGGER } from "@/lib/motion";

const PAIN_POINTS = [
  "Despertar cansada, salir cansada y regresar a casa cansada.",
  "Inflamación abdominal, incluso tomando solo agua.",
  "Hacer ejercicio sin ver cambios significativos.",
  "Frustración por el efecto rebote.",
  "Depender de medicamentos para la hipertensión y la diabetes.",
];

/**
 * Contenedor del listado: dispara la entrada UNA vez (el propio ul) y
 * reparte el stagger entre los hijos con staggerChildren. Antes cada <li>
 * tenia su propio whileInView + un delay acumulado a mano (index * 0.1),
 * asi que el ultimo punto esperaba 1.15s desde que entraba en pantalla y,
 * si el scroll era lento, el trigger de cada item disparaba en momentos
 * distintos en vez de un solo gesto coordinado. Con staggerChildren el
 * presupuesto total queda acotado (5 items * 0.08s = 0.4s, bajo el techo
 * de 500ms) y todos comparten el mismo trigger.
 */
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.standard, ease: EASE_SIGNATURE } },
};

export function ProblemAgitation() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-superficie-2 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.h2
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: DUR.standard, ease: EASE_SIGNATURE }}
          className="max-w-2xl font-display text-3xl text-tinta md:text-4xl"
        >
          ¿Sientes que por más ejercicio que haces, tu cuerpo simplemente no responde?
        </motion.h2>
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: DUR.standard, delay: STAGGER, ease: EASE_SIGNATURE }}
          className="mt-4 max-w-2xl text-base text-tinta-suave sm:text-lg"
        >
          Con los años las reglas del juego cambian. El estrés, los desarreglos hormonales y
          las dietas restrictivas bloquean tu diseño biológico. No es falta de fuerza de
          voluntad, es un organismo inflamado.
        </motion.p>

        <motion.ul
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={listVariants}
          className="mt-10 flex flex-col border-t border-linea"
        >
          {PAIN_POINTS.map((text) => (
            <motion.li
              key={text}
              variants={itemVariants}
              className="flex items-start gap-4 border-b border-linea py-6"
            >
              <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-azul" />
              <p className="font-display text-xl leading-snug text-tinta sm:text-2xl">
                {text}
              </p>
            </motion.li>
          ))}
        </motion.ul>

        {/* Bloque de resolucion: gesto propio con trigger independiente,
            no delays acumulados sobre el listado de arriba. El corazon
            llega como follow-through (offset FOLLOW_THROUGH) del bloque,
            sin overshoot: aqui la identidad es Premium, no Energetic. */}
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: DUR.quick, ease: EASE_SIGNATURE }}
          className="mt-8 text-sm text-tinta-suave"
        >
          Y en el fondo:
        </motion.p>
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: DUR.standard, delay: STAGGER, ease: EASE_SIGNATURE }}
          className="mt-3 flex items-center gap-4 rounded-2xl border-l-4 border-amarillo bg-tinte-amarillo px-6 py-5"
        >
          <motion.span
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: DUR.quick, delay: STAGGER + FOLLOW_THROUGH, ease: EASE_SIGNATURE }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amarillo"
          >
            <HeartStraight size={24} weight="duotone" className="text-texto-oscuro" />
          </motion.span>
          <p className="font-display text-lg text-tinta sm:text-xl">
            Una vejez saludable, con movilidad para disfrutar a tu familia.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
