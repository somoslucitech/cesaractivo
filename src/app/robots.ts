import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { SITE_URL } from "@/lib/site";

/**
 * En *.workers.dev se bloquea todo el rastreo: es la misma web que
 * cesaractivo.com y no debe competir con ella en Google. La canonical ya
 * apunta al dominio principal; esto evita ademas que se gaste rastreo ahi.
 *
 * /api/ no aporta nada a un buscador. El panel no se menciona a proposito:
 * listarlo aqui revelaria su URL secreta (y ya responde 404 a quien no la
 * conoce).
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host") ?? "";

  if (host.endsWith(".workers.dev")) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
