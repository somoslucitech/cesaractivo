import { notFound } from "next/navigation";
import { cf } from "@/lib/cloudflare";

export const dynamic = "force-dynamic";

/** Variables sin las cuales el panel no puede funcionar. */
const ENV_REQUERIDAS = [
  "ADMIN_PATH",
  "OWNER_EMAIL",
  "SESSION_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
] as const;

/**
 * Enmascara el panel bajo una URL secreta (ADMIN_PATH). Cualquier segmento
 * que no coincida devuelve 404, sin filtrar que el panel existe.
 *
 * Va en un layout y no en middleware.ts porque Next 16 + @opennextjs/cloudflare
 * todavia no soportan middleware corriendo en Workers.
 *
 * Si ADMIN_PATH falta, la comparacion falla SIEMPRE y el panel entero
 * responde 404 sin explicar por que. Hacia fuera seguimos devolviendo 404
 * (no debe filtrarse que existe), pero dejamos un rastro imposible de
 * ignorar en los logs del Worker, visible con `wrangler tail`.
 */
export default async function AdminSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ adminSlug: string }>;
}) {
  const { adminSlug } = await params;
  const { env } = await cf();

  if (!env.ADMIN_PATH) {
    const faltan = ENV_REQUERIDAS.filter((k) => !env[k]);
    console.error(
      "[cesaractivo] ADMIN_PATH no esta configurada: el panel respondera 404 en todas sus rutas. " +
        `Variables ausentes: ${faltan.join(", ")}. ` +
        "Cargarlas como Secret en Settings > Variables and Secrets. " +
        "Ojo: las variables de texto plano se borran en cada `wrangler deploy`; los Secrets no.",
    );
    notFound();
  }

  if (adminSlug !== env.ADMIN_PATH) notFound();

  return children;
}
