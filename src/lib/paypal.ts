const PAYPAL_API_BASE = {
  sandbox: "https://api-m.sandbox.paypal.com",
  live: "https://api-m.paypal.com",
} as const;

export interface PaypalCredentials {
  clientId: string;
  clientSecret: string;
  environment: "sandbox" | "live";
}

async function getAccessToken(creds: PaypalCredentials): Promise<string> {
  const basicAuth = btoa(`${creds.clientId}:${creds.clientSecret}`);
  const res = await fetch(`${PAYPAL_API_BASE[creds.environment]}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`PayPal OAuth falló: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function createPaypalOrder(
  creds: PaypalCredentials,
  amountUsd: number,
  leadId: string,
): Promise<{ orderId: string }> {
  const accessToken = await getAccessToken(creds);

  const res = await fetch(`${PAYPAL_API_BASE[creds.environment]}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: leadId,
          description: "Plan Detox5 - César Activo",
          amount: {
            currency_code: "USD",
            value: amountUsd.toFixed(2),
          },
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`PayPal create order falló: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { id: string };
  return { orderId: data.id };
}

export async function capturePaypalOrder(creds: PaypalCredentials, orderId: string) {
  const accessToken = await getAccessToken(creds);

  const res = await fetch(
    `${PAYPAL_API_BASE[creds.environment]}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error(`PayPal capture falló: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as { id: string; status: string };
}

export interface PaypalWebhookHeaders {
  transmissionId: string;
  transmissionTime: string;
  certUrl: string;
  authAlgo: string;
  transmissionSig: string;
}

export async function verifyPaypalWebhookSignature(
  creds: PaypalCredentials,
  webhookId: string,
  headers: PaypalWebhookHeaders,
  webhookEvent: unknown,
): Promise<boolean> {
  const accessToken = await getAccessToken(creds);

  const res = await fetch(
    `${PAYPAL_API_BASE[creds.environment]}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transmission_id: headers.transmissionId,
        transmission_time: headers.transmissionTime,
        cert_url: headers.certUrl,
        auth_algo: headers.authAlgo,
        transmission_sig: headers.transmissionSig,
        webhook_id: webhookId,
        webhook_event: webhookEvent,
      }),
    },
  );

  if (!res.ok) return false;

  const data = (await res.json()) as { verification_status: string };
  return data.verification_status === "SUCCESS";
}
