import { Resend } from "resend";
import type { Lead } from "./types";
import { whatsappUrl, WHATSAPP_DISPLAY } from "./contact";
import { SITE_URL } from "./site";

/**
 * Envio de correo via Resend.
 *
 * Antes se usaba el binding nativo de Cloudflare Email Workers (env.EMAIL,
 * "send_email" en wrangler.jsonc), que exigia verificar el dominio dentro de
 * Cloudflare (`wrangler email sending enable`) antes del primer envio. El
 * cliente pidio Resend en su lugar. El SDK de Resend es solo fetch por
 * debajo, asi que corre igual de bien en el runtime de Workers; no hace
 * falta ningun paquete de Node.
 *
 * La verificacion de dominio ahora se hace en el panel de Resend, no en
 * Cloudflare: hay que anadir alli los registros DNS del dominio de envio
 * antes de que COACH_FROM_EMAIL pueda usarse de verdad.
 */

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  paypal: "PayPal",
  apolopay: "Criptomoneda (ApoloPay)",
  zelle: "Zelle",
  pago_movil: "Pago Móvil",
  otro: "Otro",
};

/**
 * Paleta identica a la de la pagina (src/app/globals.css, tema claro): los
 * correos no pueden leer variables CSS ni cargar las fuentes de Google Fonts
 * de forma fiable en todos los clientes, asi que los valores van literales y
 * la tipografia cae a serif/sans-serif del sistema en vez de Newsreader/Inter.
 */
const COLOR = {
  azul: "#005fa3",
  azulSuave: "#e6f0f8",
  azulOscuro: "#003d73",
  amarillo: "#ffd700",
  crema: "#f5ede0",
  amarilloClaro: "#fff8e1",
  textoOscuro: "#1c1c1c",
  blancoCalido: "#fffaf3",
  tinta: "#1c1c1c",
  tintaSuave: "#5c5c5c",
} as const;

