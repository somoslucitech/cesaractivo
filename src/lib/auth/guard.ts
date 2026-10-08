import { redirect } from "next/navigation";
import { cf } from "@/lib/cloudflare";
import { getCurrentAdmin, type AdminSession } from "./session";

/**
 * Usar al inicio de cada Server Component y de CADA route handler bajo
 * /api/admin. Las rutas de API no pasan por el layout del panel, asi que si
 * una se olvida de llamar a esto queda abierta al mundo.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const { env } = await cf();
  const admin = await getCurrentAdmin(env.SESSION_SECRET);
  if (!admin) redirect(`/${env.ADMIN_PATH}/login`);
  return admin;
}

/**
 * Version para rutas de API. NO redirige: devuelve null.
 *
 * requireAdmin() responde con un redirect, que en una pagina es lo correcto
 * pero en una API es una trampa: fetch() sigue las redirecciones, acaba en la
 * pantalla de login (que responde 200 con HTML) y el cliente ve `res.ok` en
 * true. Es decir, el panel creeria que la accion salio bien cuando en
 * realidad no se hizo nada.
 */
export async function adminDeApi(): Promise<AdminSession | null> {
  const { env } = await cf();
  return getCurrentAdmin(env.SESSION_SECRET);
}

/**
 * Version para rutas de API que solo puede usar el propietario. Devuelve la
 * sesion, o el codigo HTTP que corresponde: 401 si no hay sesion, 403 si la
 * hay pero no es propietario. Distinguirlos importa, porque significan cosas
 * distintas para quien lo recibe.
 */
export async function ownerDeApi(): Promise<
  { ok: true; admin: AdminSession } | { ok: false; estado: 401 | 403 }
> {
  const admin = await adminDeApi();
  if (!admin) return { ok: false, estado: 401 };
  if (admin.role !== "owner") return { ok: false, estado: 403 };
  return { ok: true, admin };
}

export class ForbiddenError extends Error {}

/** Solo el propietario puede invitar o suspender a otros administradores. */
export async function requireOwner(): Promise<AdminSession> {
  const admin = await requireAdmin();
  if (admin.role !== "owner") {
    throw new ForbiddenError("Solo el propietario puede realizar esta accion.");
  }
  return admin;
}
