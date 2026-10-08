import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { cf } from "@/lib/cloudflare";
import { exchangeCodeForTokens, verifyGoogleIdToken } from "@/lib/auth/google";
import { verifySignedValue } from "@/lib/auth/cookies";
import { createSession } from "@/lib/auth/session";
import { newId } from "@/lib/ids";

const OAUTH_COOKIE = "ca_oauth";

/**
 * Vuelta de Google. Aqui vive el control de QUIEN puede entrar, y son tres
 * caminos en orden:
 *   1. ya existe como admin (por google_sub o por correo),
 *   2. arranque del sistema: si no hay NINGUN admin todavia y el correo
 *      coincide con OWNER_EMAIL, se crea como propietario,
 *   3. tiene una invitacion vigente sin usar.
 * Cualquier otro caso se rechaza. No hay lista blanca en el codigo: el
 * control vive en la base, que es lo que permite invitar sin desplegar.
 */
export async function GET(req: NextRequest) {
  const { env } = await cf();
  const adminPath = env.ADMIN_PATH;
  const loginUrl = new URL(`/${adminPath}/login`, req.nextUrl.origin);

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  if (!code || !state) {
    loginUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(loginUrl);
  }

  const store = await cookies();
  const raw = store.get(OAUTH_COOKIE)?.value;
  store.delete(OAUTH_COOKIE);
  if (!raw) {
    loginUrl.searchParams.set("error", "missing_state");
    return NextResponse.redirect(loginUrl);
  }

  const payloadStr = await verifySignedValue(raw, env.SESSION_SECRET);
  if (!payloadStr) {
    loginUrl.searchParams.set("error", "bad_state");
    return NextResponse.redirect(loginUrl);
  }
  const { state: expectedState, verifier } = JSON.parse(payloadStr) as {
    state: string;
    verifier: string;
  };
  if (state !== expectedState) {
    loginUrl.searchParams.set("error", "state_mismatch");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const redirectUri = new URL(`/api/auth/callback`, req.nextUrl.origin).toString();
    const tokens = await exchangeCodeForTokens({
      code,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectUri,
      codeVerifier: verifier,
    });
    const profile = await verifyGoogleIdToken(tokens.id_token, env.GOOGLE_CLIENT_ID);

    if (!profile.email_verified) {
      loginUrl.searchParams.set("error", "email_not_verified");
      return NextResponse.redirect(loginUrl);
    }

    let admin = await env.DB.prepare(
      "SELECT id, status FROM admins WHERE google_sub = ? OR email = ?",
    )
      .bind(profile.sub, profile.email)
      .first<{ id: string; status: string }>();

    if (!admin) {
      const adminCount = await env.DB.prepare("SELECT COUNT(*) as n FROM admins").first<{
        n: number;
      }>();
      const isBootstrapOwner =
        (adminCount?.n ?? 0) === 0 &&
        profile.email.toLowerCase() === env.OWNER_EMAIL.toLowerCase();

      if (isBootstrapOwner) {
        const adminId = newId("adm");
        await env.DB.prepare(
          `INSERT INTO admins (id, email, name, avatar_url, google_sub, role, status, created_at, last_login_at)
           VALUES (?, ?, ?, ?, ?, 'owner', 'activo', ?, ?)`,
        )
          .bind(
            adminId,
            profile.email,
            profile.name,
            profile.picture ?? null,
            profile.sub,
            Date.now(),
            Date.now(),
          )
          .run();
        admin = { id: adminId, status: "activo" };
      } else {
        const invitation = await env.DB.prepare(
          `SELECT id, invited_by FROM admin_invitations
           WHERE email = ? AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > ?
           ORDER BY created_at DESC LIMIT 1`,
        )
          .bind(profile.email, Date.now())
          .first<{ id: string; invited_by: string }>();

        if (!invitation) {
          loginUrl.searchParams.set("error", "not_authorized");
          return NextResponse.redirect(loginUrl);
        }

        const adminId = newId("adm");
        await env.DB.batch([
          env.DB.prepare(
            `INSERT INTO admins (id, email, name, avatar_url, google_sub, role, status, invited_by, created_at, last_login_at)
             VALUES (?, ?, ?, ?, ?, 'admin', 'activo', ?, ?, ?)`,
          ).bind(
            adminId,
            profile.email,
            profile.name,
            profile.picture ?? null,
            profile.sub,
            invitation.invited_by,
            Date.now(),
            Date.now(),
          ),
          env.DB.prepare("UPDATE admin_invitations SET accepted_at = ? WHERE id = ?").bind(
            Date.now(),
            invitation.id,
          ),
        ]);
        admin = { id: adminId, status: "activo" };
      }
    } else if (admin.status !== "activo") {
      loginUrl.searchParams.set("error", "suspended");
      return NextResponse.redirect(loginUrl);
    } else {
      await env.DB.prepare(
        "UPDATE admins SET last_login_at = ?, google_sub = ?, name = ?, avatar_url = ? WHERE id = ?",
      )
        .bind(Date.now(), profile.sub, profile.name, profile.picture ?? null, admin.id)
        .run();
    }

    await createSession(admin.id, env.SESSION_SECRET, {
      ip: req.headers.get("cf-connecting-ip"),
      userAgent: req.headers.get("user-agent"),
    });

    return NextResponse.redirect(new URL(`/${adminPath}`, req.nextUrl.origin));
  } catch (err) {
    console.error("Google OAuth callback error", err);
    loginUrl.searchParams.set("error", "unexpected");
    return NextResponse.redirect(loginUrl);
  }
}