function escaparHtml(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function filaDato(etiqueta: string, valor: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${COLOR.crema};font:600 13px/1.4 Arial,sans-serif;color:${COLOR.tintaSuave};width:150px;vertical-align:top;">
        ${escaparHtml(etiqueta)}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid ${COLOR.crema};font:400 14px/1.4 Arial,sans-serif;color:${COLOR.tinta};vertical-align:top;">
        ${escaparHtml(valor)}
      </td>
    </tr>`;
}

/**
 * Plantilla con la misma identidad visual de la landing: barra superior en
 * azul oscuro con acento amarillo (igual que el header de la pagina), tarjeta
 * clara sobre fondo crema. Tabla y estilos en linea a proposito: es lo que
 * garantiza que se vea igual en Gmail, Outlook y el resto de clientes, que
 * ignoran <style> y hojas de estilo externas con bastante frecuencia.
 */
function plantillaCorreo(opts: { titulo: string; filas: string; nota?: string }): string {
  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:${COLOR.crema};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR.crema};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${COLOR.blancoCalido};border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:${COLOR.azulOscuro};padding:24px 28px;">
                <span style="font:700 13px/1 Arial,sans-serif;color:${COLOR.blancoCalido};letter-spacing:0.16em;text-transform:uppercase;">
                  César Activo
                </span>
                <div style="margin-top:4px;width:32px;height:3px;background:${COLOR.amarillo};border-radius:2px;"></div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 18px;font:700 20px/1.3 Georgia,'Times New Roman',serif;color:${COLOR.azulOscuro};">
                  ${escaparHtml(opts.titulo)}
                </h1>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${opts.filas}
                </table>
                ${
                  opts.nota
                    ? `<p style="margin:20px 0 0;font:400 13px/1.5 Arial,sans-serif;color:${COLOR.tintaSuave};">${escaparHtml(opts.nota)}</p>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;background:${COLOR.crema};">
                <p style="margin:0;font:400 11px/1.4 Arial,sans-serif;color:${COLOR.tintaSuave};">
                  Plan Detox5 · Aviso automático, no responder a este correo.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function etiquetaMetodo(lead: Lead): string {
  return lead.payment_method
    ? (PAYMENT_METHOD_LABEL[lead.payment_method] ?? lead.payment_method)
    : "desconocido";
}

function etiquetaMonto(lead: Lead): string {
  return lead.currency === "eur" && lead.amount_eur != null
    ? `€${lead.amount_eur}`
    : `$${lead.amount_usd}`;
}

export async function notifyCoachNewPaidLead(
  resendApiKey: string,
  params: { fromAddress: string; toAddress: string; lead: Lead },
) {
  const { lead, fromAddress, toAddress } = params;
  const methodLabel = etiquetaMetodo(lead);
  const montoLabel = etiquetaMonto(lead);

  const filas = [
    filaDato("Nombre", lead.name),
    filaDato("Email", lead.email),
    filaDato("WhatsApp", lead.whatsapp),
    filaDato("Método de pago", methodLabel),
    filaDato("Monto", montoLabel),
    filaDato("Fecha de pago", lead.paid_at ?? "N/D"),
  ].join("");

  const resend = new Resend(resendApiKey);
  const { error } = await resend.emails.send({
    from: `César Activo <${fromAddress}>`,
    to: toAddress,
    subject: `Nuevo pago Detox5: ${lead.name}`,
    html: plantillaCorreo({
      titulo: "Nuevo pago confirmado — Plan Detox5",
      filas,
    }),
    text: [
      "Nuevo pago confirmado - Plan Detox5",
      `Nombre: ${lead.name}`,
      `Email: ${lead.email}`,
      `WhatsApp: ${lead.whatsapp}`,
      `Método de pago: ${methodLabel}`,
      `Monto: ${montoLabel}`,
      `Fecha de pago: ${lead.paid_at ?? "N/D"}`,
    ].join("\n"),
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}

/**
 * Pasos de "que pasa ahora". Son los mismos de /gracias (src/app/gracias):
 * la compradora lee lo mismo en la pagina y en su bandeja.
 */
const PASOS_COMPRA = [
  {
    titulo: "Te escribimos por WhatsApp",
    texto: `El equipo de César te contacta al número que registraste. Guarda ${WHATSAPP_DISPLAY} en tus contactos para que el mensaje no se te pierda.`,
  },
  {
    titulo: "Abrimos tu ficha C.A.D.D.",
    texto:
      "Tu diagnóstico metabólico inicial: peso, medidas y antecedentes de salud. Es el punto de partida contra el que vas a medir tus 7 días.",
  },
  {
    titulo: "Recibes la guía y entras al grupo",
    texto:
      "La guía de comida real, la lista de compras de la semana y el acceso al grupo de enfoque, donde está el acompañamiento diario.",
  },
];

/** "maria jose perez" -> "Maria". Para saludar como en un mensaje, no como en un formulario. */
function nombreDePila(nombre: string): string {
  const primero = nombre.trim().split(/\s+/)[0] ?? "";
  return primero.charAt(0).toUpperCase() + primero.slice(1).toLowerCase();
}

/**
 * Correo de agradecimiento a la compradora. Mismo lenguaje visual que la
 * landing: barra azul oscuro con acento amarillo, tarjeta clara sobre crema,
 * titulares en serif y el CTA amarillo con texto oscuro, igual que
 * "Iniciar mi Detox5". El tono sigue .agents/product-marketing.md: cercano,
 * en segunda persona y sin promesas medicas.
 */
export async function enviarAgradecimientoCompra(
  resendApiKey: string,
  params: { fromAddress: string; lead: Lead },
) {
  const { lead, fromAddress } = params;
  const nombre = nombreDePila(lead.name);
  const saludo = nombre ? `Gracias por tu compra, ${nombre}` : "Gracias por tu compra";
  const monto = etiquetaMonto(lead);
  const metodo = etiquetaMetodo(lead);
  const enlaceWhatsapp = whatsappUrl(
    `Hola, soy ${lead.name.trim()} y acabo de comprar el Plan Detox5. ¡Quiero empezar!`,
  );

  const pasos = PASOS_COMPRA.map(
    (paso, i) => `
      <tr>
        <td style="padding:0 0 18px;vertical-align:top;width:44px;">
          <div style="width:32px;height:32px;border-radius:10px;background:${COLOR.azulSuave};text-align:center;font:700 14px/32px Arial,sans-serif;color:${COLOR.azul};">${i + 1}</div>
        </td>
        <td style="padding:0 0 18px;vertical-align:top;">
          <p style="margin:0;font:700 16px/1.35 Georgia,'Times New Roman',serif;color:${COLOR.tinta};">${escaparHtml(paso.titulo)}</p>
          <p style="margin:4px 0 0;font:400 14px/1.55 Arial,sans-serif;color:${COLOR.tintaSuave};">${escaparHtml(paso.texto)}</p>
        </td>
      </tr>`,
  ).join("");

  const html = `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:${COLOR.crema};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Tu pago del Plan Detox5 está confirmado. Esto es lo que pasa ahora.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR.crema};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${COLOR.blancoCalido};border-radius:20px;overflow:hidden;">
            <tr>
              <td style="background:${COLOR.azulOscuro};padding:24px 32px;">
                <span style="font:700 13px/1 Arial,sans-serif;color:${COLOR.blancoCalido};letter-spacing:0.16em;text-transform:uppercase;">César Activo</span>
                <div style="margin-top:6px;width:32px;height:3px;background:${COLOR.amarillo};border-radius:2px;"></div>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px 8px;">
                <p style="margin:0;font:700 12px/1 Arial,sans-serif;letter-spacing:0.16em;text-transform:uppercase;color:${COLOR.azul};">Pago confirmado · Plan Detox5</p>
                <h1 style="margin:14px 0 0;font:700 28px/1.2 Georgia,'Times New Roman',serif;color:${COLOR.azulOscuro};">${escaparHtml(saludo)}</h1>
                <p style="margin:14px 0 0;font:700 18px/1.4 Georgia,'Times New Roman',serif;color:${COLOR.tinta};">Hoy diste el primer paso hacia tu cambio.</p>
                <p style="margin:14px 0 0;font:400 15px/1.6 Arial,sans-serif;color:${COLOR.tintaSuave};">
                  Decidir cuidarte ya es parte del proceso. Durante los próximos 7 días vas a desinflamar tu cuerpo comiendo comida real, sin pasar hambre y con acompañamiento todos los días. No vas a hacerlo sola: a partir de aquí te acompañamos.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR.amarilloClaro};border-radius:14px;">
                  <tr>
                    <td style="padding:18px 20px;">
                      <p style="margin:0;font:700 12px/1 Arial,sans-serif;letter-spacing:0.12em;text-transform:uppercase;color:${COLOR.tintaSuave};">Tu compra</p>
                      <p style="margin:8px 0 0;font:700 17px/1.3 Georgia,'Times New Roman',serif;color:${COLOR.tinta};">Plan Detox5 · 7 días de comida real</p>
                      <p style="margin:4px 0 0;font:400 14px/1.5 Arial,sans-serif;color:${COLOR.tintaSuave};">${escaparHtml(monto)} · Pago único · ${escaparHtml(metodo)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px 6px;">
                <h2 style="margin:0 0 18px;font:700 20px/1.3 Georgia,'Times New Roman',serif;color:${COLOR.tinta};">Qué pasa ahora</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${pasos}</table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:6px 32px 8px;">
                <a href="${enlaceWhatsapp}" style="display:inline-block;background:${COLOR.amarillo};color:${COLOR.textoOscuro};font:700 16px/1 Arial,sans-serif;text-decoration:none;padding:16px 32px;border-radius:999px;">Escribir por WhatsApp</a>
                <p style="margin:14px 0 0;font:400 13px/1.5 Arial,sans-serif;color:${COLOR.tintaSuave};">Si pasan más de 24 horas sin que te escribamos, escríbenos tú al ${escaparHtml(WHATSAPP_DISPLAY)}.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 32px;">
                <p style="margin:0;font:400 15px/1.6 Arial,sans-serif;color:${COLOR.tinta};">Nos vemos dentro,</p>
                <p style="margin:2px 0 0;font:700 16px/1.4 Georgia,'Times New Roman',serif;color:${COLOR.azulOscuro};">César Villegas</p>
                <p style="margin:0;font:400 13px/1.4 Arial,sans-serif;color:${COLOR.tintaSuave};">Coach de bienestar · César Activo</p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;background:${COLOR.crema};">
                <p style="margin:0;font:400 11px/1.5 Arial,sans-serif;color:${COLOR.tintaSuave};">
                  El Plan Detox5 es un acompañamiento nutricional y no sustituye la indicación de tu médico: no suspendas ni modifiques ningún tratamiento sin consultarlo con él.
                </p>
                <p style="margin:8px 0 0;font:400 11px/1.5 Arial,sans-serif;color:${COLOR.tintaSuave};">
                  Recibes este correo porque compraste el Plan Detox5 en cesaractivo.com ·
                  <a href="${SITE_URL}/privacidad" style="color:${COLOR.tintaSuave};">Privacidad</a> ·
                  <a href="${SITE_URL}/terminos" style="color:${COLOR.tintaSuave};">Términos</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    saludo,
    "Hoy diste el primer paso hacia tu cambio.",
    "",
    "Decidir cuidarte ya es parte del proceso. Durante los próximos 7 días vas a desinflamar tu cuerpo comiendo comida real, sin pasar hambre y con acompañamiento todos los días.",
    "",
    `Tu compra: Plan Detox5 · ${monto} · Pago único · ${metodo}`,
    "",
    "Qué pasa ahora:",
    ...PASOS_COMPRA.map((p, i) => `${i + 1}. ${p.titulo}: ${p.texto}`),
    "",
    `Escríbenos por WhatsApp: ${enlaceWhatsapp}`,
    "",
    "Nos vemos dentro,",
    "César Villegas, coach de bienestar",
  ].join("\n");

  const resend = new Resend(resendApiKey);
  const { error } = await resend.emails.send({
    from: `César Activo <${fromAddress}>`,
    to: lead.email,
    subject: nombre
      ? `¡Gracias, ${nombre}! Diste el primer paso hacia tu cambio`
      : "¡Gracias! Diste el primer paso hacia tu cambio",
    html,
    text,
  });
  // El SDK de Resend no lanza: devuelve { error }. Sin esto un dominio sin
  // verificar fallaria en silencio.
  if (error) throw new Error(`Resend: ${error.message}`);
}
