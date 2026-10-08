/**
 * Variables de entorno que NO son bindings y por tanto no las genera
 * `wrangler types`. Todas se cargan como Secret en Cloudflare.
 *
 * Ojo: las variables de texto plano se borran en cada `wrangler deploy`
 * cuando wrangler.jsonc no declara un bloque `vars`. Cargarlas como Secret,
 * no como variable de texto plano.
 */
interface CloudflareEnv {
  /** Segmento secreto de la URL del panel, ej. "gestion-a7f3k9". */
  ADMIN_PATH: string;
  /** Correo del primer administrador; solo sirve si la tabla admins esta vacia. */
  OWNER_EMAIL: string;
  /** Firma de cookies de sesion y sal del hash de visitante. openssl rand -hex 32 */
  SESSION_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  /** ID del pixel de Meta. Este si va en `vars` de wrangler.jsonc: es publico. */
  META_PIXEL_ID?: string;
}
