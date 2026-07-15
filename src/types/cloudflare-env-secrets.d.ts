export {};

/**
 * Secrets y vars que no viven en wrangler.jsonc (se cargan con
 * `wrangler secret put <NAME>` en la cuenta del cliente). Declaradas
 * aquí solo para tipar `env` en los route handlers; cf-typegen no las
 * genera porque no son bindings de infraestructura.
 */
declare global {
  interface CloudflareEnv {
    APOLOPAY_SECRET_KEY?: string;
    APOLOPAY_PUBLIC_KEY?: string;
    APOLOPAY_WEBHOOK_SECRET?: string;
    PAYPAL_CLIENT_ID?: string;
    PAYPAL_CLIENT_SECRET?: string;
    PAYPAL_WEBHOOK_ID?: string;
    PAYPAL_ENV?: "sandbox" | "live";
    COACH_NOTIFY_EMAIL?: string;
    COACH_FROM_EMAIL?: string;
  }
}
