import type { MetadataRoute } from "next";
import { RUTAS_PUBLICAS, SITE_URL } from "@/lib/site";

/**
 * Siempre con el dominio principal, aunque se pida desde *.workers.dev. Sin
 * lastModified: Google ignora fechas que no reflejan cambios reales.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return RUTAS_PUBLICAS.map((ruta) => ({
    url: `${SITE_URL}${ruta === "/" ? "" : ruta}`,
    changeFrequency: ruta === "/" ? "weekly" : "yearly",
    priority: ruta === "/" ? 1 : 0.3,
  }));
}
