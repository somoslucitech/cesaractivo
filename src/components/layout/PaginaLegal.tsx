import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

/**
 * Marco comun de /privacidad y /terminos: cabecera con el logo, texto en
 * columna de lectura y el pie de siempre. Mismo esquema que /gracias.
 */
export function PaginaLegal({
  titulo,
  actualizado,
  children,
}: {
  titulo: string;
  /** Fecha visible de la ultima revision, en texto ("7 de octubre de 2026"). */
  actualizado: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <Link href="/" aria-label="Ir al inicio" className="inline-block">
          <Image
            src="/logos/cesar-activo-coach-mark.webp"
            alt="César Activo Coach"
            width={390}
            height={240}
            className="h-10 w-auto"
            priority
          />
        </Link>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-20 sm:px-6">
        <h1 className="font-display text-3xl text-azul-titulo md:text-4xl">{titulo}</h1>
        <p className="mt-2 text-sm text-tinta-suave">Última actualización: {actualizado}</p>
        <div className="mt-10 flex flex-col gap-4 text-base leading-relaxed text-tinta-suave [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-tinta [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-tinta [&_a]:font-semibold [&_a]:text-azul-texto">
          {children}
        </div>
        <Link
          href="/"
          className="mt-12 inline-block text-sm font-semibold text-azul-texto transition-colors duration-[var(--dur-hover)] hover:text-azul"
        >
          Volver al inicio
        </Link>
      </main>

      <Footer />
    </>
  );
}
