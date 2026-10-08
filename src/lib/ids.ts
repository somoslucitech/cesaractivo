/**
 * IDs legibles y ordenables por tiempo, sin dependencias externas.
 * Formato: <prefijo>_<timestamp-base36><aleatorio-base36>.
 */
export function newId(prefix: string): string {
  const time = Date.now().toString(36);
  const random = crypto.getRandomValues(new Uint32Array(2));
  const rand = Array.from(random, (n) => n.toString(36).padStart(7, "0")).join("");
  return `${prefix}_${time}${rand}`;
}

/** Token opaco URL-safe, para invitaciones de admin. */
export function newToken(bytes = 32): string {
  const arr = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}
