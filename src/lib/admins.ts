import { getDb } from "./cloudflare";
import { newId, newToken } from "./ids";

/**
 * Gestion de administradores e invitaciones.
 *
 * COMO FUNCIONA EL ACCESO: no hay lista blanca en el codigo. Alguien puede
 * entrar si (a) ya existe en `admins`, (b) es el primer acceso y su correo
 * coincide con OWNER_EMAIL, o (c) tiene una invitacion vigente para su
 * correo. La comprobacion vive en src/app/api/auth/callback/route.ts.
 */

export type FilaAdmin = {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: "owner" | "admin";
  status: "activo" | "suspendido";
  created_at: number;
  last_login_at: number | null;
};

export type FilaInvitacion = {
  id: string;
  email: string;
  expires_at: number;
  created_at: number;
};

const DIAS_VIGENCIA = 14;

export async function listarAdmins(): Promise<FilaAdmin[]> {
  const db = await getDb();
  const { results } = await db
    .prepare(
      `SELECT id, email, name, avatar_url, role, status, created_at, last_login_at
       FROM admins ORDER BY created_at`,
    )
    .all<FilaAdmin>();
  return results;
}

/** Solo las que siguen en pie: ni aceptadas, ni revocadas, ni caducadas. */
export async function listarInvitacionesVigentes(): Promise<FilaInvitacion[]> {
  const db = await getDb();
  const { results } = await db
    .prepare(
      `SELECT id, email, expires_at, created_at
       FROM admin_invitations
       WHERE accepted_at IS NULL AND revoked_at IS NULL AND expires_at > ?
       ORDER BY created_at DESC`,
    )
    .bind(Date.now())
    .all<FilaInvitacion>();
  return results;
}

export type ResultadoInvitacion =
  | { ok: true; id: string }
  | { ok: false; motivo: "ya_es_admin" | "ya_invitado" };

/**
 * Crea una invitacion para un correo.
 *
 * No se envia ningun correo: la persona entra por la URL del panel con su
 * cuenta de Google y el callback la reconoce por su direccion. El campo
 * token_hash existe porque el esquema lo exige (viene del panel de
 * anhellakids, que si manda enlaces por correo); aqui se rellena con un valor
 * aleatorio que nadie consulta.
 */
export async function invitarAdmin(
  email: string,
  invitadoPor: string,
): Promise<ResultadoInvitacion> {
  const db = await getDb();
  const correo = email.trim().toLowerCase();

  const existente = await db
    .prepare("SELECT id FROM admins WHERE lower(email) = ?")
    .bind(correo)
    .first<{ id: string }>();
  if (existente) return { ok: false, motivo: "ya_es_admin" };

  const pendiente = await db
    .prepare(
      `SELECT id FROM admin_invitations
       WHERE lower(email) = ? AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > ?`,
    )
    .bind(correo, Date.now())
    .first<{ id: string }>();
  if (pendiente) return { ok: false, motivo: "ya_invitado" };

  const id = newId("inv");
  const bruto = newToken(32);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(bruto));
  const tokenHash = Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");

  await db
    .prepare(
      `INSERT INTO admin_invitations (id, email, token_hash, invited_by, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      correo,
      tokenHash,
      invitadoPor,
      Date.now() + DIAS_VIGENCIA * 24 * 60 * 60 * 1000,
      Date.now(),
    )
    .run();

  return { ok: true, id };
}

export async function revocarInvitacion(id: string): Promise<boolean> {
  const db = await getDb();
  const res = await db
    .prepare("UPDATE admin_invitations SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL")
    .bind(Date.now(), id)
    .run();
  return (res.meta.changes ?? 0) > 0;
}

export type ResultadoEstado =
  | { ok: true }
  | { ok: false; motivo: "no_existe" | "es_uno_mismo" | "ultimo_propietario" };

/**
 * Suspende o reactiva a un administrador.
 *
 * Dos cerrojos que evitan quedarse fuera del propio panel: nadie puede
 * suspenderse a si mismo, y no se puede suspender al ultimo propietario
 * activo. Sin ellos, un clic mal dado deja el panel inaccesible para siempre,
 * porque el arranque por OWNER_EMAIL solo funciona con la tabla vacia.
 */
export async function cambiarEstadoAdmin(
  id: string,
  estado: "activo" | "suspendido",
  quienLoHace: string,
): Promise<ResultadoEstado> {
  const db = await getDb();

  if (id === quienLoHace && estado === "suspendido") {
    return { ok: false, motivo: "es_uno_mismo" };
  }

  const objetivo = await db
    .prepare("SELECT id, role, status FROM admins WHERE id = ?")
    .bind(id)
    .first<{ id: string; role: string; status: string }>();
  if (!objetivo) return { ok: false, motivo: "no_existe" };

  if (estado === "suspendido" && objetivo.role === "owner") {
    const otros = await db
      .prepare(
        "SELECT COUNT(*) AS n FROM admins WHERE role = 'owner' AND status = 'activo' AND id != ?",
      )
      .bind(id)
      .first<{ n: number }>();
    if ((otros?.n ?? 0) === 0) return { ok: false, motivo: "ultimo_propietario" };
  }

  await db.prepare("UPDATE admins SET status = ? WHERE id = ?").bind(estado, id).run();

  // Suspender tiene que echar fuera ya: si no se borran sus sesiones, la
  // cookie le seguiria valiendo. getCurrentAdmin tambien comprueba el estado,
  // pero borrar la sesion lo hace inmediato y explicito.
  if (estado === "suspendido") {
    await db.prepare("DELETE FROM sessions WHERE admin_id = ?").bind(id).run();
  }

  return { ok: true };
}
