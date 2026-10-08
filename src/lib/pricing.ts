/**
 * Calculo del precio del Plan Detox5 en las dos monedas.
 *
 * Son dos importes FIJOS, no una conversion en vivo: el cliente decide cuanto
 * cuesta en cada moneda y ahi se queda hasta que lo cambie desde el panel.
 *
 * Este archivo NO importa nada de @opennextjs/cloudflare a proposito: lo
 * consumen tanto componentes de cliente (el selector de moneda, el modal)
 * como rutas de servidor, y no puede arrastrar codigo de servidor a un bundle
 * de cliente. La lectura de la base vive en src/lib/settings.ts.
 */

export type Currency = "usd" | "eur";

export const CURRENCY_SYMBOL: Record<Currency, string> = { usd: "$", eur: "€" };
export const CURRENCY_LABEL: Record<Currency, string> = { usd: "USD", eur: "EUR" };

/**
 * Monedas en las que se puede pagar con criptomoneda. ApoloPay solo liquida
 * en dolares, asi que en euros esa opcion no se ofrece.
 */
export const APOLOPAY_CURRENCIES: readonly Currency[] = ["usd"];

export function aceptaApoloPay(currency: Currency): boolean {
  return APOLOPAY_CURRENCIES.includes(currency);
}

/** Configuracion cruda, tal como sale de la tabla settings. */
export type ConfigPrecio = {
  precioUsd: number;
  precioEur: number;
  ofertaPrecioUsd: number | null;
  ofertaPrecioEur: number | null;
  /** Ventana compartida por ambas monedas: es una sola promocion. */
  ofertaInicio: string | null;
  ofertaFin: string | null;
};

export type Precios = {
  currency: Currency;
  /** Precio de lista. Es el que se tacha cuando hay oferta. */
  normal: number;
  /** Lo que se cobra de verdad. Nunca confiar en un valor que venga del cliente. */
  efectivo: number;
  enOferta: boolean;
  ofertaFin: string | null;
};

export const PRECIO_USD_POR_DEFECTO = 18;
export const PRECIO_EUR_POR_DEFECTO = 17;

/** Comprueba que un valor recibido de fuera es una moneda valida. */
export function esCurrency(v: unknown): v is Currency {
  return v === "usd" || v === "eur";
}

/**
 * Decide si la oferta esta vigente para una moneda concreta y cual es el
 * precio a cobrar.
 *
 * Las dos fechas son opcionales y significan cosas distintas cuando faltan:
 * sin inicio la oferta vale desde ya, sin fin no caduca. Una moneda sin
 * precio de oferta no tiene oferta, por abierta que este la ventana.
 */
export function calcularPrecios(
  cfg: ConfigPrecio,
  currency: Currency,
  ahora: Date = new Date(),
): Precios {
  const porDefecto = currency === "eur" ? PRECIO_EUR_POR_DEFECTO : PRECIO_USD_POR_DEFECTO;
  const base = currency === "eur" ? cfg.precioEur : cfg.precioUsd;
  const normal = base > 0 ? base : porDefecto;
  const oferta = currency === "eur" ? cfg.ofertaPrecioEur : cfg.ofertaPrecioUsd;

  const sinOferta: Precios = {
    currency,
    normal,
    efectivo: normal,
    enOferta: false,
    ofertaFin: null,
  };

  if (oferta === null || oferta <= 0) return sinOferta;

  // Una "oferta" mas cara que el precio normal solo puede ser un error de
  // captura, y cobrarla de mas seria mucho peor que ignorarla.
  if (oferta >= normal) return sinOferta;

  const t = ahora.getTime();
  if (cfg.ofertaInicio) {
    const inicio = Date.parse(cfg.ofertaInicio);
    if (!Number.isNaN(inicio) && t < inicio) return sinOferta;
  }
  if (cfg.ofertaFin) {
    const fin = Date.parse(cfg.ofertaFin);
    if (!Number.isNaN(fin) && t > fin) return sinOferta;
  }

  return { currency, normal, efectivo: oferta, enOferta: true, ofertaFin: cfg.ofertaFin };
}

/** Formato visible. Sin decimales cuando el importe es entero. */
export function formatPrice(monto: number, currency: Currency): string {
  const s = CURRENCY_SYMBOL[currency];
  return Number.isInteger(monto) ? `${s}${monto}` : `${s}${monto.toFixed(2)}`;
}

/** Importe con dos decimales, que es como lo quieren PayPal y ApoloPay. */
export function montoParaPasarela(monto: number): string {
  return monto.toFixed(2);
}
