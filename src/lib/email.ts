import { Resend } from "resend";
import type { Lead } from "./types";

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
  azulOscuro: "#003d73",
  amarillo: "#ffd700",
  crema: "#f5ede0",
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

export async function notifyCoachNewPaidLead(
  resendApiKey: string,
  params: { fromAddress: string; toAddress: string; lead: Lead },
) {
  const { lead, fromAddress, toAddress } = params;
  const methodLabel = lead.payment_method
    ? (PAYMENT_METHOD_LABEL[lead.payment_method] ?? lead.payment_method)
    : "desconocido";
  const montoLabel =
    lead.currency === "eur" && lead.amount_eur != null
      ? `€${lead.amount_eur}`
      : `$${lead.amount_usd}`;

  const filas = [
    filaDato("Nombre", lead.name),
    filaDato("Email", lead.email),
    filaDato("WhatsApp", lead.whatsapp),
    filaDato("Método de pago", methodLabel),
    filaDato("Monto", montoLabel),
    filaDato("Fecha de pago", lead.paid_at ?? "N/D"),
  ].join("");

  const resend = new Resend(resendApiKey);
  await resend.emails.send({
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
}
