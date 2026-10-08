import { cookies } from "next/headers";

const DEVICE_COOKIE = "ca_device";
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Identidad anonima del visitante. Nunca inicia sesion: solo sirve para
 * contar visitantes unicos en lugar de visitas sueltas. El valor crudo jamas
 * llega a la base; se guarda hasheado con sal (ver analytics.ts).
 */
export async function getOrCreateDeviceId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(DEVICE_COOKIE)?.value;
  if (existing) return existing;

  const id = crypto.randomUUID();
  store.set(DEVICE_COOKIE, id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });
  return id;
}

/**
 * Variante de solo lectura para Server Components: Next solo permite ESCRIBIR
 * cookies en Route Handlers y Server Actions.
 */
export async function getDeviceIdReadOnly(): Promise<string | null> {
  const store = await cookies();
  return store.get(DEVICE_COOKIE)?.value ?? null;
}
