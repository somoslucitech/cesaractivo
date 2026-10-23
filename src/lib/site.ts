/**
 * Dominio confirmado por el cliente (2026-09-18). Es la URL canonica: la usan
 * metadataBase, el sitemap, robots.txt y los datos estructurados, aunque la
 * pagina tambien se sirva en *.workers.dev.
 */
export const SITE_URL = "https://cesaractivo.com";

/** Paginas publicas e indexables. El panel no va aqui: su URL es secreta. */
export const RUTAS_PUBLICAS = ["/", "/privacidad", "/terminos"] as const;
