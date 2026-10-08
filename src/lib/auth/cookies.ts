/**
 * Cookies firmadas con HMAC-SHA256 usando SESSION_SECRET. Se usan para el
 * `state`/`code_verifier` de OAuth (corta vida) y para la cookie de sesion
 * del admin (7 dias). Firmar evita que alguien falsifique un admin_id o un
 * session_id sin conocer el secreto del Worker.
 */

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signValue(value: string, secret: string): Promise<string> {
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  const sigHex = Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
  return `${value}.${sigHex}`;
}

export async function verifySignedValue(signed: string, secret: string): Promise<string | null> {
  const idx = signed.lastIndexOf(".");
  if (idx === -1) return null;
  const value = signed.slice(0, idx);
  const sigHex = signed.slice(idx + 1);
  const expected = await signValue(value, secret);
  const expectedSigHex = expected.slice(expected.lastIndexOf(".") + 1);
  if (sigHex.length !== expectedSigHex.length) return null;
  // Comparacion en tiempo constante: salir en la primera diferencia filtraria
  // informacion sobre la firma esperada a traves del tiempo de respuesta.
  let diff = 0;
  for (let i = 0; i < sigHex.length; i++) diff |= sigHex.charCodeAt(i) ^ expectedSigHex.charCodeAt(i);
  return diff === 0 ? value : null;
}
