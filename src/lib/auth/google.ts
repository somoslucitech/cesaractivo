/**
 * OAuth 2.0 con Google implementado a mano, sin SDK.
 *
 * El panel es el unico punto del sistema con inicio de sesion, y el bundle
 * del Worker tiene un limite de 3 MiB: meter NextAuth o un SDK completo por
 * una sola pantalla de login no sale a cuenta. Esto son ~170 lineas y usa
 * solo WebCrypto, que ya esta en el runtime.
 *
 * Flujo: authorization code + PKCE. El `state` y el `code_verifier` viajan en
 * una cookie firmada de corta vida y se validan en el callback.
 */

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export type GoogleTokenResponse = {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
};

export type GoogleIdTokenPayload = {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
};

function base64UrlEncode(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function generatePkcePair(): { verifier: string; challengeAsync: Promise<string> } {
  const verifier = base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)));
  const challengeAsync = crypto.subtle
    .digest("SHA-256", new TextEncoder().encode(verifier))
    .then((buf) => base64UrlEncode(new Uint8Array(buf)));
  return { verifier, challengeAsync };
}

export function generateState(): string {
  return base64UrlEncode(crypto.getRandomValues(new Uint8Array(24)));
}

export function buildGoogleAuthUrl(opts: {
  clientId: string;
  redirectUri: string;
  state: string;
  codeChallenge: string;
}): string {
  const params = new URLSearchParams({
    client_id: opts.clientId,
    redirect_uri: opts.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state: opts.state,
    code_challenge: opts.codeChallenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForTokens(opts: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  codeVerifier: string;
}): Promise<GoogleTokenResponse> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: opts.code,
      client_id: opts.clientId,
      client_secret: opts.clientSecret,
      redirect_uri: opts.redirectUri,
      grant_type: "authorization_code",
      code_verifier: opts.codeVerifier,
    }),
  });
  if (!res.ok) {
    throw new Error(`Google token exchange failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

/**
 * Decodifica y valida el id_token de Google: firma contra el JWKS, issuer,
 * audience y expiracion. Nunca confiar en el payload sin esta validacion: sin
 * verificar la firma, cualquiera podria fabricar un token con el correo del
 * dueno y entrar al panel.
 */
export async function verifyGoogleIdToken(
  idToken: string,
  clientId: string,
): Promise<GoogleIdTokenPayload> {
  const [headerB64, payloadB64, signatureB64] = idToken.split(".");
  if (!headerB64 || !payloadB64 || !signatureB64) throw new Error("id_token malformado");

  const header = JSON.parse(atob(headerB64.replace(/-/g, "+").replace(/_/g, "/")));
  const payload = JSON.parse(
    decodeURIComponent(
      Array.from(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")))
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    ),
  );

  const jwksRes = await fetch("https://www.googleapis.com/oauth2/v3/certs");
  const jwks = (await jwksRes.json()) as { keys: (JsonWebKey & { kid?: string })[] };
  const jwk = jwks.keys.find((k) => k.kid === header.kid);
  if (!jwk) throw new Error("No se encontro la clave publica de Google (kid)");

  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const signedData = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signature = Uint8Array.from(
    atob(signatureB64.replace(/-/g, "+").replace(/_/g, "/")),
    (c) => c.charCodeAt(0),
  );
  const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, signature, signedData);
  if (!valid) throw new Error("Firma de id_token invalida");

  if (payload.iss !== "https://accounts.google.com" && payload.iss !== "accounts.google.com") {
    throw new Error("Issuer de id_token invalido");
  }
  if (payload.aud !== clientId) throw new Error("Audience de id_token invalido");
  if (payload.exp * 1000 < Date.now()) throw new Error("id_token expirado");

  return {
    sub: payload.sub,
    email: payload.email,
    email_verified: payload.email_verified,
    name: payload.name,
    picture: payload.picture,
  };
}
