/**
 * Precio fijo del Plan Detox5 por moneda (pedido del cliente: nada de
 * conversion en vivo, dos precios fijos que solo cambian si ellos deciden
 * reajustarlos). Este archivo no importa nada de @opennextjs/cloudflare a
 * proposito: lo consumen tanto componentes de cliente (toggle de moneda,
 * modal de checkout) como server routes, y no puede arrastrar codigo de
 * servidor a un bundle de cliente.
 */

export type Currency = "usd" | "eur";

export const PRICE_USD = 18;

/**
 * TODO(cliente): confirmar el precio fijo en EUR. 17 es un valor de
 * ejemplo (conversion aproximada al momento de escribir esto), no un
 * precio aprobado por Cesar. No lanzar a produccion sin reemplazar este
 * numero por el que el cliente confirme.
 */
export const PRICE_EUR = 17;

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  usd: "$",
  eur: "€",
};

export const CURRENCY_LABEL: Record<Currency, string> = {
  usd: "USD",
  eur: "EUR",
};

/** ApoloPay (cripto) solo liquida en USD; no ofrecemos esa opcion en EUR. */
export const APOLOPAY_CURRENCIES: readonly Currency[] = ["usd"];

export function priceFor(currency: Currency): number {
  return currency === "eur" ? PRICE_EUR : PRICE_USD;
}

export function formatPrice(currency: Currency): string {
  return `${CURRENCY_SYMBOL[currency]}${priceFor(currency)}`;
}
