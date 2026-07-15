import type { Lead } from "./types";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  paypal: "PayPal",
  apolopay: "ApoloPay (cripto)",
};

export async function notifyCoachNewPaidLead(
  email: SendEmail,
  params: { fromAddress: string; toAddress: string; lead: Lead },
) {
  const { lead, fromAddress, toAddress } = params;
  const methodLabel = lead.payment_method
    ? (PAYMENT_METHOD_LABEL[lead.payment_method] ?? lead.payment_method)
    : "desconocido";

  await email.send({
    to: toAddress,
    from: { email: fromAddress, name: "César Activo - Web" },
    subject: `Nuevo pago Detox5: ${lead.name}`,
    html: `
      <h1>Nuevo pago confirmado - Plan Detox5</h1>
      <p><strong>Nombre:</strong> ${lead.name}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>WhatsApp:</strong> ${lead.whatsapp}</p>
      <p><strong>Método de pago:</strong> ${methodLabel}</p>
      <p><strong>Monto:</strong> $${lead.amount_usd}</p>
      <p><strong>Fecha de pago:</strong> ${lead.paid_at ?? "N/D"}</p>
    `,
    text: [
      "Nuevo pago confirmado - Plan Detox5",
      `Nombre: ${lead.name}`,
      `Email: ${lead.email}`,
      `WhatsApp: ${lead.whatsapp}`,
      `Método de pago: ${methodLabel}`,
      `Monto: $${lead.amount_usd}`,
      `Fecha de pago: ${lead.paid_at ?? "N/D"}`,
    ].join("\n"),
  });
}
