import { cookies } from "next/headers";
import { getDb } from "@/lib/cloudflare";
import { newId } from "@/lib/ids";
import { signValue, verifySignedValue } from "./cookies";

const SESSION_COOKIE = "ca_session";
const SESSION_DAYS = 7;

export type AdminSession = {
  id: string;
  adminId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: "owner" | "admin";
};

export async function createSession(
  adminId: string,
  secret: string,
  meta: { ip: string | null; userAgent: string | null },
) {
  const db = await getDb();
  const id = newId("sess");
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  await db
    .prepare(
      "INSERT INTO sessions (id, admin_id, expires_at, created_at, ip, user_agent) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .bind(id, adminId, expiresAt, Date.now(), meta.ip, meta.userAgent)
    .run();

  const signed = await signValue(id, secret);
  const store = await cookies();
  store.set(SESSION_COOKIE, signed, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession(secret: string) {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (raw) {
    const sessionId = await verifySignedValue(raw, secret);
    if (sessionId) {
      const db = await getDb();
      await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
    }
  }
  store.delete(SESSION_COOKIE);
}

/**
 * Lee la sesion actual del admin, o null si no hay una valida y vigente.
 * Comprueba tambien el estado del admin: suspender a alguien tiene que
 * echarlo aunque su cookie siga sin caducar.
 */
export async function getCurrentAdmin(secret: string): Promise<AdminSession | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const sessionId = await verifySignedValue(raw, secret);
  if (!sessionId) return null;

  const db = await getDb();
  const row = await db
    .prepare(
      `SELECT s.id as session_id, s.expires_at,
              a.id as admin_id, a.email, a.name, a.avatar_url, a.role, a.status
       FROM sessions s JOIN admins a ON a.id = s.admin_id
       WHERE s.id = ?`,
    )
    .bind(sessionId)
    .first<{
      session_id: string;
      expires_at: number;
      admin_id: string;
      email: string;
      name: string;
      avatar_url: string | null;
      role: "owner" | "admin";
      status: "activo" | "suspendido";
    }>();

  if (!row) return null;
  if (row.expires_at < Date.now() || row.status !== "activo") return null;

  return {
    id: row.session_id,
    adminId: row.admin_id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url,
    role: row.role,
  };
}
