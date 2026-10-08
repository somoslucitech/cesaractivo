/**
 * Ubicacion aproximada que Cloudflare resuelve en el borde y adjunta a la
 * peticion. Es gratis y no requiere ninguna llamada extra.
 *
 * Se guardan pais, region y ciudad, pero NUNCA la IP: con esto basta para
 * saber de donde llega la gente, y asi el registro no se convierte en un dato
 * personal. Mismo criterio que el hash del identificador de visitante.
 */
export type Geo = {
  country?: string;
  region?: string;
  city?: string;
};

type CfLike = { country?: unknown; region?: unknown; city?: unknown } | undefined;

function texto(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export function readGeo(request: CfLike): Geo {
  if (!request) return {};
  return {
    country: texto(request.country),
    region: texto(request.region),
    city: texto(request.city),
  };
}

/** Clasificacion gruesa a partir del user-agent. Solo movil o escritorio. */
export function readDeviceKind(userAgent: string | null): string | undefined {
  if (!userAgent) return undefined;
  return /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent) ? "movil" : "escritorio";
}
