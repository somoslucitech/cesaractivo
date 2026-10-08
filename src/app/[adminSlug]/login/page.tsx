import Image from "next/image";
import { GoogleLogo, Warning } from "@phosphor-icons/react/dist/ssr";

export const dynamic = "force-dynamic";

/** Mensajes de error del callback de OAuth, traducidos a lenguaje humano. */
const ERRORES: Record<string, string> = {
  not_authorized: "Ese correo no tiene acceso al panel. Pide una invitación.",
  suspended: "Tu acceso está suspendido. Contacta con el propietario.",
  email_not_verified: "Google no ha verificado ese correo.",
  state_mismatch: "La sesión de acceso caducó. Inténtalo de nuevo.",
  bad_state: "La sesión de acceso caducó. Inténtalo de nuevo.",
  missing_state: "La sesión de acceso caducó. Inténtalo de nuevo.",
  missing_code: "Google no devolvió el código de acceso.",
  unexpected: "Algo falló al iniciar sesión. Inténtalo de nuevo.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const mensaje = error ? (ERRORES[error] ?? ERRORES.unexpected) : null;

  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <Image
          src="/logos/cesar-activo-coach-mark.webp"
          alt="César Activo Coach"
          width={390}
          height={240}
          className="mx-auto h-10 w-auto"
          priority
        />

        <div className="mt-8 rounded-3xl border border-linea bg-tarjeta p-8 shadow-[0_20px_44px_-24px_rgba(0,61,115,0.35)]">
          <h1 className="font-display text-2xl text-tinta">Panel de César Activo</h1>
          <p className="mt-2 text-sm text-tinta-suave">
            Entra con la cuenta de Google autorizada para ver las visitas, el embudo y las ventas.
          </p>

          {mensaje && (
            <p
              role="alert"
              className="mt-5 flex items-start gap-2 rounded-2xl bg-tinte-amarillo p-4 text-sm text-tinta"
            >
              <Warning size={18} weight="fill" className="mt-0.5 shrink-0 text-acento" />
              {mensaje}
            </p>
          )}

          {/* Un <a> y no <Link> a proposito: /api/auth/google responde con un
              redirect HTTP hacia accounts.google.com. Con <Link>, Next haria
              navegacion del lado del cliente y el redirect externo no se
              seguiria. Por eso se desactiva la regla aqui. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/auth/google"
            className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-azul px-6 py-3.5 font-semibold text-blanco-calido transition-transform duration-[var(--dur-hover)] ease-signature active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-texto"
          >
            <GoogleLogo size={20} weight="bold" />
            Entrar con Google
          </a>
        </div>
      </div>
    </main>
  );
}
