/** Numero de contacto de Cesar Activo, fuente unica para toda la landing. */
export const WHATSAPP_DISPLAY = "+58 414-8985299";

/** Formato que exige wa.me: solo digitos, con codigo de pais y sin el 0 inicial. */
export const WHATSAPP_NUMBER = "584148985299";

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function pagoMovilMessage(name: string): string {
  const cleanName = name.trim();
  return `Hola mi nombre es ${cleanName}, estoy interesad@ en el plan Detox5`;
}

/** Zelle se coordina a mano por WhatsApp, igual que Pago Movil: no hay
 *  procesamiento en la web, solo se arma el mensaje de contacto. */
export function zelleMessage(name: string): string {
  const cleanName = name.trim();
  return `Hola mi nombre es ${cleanName}, quiero pagar el plan Detox5 por Zelle`;
}

/** Los otros programas (Escuela de Alimentacion, Team Puro Power) no
 *  tienen checkout propio en la web: el interes se coordina por WhatsApp. */
export function otroServicioMessage(nombreServicio: string): string {
  return `Hola, quiero información sobre ${nombreServicio}`;
}
