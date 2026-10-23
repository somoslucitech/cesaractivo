/** Numero de contacto de Cesar Activo, fuente unica para toda la landing. */
export const WHATSAPP_DISPLAY = "+58 414-8985299";

/** Formato que exige wa.me: solo digitos, con codigo de pais y sin el 0 inicial. */
export const WHATSAPP_NUMBER = "584148985299";

/**
 * Enlace al WhatsApp de UNA PERSONA concreta, para que el panel pueda
 * escribirle a quien dejo sus datos. Distinto de whatsappUrl(), que siempre
 * apunta al numero de Cesar.
 *
 * El numero se guarda tal cual lo escribio la persona ("+58 414-898 5299"),
 * asi que hay que reducirlo a digitos: wa.me no acepta espacios ni guiones.
 */
export function whatsappUrlDe(numero: string, message?: string): string {
  const digitos = numero.replace(/\D/g, "");
  const base = `https://wa.me/${digitos}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Medios que se cobran a mano: la web solo abre WhatsApp con el mensaje. */
export type MedioManual = "Pago Móvil" | "Zelle" | "Binance";

/**
 * Mensaje prellenado para los pagos que se coordinan por WhatsApp. Dice el
 * medio y que la persona viene de la web, para que el equipo sepa de entrada
 * como cobrarle y la busque en el panel (ya dejo sus datos en el formulario).
 */
export function pagoManualMessage(name: string, medio: MedioManual): string {
  return `Hola, soy ${name.trim()}, me registré en la web y quiero pagar el Detox5 por ${medio}`;
}

/** Los otros programas (Escuela de Alimentacion, Team Puro Power) no
 *  tienen checkout propio en la web: el interes se coordina por WhatsApp. */
export function otroServicioMessage(nombreServicio: string): string {
  return `Hola, quiero información sobre ${nombreServicio}`;
}
