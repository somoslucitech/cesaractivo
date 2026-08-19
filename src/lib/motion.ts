/**
 * IDENTIDAD DE MOVIMIENTO DE LA MARCA
 *
 * Fuente unica de curvas y duraciones para todo lo que se mueve en la
 * landing, del mismo modo que globals.css es la fuente unica de color.
 * Antes habia cuatro curvas distintas repartidas por los componentes
 * (dos constantes EASE_OUT duplicadas, una curva suelta en el modal y un
 * spring) y los tokens de easing de globals.css no los usaba nadie.
 *
 * Personalidad: PREMIUM con acentos ENERGETIC.
 *   - Premium (90%): elegante, sin overshoot, entrada fade + subida corta.
 *     Es lo que pide la copy (confianza medica, no gimnasio agresivo) y el
 *     publico del producto, mujeres de 40 a 70.
 *   - Energetic (10%): SOLO en el CTA y en el paso de exito del checkout,
 *     los dos momentos donde el movimiento tiene que empujar y celebrar.
 *
 * Los mismos valores existen como custom properties en globals.css para lo
 * que se anima con transiciones CSS. Si cambias uno, cambia el otro.
 */

/** Curva firma: MD3 standard. Cubre el 90% de las animaciones. */
export const EASE_SIGNATURE: [number, number, number, number] = [0.4, 0, 0.2, 1];

/** Salidas: acelera al irse (MD3 accelerate). Nunca para entradas. */
export const EASE_EXIT: [number, number, number, number] = [0.3, 0, 1, 1];

/**
 * Paleta de duraciones en segundos, que es la unidad de motion/react.
 * Los tres primeros tiers son la escala Premium del skill; el resto son
 * duraciones de un tipo de elemento concreto y no se usan como tier.
 */
export const DUR = {
  /** Premium quick: elementos ligeros, iconos, follow-through. */
  quick: 0.35,
  /** Premium standard: entradas por scroll, tarjetas, secciones. */
  standard: 0.5,
  /** Premium slow: revelados dramaticos. Usar con cuidado. */
  slow: 0.8,

  /** Backdrop del modal. El panel entra despues, no a la vez. */
  backdrop: 0.2,
  /** Panel del modal. El skill pide 300-400ms para cambios de foco. */
  modalIn: 0.38,
  /** Salida del modal: ~30% mas corta que la entrada, como pide el skill. */
  modalOut: 0.26,
  /** Crossfade entre pasos del checkout. */
  stepIn: 0.28,
  stepOut: 0.16,

  /** Acento Energetic: respuesta al hover. El skill exige <100ms. */
  hover: 0.09,
  /** Acento Energetic: presion del boton. <150ms. */
  press: 0.14,
  /** Acento Energetic: asentamiento al soltar. 200-300ms. */
  settle: 0.24,
} as const;

/**
 * Delta entre hermanos de una entrada escalonada.
 * El skill fija un techo duro de 500ms para el stagger total: con 0.08s
 * aguantamos hasta 6 elementos (0.4s) sin pasarnos. Si una seccion llega a
 * mas, hay que agrupar en lugar de subir el delta.
 */
export const STAGGER = 0.08;

/**
 * Retardo de un elemento secundario respecto al principal (la foto que
 * acompana a un bloque de texto, el icono dentro de una tarjeta).
 * El checklist del skill pide 50-150ms de follow-through.
 */
export const FOLLOW_THROUGH = 0.1;

/** Entrada Premium compartida: opacity + una sola propiedad de posicion. */
export const REVEAL_VARIANTS = {
  hidden: (y: number) => ({ opacity: 0, y }),
  visible: { opacity: 1, y: 0 },
} as const;
