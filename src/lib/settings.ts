import { getDb } from "./cloudflare";
import {
  calcularPrecios,
  PRECIO_EUR_POR_DEFECTO,
  PRECIO_USD_POR_DEFECTO,
  type ConfigPrecio,
  type Currency,
  type Precios,
} from "./pricing";

/**
 * Lectura y escritura de los ajustes editables desde el panel.
 *
 * Todo lo que tenga que ver con cobrar dinero pasa por aqui, en el servidor.
 * El precio que se muestra en la pagina es solo informativo: el que se cobra
 * se vuelve a calcular aqui en cada operacion, porque cualquiera puede
 * manipular lo que envia el navegador.
 */

type FilaAjuste = { key: string; value: string };

export async function leerAjustes(): Promise<Map<string, string>> {
  const db = await getDb();
  const { results } = await db.prepare("SELECT key, value FROM settings").all<FilaAjuste>();
  return new Map(results.map((r) => [r.key, r.value]));
}

function aNumero(v: string | undefined): number | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function aTexto(v: string | undefined): string | null {
  return v && v.trim().length > 0 ? v : null;
}

export function configDesdeAjustes(ajustes: Map<string, string>): ConfigPrecio {
  return {
    precioUsd: aNumero(ajustes.get("precio_usd")) ?? PRECIO_USD_POR_DEFECTO,
    precioEur: aNumero(ajustes.get("precio_eur")) ?? PRECIO_EUR_POR_DEFECTO,
    ofertaPrecioUsd: aNumero(ajustes.get("oferta_precio_usd")),
    ofertaPrecioEur: aNumero(ajustes.get("oferta_precio_eur")),
    ofertaInicio: aTexto(ajustes.get("oferta_inicio")),
    ofertaFin: aTexto(ajustes.get("oferta_fin")),
  };
}

const CONFIG_POR_DEFECTO: ConfigPrecio = {
  precioUsd: PRECIO_USD_POR_DEFECTO,
  precioEur: PRECIO_EUR_POR_DEFECTO,
  ofertaPrecioUsd: null,
  ofertaPrecioEur: null,
  ofertaInicio: null,
  ofertaFin: null,
};

/**
 * Configuracion vigente. Si la lectura falla se cae a los precios de lista en
 * lugar de reventar: es preferible cobrar el precio normal a que la pagina
 * entera deje de vender.
 */
export async function obtenerConfigPrecio(): Promise<ConfigPrecio> {
  try {
    return configDesdeAjustes(await leerAjustes());
  } catch (error) {
    console.error("[cesaractivo] no se pudieron leer los ajustes de precio:", error);
    return CONFIG_POR_DEFECTO;
  }
}

/** Precio vigente para una moneda. Unica fuente valida para cobrar. */
export async function obtenerPrecios(currency: Currency): Promise<Precios> {
  return calcularPrecios(await obtenerConfigPrecio(), currency);
}

/** Guarda los ajustes de precio dejando rastro de quien los cambio. */
export async function guardarConfigPrecio(
  cfg: ConfigPrecio,
  adminId: string,
): Promise<void> {
  const db = await getDb();
  const ahora = Date.now();

  const pares: [string, string][] = [
    ["precio_usd", String(cfg.precioUsd)],
    ["precio_eur", String(cfg.precioEur)],
    ["oferta_precio_usd", cfg.ofertaPrecioUsd === null ? "" : String(cfg.ofertaPrecioUsd)],
    ["oferta_precio_eur", cfg.ofertaPrecioEur === null ? "" : String(cfg.ofertaPrecioEur)],
    ["oferta_inicio", cfg.ofertaInicio ?? ""],
    ["oferta_fin", cfg.ofertaFin ?? ""],
  ];

  await db.batch(
    pares.map(([key, value]) =>
      db
        .prepare(
          `INSERT INTO settings (key, value, updated_at, updated_by) VALUES (?, ?, ?, ?)
           ON CONFLICT(key) DO UPDATE SET value = excluded.value,
                                          updated_at = excluded.updated_at,
                                          updated_by = excluded.updated_by`,
        )
        .bind(key, value, ahora, adminId),
    ),
  );
}
