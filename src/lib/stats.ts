import { getDb } from "./cloudflare";
import type { Lead } from "./types";

/**
 * Consultas del panel.
 *
 * OJO CON LAS FECHAS: `events.created_at` es INTEGER (epoch ms) y
 * `leads.created_at` es TEXT ISO. Son dos convenciones distintas conviviendo
 * en la misma base (ver el comentario de migrations/0003_admin.sql). Por eso
 * cada consulta recibe el corte en el formato que le toca y aqui se calculan
 * los dos. Nunca comparar una columna con el formato de la otra.
 */
function cortes(dias: number) {
  const ms = Date.now() - dias * 24 * 60 * 60 * 1000;
  return { ms, iso: new Date(ms).toISOString() };
}

export type Embudo = {
  visitantes: number;
  abrieronCheckout: number;
  dejaronDatos: number;
  eligieronMetodo: number;
  pagaron: number;
};

/**
 * Los cinco pasos, de mirar a pagar. Los tres primeros salen de `events`
 * (contando visitantes unicos, no visitas) y los dos ultimos de `leads`,
 * que es la fuente de verdad del pago.
 */
export async function obtenerEmbudo(dias = 30): Promise<Embudo> {
  const db = await getDb();
  const { ms, iso } = cortes(dias);

  const eventos = await db
    .prepare(
      `SELECT type, COUNT(DISTINCT visitor_hash) AS n
       FROM events WHERE created_at >= ? GROUP BY type`,
    )
    .bind(ms)
    .all<{ type: string; n: number }>();

  const porTipo = new Map(eventos.results.map((r) => [r.type, r.n]));

  const leads = await db
    .prepare(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN payment_method IS NOT NULL THEN 1 ELSE 0 END) AS con_metodo,
         SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) AS pagados
       FROM leads WHERE created_at >= ?`,
    )
    .bind(iso)
    .first<{ total: number; con_metodo: number | null; pagados: number | null }>();

  return {
    visitantes: porTipo.get("page_view") ?? 0,
    abrieronCheckout: porTipo.get("checkout_open") ?? 0,
    dejaronDatos: leads?.total ?? 0,
    eligieronMetodo: leads?.con_metodo ?? 0,
    pagaron: leads?.pagados ?? 0,
  };
}

export type Ingresos = {
  pagadosUsd: number;
  pagadosEur: number;
  totalUsd: number;
  totalEur: number;
  cercaDeComprar: number;
};

/**
 * Ingresos confirmados, separando moneda. No se suman USD y EUR en un solo
 * numero a proposito: serian peras con manzanas, y el proyecto guarda importes
 * fijos por moneda, no una conversion en vivo.
 */
export async function obtenerIngresos(): Promise<Ingresos> {
  const db = await getDb();
  const fila = await db
    .prepare(
      `SELECT
         SUM(CASE WHEN payment_status = 'paid' AND currency = 'usd' THEN 1 ELSE 0 END) AS n_usd,
         SUM(CASE WHEN payment_status = 'paid' AND currency = 'usd' THEN amount_usd ELSE 0 END) AS total_usd,
         SUM(CASE WHEN payment_status = 'paid' AND currency = 'eur' THEN 1 ELSE 0 END) AS n_eur,
         SUM(CASE WHEN payment_status = 'paid' AND currency = 'eur' THEN COALESCE(amount_eur, 0) ELSE 0 END) AS total_eur,
         SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END) AS cerca
       FROM leads`,
    )
    .first<{
      n_usd: number | null;
      total_usd: number | null;
      n_eur: number | null;
      total_eur: number | null;
      cerca: number | null;
    }>();

  return {
    pagadosUsd: fila?.n_usd ?? 0,
    pagadosEur: fila?.n_eur ?? 0,
    totalUsd: fila?.total_usd ?? 0,
    totalEur: fila?.total_eur ?? 0,
    cercaDeComprar: fila?.cerca ?? 0,
  };
}

export type DiaVisitas = { dia: string; visitantes: number };

/**
 * Visitantes unicos por dia. La consulta solo devuelve dias CON datos, asi
 * que despues hay que rellenar los huecos o el grafico mentiria comprimiendo
 * los dias vacios.
 */
export async function obtenerVisitasPorDia(dias = 30): Promise<DiaVisitas[]> {
  const db = await getDb();
  const { ms } = cortes(dias);

  const { results } = await db
    .prepare(
      `SELECT date(created_at / 1000, 'unixepoch') AS dia,
              COUNT(DISTINCT visitor_hash) AS visitantes
       FROM events
       WHERE type = 'page_view' AND created_at >= ?
       GROUP BY dia ORDER BY dia`,
    )
    .bind(ms)
    .all<DiaVisitas>();

  return rellenarDias(results, dias);
}

/** Completa con ceros los dias sin eventos para que el eje sea continuo. */
export function rellenarDias(filas: DiaVisitas[], dias: number): DiaVisitas[] {
  const porDia = new Map(filas.map((f) => [f.dia, f.visitantes]));
  const salida: DiaVisitas[] = [];
  const hoy = new Date();
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(
      Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate() - i),
    );
    const clave = d.toISOString().slice(0, 10);
    salida.push({ dia: clave, visitantes: porDia.get(clave) ?? 0 });
  }
  return salida;
}

export type FiltroLeads = {
  estado?: "pending" | "paid" | "failed" | "expired";
  limite?: number;
};

/** Lista de leads para la tabla del panel, del mas reciente al mas antiguo. */
export async function listarLeads(filtro: FiltroLeads = {}): Promise<Lead[]> {
  const db = await getDb();
  const limite = Math.min(filtro.limite ?? 100, 500);

  const consulta = filtro.estado
    ? db
        .prepare(
          `SELECT * FROM leads WHERE payment_status = ? ORDER BY created_at DESC LIMIT ?`,
        )
        .bind(filtro.estado, limite)
    : db.prepare(`SELECT * FROM leads ORDER BY created_at DESC LIMIT ?`).bind(limite);

  const { results } = await consulta.all<Lead>();
  return results;
}

/**
 * Confirma a mano el pago de un lead. Existe por los pagos de Zelle y Pago
 * Movil, que se cierran por WhatsApp y no dejan rastro automatico: sin esto
 * quedarian como "casi compro" para siempre y los ingresos saldrian por
 * debajo de lo real.
 */
export async function marcarPagadoAMano(opts: {
  leadId: string;
  adminId: string;
  metodo: "zelle" | "pago_movil" | "otro";
  nota?: string | null;
}): Promise<boolean> {
  const db = await getDb();
  const res = await db
    .prepare(
      `UPDATE leads
       SET payment_status = 'paid',
           payment_method = ?,
           paid_at = strftime('%Y-%m-%dT%H:%M:%fZ','now'),
           updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now'),
           marked_paid_by = ?,
           marked_paid_at = strftime('%Y-%m-%dT%H:%M:%fZ','now'),
           marked_paid_note = ?
       WHERE id = ? AND payment_status != 'paid'`,
    )
    .bind(opts.metodo, opts.adminId, opts.nota ?? null, opts.leadId)
    .run();

  return (res.meta.changes ?? 0) > 0;
}
