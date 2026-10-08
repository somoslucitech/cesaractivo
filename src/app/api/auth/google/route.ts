import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { cf } from "@/lib/cloudflare";
import { buildGoogleAuthUrl, generatePkcePair, generateState } from "@/lib/auth/google";
import { signValue } from "@/lib/auth/cookies";

const OAUTH_COOKIE = "ca_oauth";

/** Arranca el flujo de OAuth: genera state + PKCE y redirige a Google. */
export async function GET(req: NextRequest) {
  const { env } = await cf();
  const state = generateState();
  const { verifier, challengeAsync } = generatePkcePair();
  const challenge = await challengeAsync;

  const redirectUri = new URL(`/api/auth/callback`, req.nextUrl.origin).toString();
  const authUrl = buildGoogleAuthUrl({
    clientId: env.GOOGLE_CLIENT_ID,
    redirectUri,
    state,
    codeChallenge: challenge,
  });

  // El state y el verifier viajan firmados en una cookie de 10 minutos: no se
  // pueden guardar en el servidor porque el Worker no tiene estado entre
  // peticiones, y sin firmar cualquiera podria falsificarlos.
  const payload = JSON.stringify({ state, verifier });
  const signed = await signValue(payload, env.SESSION_SECRET);

  const store = await cookies();
  store.set(OAUTH_COOKIE, signed, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });

  return NextResponse.redirect(authUrl);
}
