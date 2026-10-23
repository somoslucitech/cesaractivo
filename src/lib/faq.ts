/**
 * Preguntas frecuentes del Detox5. Viven aqui y no dentro del componente
 * porque las usan dos sitios: la seccion Faq de la landing y el JSON-LD
 * FAQPage, que tiene que decir exactamente lo mismo que la pagina (Google
 * penaliza el marcado que no coincide con el contenido visible).
 *
 * PRECIO es un marcador: la seccion lo sustituye por <PriceTag /> (moneda
 * elegida en el nav) y el JSON-LD por el precio en dolares.
 */
export const PRECIO = "{precio}";

export const FAQS: { question: string; answer: string }[] = [
  {
    question: "¿Cuánto cuesta y qué métodos de pago aceptan?",
    answer: `La fase diagnóstica del Plan Detox5 tiene una inversión única de ${PRECIO}. Puedes pagar con tarjeta internacional o PayPal, o por Pago Móvil, Zelle o Binance, que se coordinan directamente con César por WhatsApp.`,
  },
  {
    question: "¿Qué es el Plan Detox5?",
    answer:
      "Es un plan detox de 7 días basado en comida real, diseñado para mujeres de 40 a 70 años que quieren desinflamar su cuerpo y reiniciar su metabolismo. Incluye un diagnóstico metabólico inicial, la guía de alimentación con la lista de compras, una rutina corta de movilidad y acompañamiento diario por WhatsApp. No usa jugos, batidos ni suplementos.",
  },
  {
    question: "¿Qué voy a comer durante los 7 días?",
    answer:
      "Comida real y cotidiana, de la que consigues en tu mercado de siempre. Recibes la guía del método con las combinaciones que desinflaman y la lista de compras de la semana. Sin batidos, sin pastillas, sin platos raros y sin porciones de hambre.",
  },
  {
    question: "¿Debo comprar suplementos costosos o pasar hambre?",
    answer:
      "No. No vendemos pastillas ni batidos milagrosos. El método te enseña a comer comida real, sabrosa y accesible que consigues en cualquier supermercado.",
  },
  {
    question: "No tengo buena condición física, ¿puedo hacerlo a mis años?",
    answer:
      "Totalmente. El método está diseñado para mujeres entre 40 y 70 años, y el centro del plan es la alimentación, no el ejercicio. El movimiento que se suma es suave y se adapta a tu rango actual para proteger tus articulaciones.",
  },
  {
    question: "¿Cómo es el acompañamiento durante la semana?",
    answer:
      "Diario y por WhatsApp, de lunes a domingo. Ahí se supervisan tus hábitos y tu alimentación, y resuelves tus dudas con el coach de guardia. No necesitas asistir a ningún sitio: el Detox5 se hace completo desde donde estés.",
  },
];
