import { NextResponse, type NextRequest } from "next/server";
import { cf } from "@/lib/cloudflare";
import { destroySession } from "@/lib/auth/session";

/**
 * Cierra sesion. Borra la fila de `sessions` ademas de la cookie: si solo se
 * borrara la cookie, una copia robada de ella seguiria siendo valida durante
 * los 7 dias que dura la sesion.
 */
export async function POST(req: NextRequest) {
  const { env } = await cf();
  await destroySession(env.SESSION_SECRET);
  return NextResponse.redirect(new URL(`/${env.ADMIN_PATH}/login`, req.nextUrl.origin), 303);
}
