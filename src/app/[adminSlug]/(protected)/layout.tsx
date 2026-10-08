import Link from "next/link";
import { SignOut, ChartLineUp, UsersThree, Gear } from "@phosphor-icons/react/dist/ssr";
import { requireAdmin } from "@/lib/auth/guard";
import { cf } from "@/lib/cloudflare";

export const dynamic = "force-dynamic";

/**
 * Guarda de sesion para todo el panel. requireAdmin() se llama una sola vez
 * aqui y cubre todas las paginas hijas.
 *
 * IMPORTANTE: las rutas de /api/admin NO pasan por este layout, asi que cada
 * una tiene que llamar a requireAdmin() por su cuenta.
 */
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const { env } = await cf();
  const base = `/${env.ADMIN_PATH}`;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="border-b border-linea bg-tarjeta">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6">
          <Link href={base} className="font-display text-lg text-tinta">
            Panel
          </Link>

          <nav className="flex items-center gap-1" aria-label="Secciones del panel">
            <Link
              href={base}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-tinta-suave transition-colors duration-[var(--dur-hover)] hover:bg-superficie-2 hover:text-tinta"
            >
              <ChartLineUp size={16} weight="bold" />
              Resumen
            </Link>
            <Link
              href={`${base}/leads`}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-tinta-suave transition-colors duration-[var(--dur-hover)] hover:bg-superficie-2 hover:text-tinta"
            >
              <UsersThree size={16} weight="bold" />
              Personas
            </Link>
            <Link
              href={`${base}/ajustes`}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-tinta-suave transition-colors duration-[var(--dur-hover)] hover:bg-superficie-2 hover:text-tinta"
            >
              <Gear size={16} weight="bold" />
              Ajustes
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-tinta-suave sm:inline">{admin.email}</span>
            {/* Formulario y no enlace: cerrar sesion cambia estado en el
                servidor, asi que tiene que ser POST. */}
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full border border-linea px-3 py-1.5 text-sm font-medium text-tinta-suave transition-colors duration-[var(--dur-hover)] hover:text-tinta"
              >
                <SignOut size={16} weight="bold" />
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
