const APOLOPAY_PREORDER_URL =
  "https://pb-api.apolopay.app/payment-button/process/preorder";

export interface ApoloPayPreorderMetadata {
  orderId: string;
  customerEmail: string;
}

export async function createApoloPayPreorder(
  secretKey: string,
  amountUsd: number,
  metadata: ApoloPayPreorderMetadata,
): Promise<{ processId: string }> {
  const res = await fetch(APOLOPAY_PREORDER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-secret-key": secretKey,
    },
    body: JSON.stringify({ amount: amountUsd, metadata }),
  });

  if (!res.ok) {
    throw new Error(`ApoloPay preorder fallo: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as { processId: string };
}

/**
 * ApoloPay firma cada webhook con HMAC-SHA256 sobre el body crudo.
 * Hay que leer el body como texto ANTES de hacer JSON.parse, la firma
 * no coincide si se re-serializa el objeto parseado.
 */
export async function verifyApoloPaySignature(
  rawBody: string,
  signatureHeader: string | null,
  webhookSecret: string,
): Promise<boolean> {
  if (!signatureHeader) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(webhookSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(rawBody),
  );
  const computed = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return timingSafeEqual(computed, signatureHeader);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export interface ApoloPayWebhookEvent {
  event: string;
  processId: string;
  amount: number;
  metadata: ApoloPayPreorderMetadata;
  timestamp: string;
}
