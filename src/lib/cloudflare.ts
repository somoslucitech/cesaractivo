import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Punto unico de acceso a los bindings del Worker. Antes cada modulo llamaba
 * a getCloudflareContext por su cuenta; con el panel entraron en juego varios
 * consumidores nuevos (auth, analitica, admin) y tener una sola puerta evita
 * que se multipliquen las variantes.
 */
export async function cf() {
  const { env, ctx, cf: request } = await getCloudflareContext({ async: true });
  return { env, ctx, request };
}

export async function getDb() {
  const { env } = await cf();
  return env.DB;
}
