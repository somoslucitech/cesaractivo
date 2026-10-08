import Image from "next/image";
import Link from "next/link";
import { ArrowRight, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { Footer } from "@/components/layout/Footer";
import { whatsappUrl } from "@/lib/contact";

/**
 * 404 de toda la aplicacion.
 *
 * No monta el <Nav /> a proposito: su menu son anclas de la landing
 * (#plan, #casos-de-exito, #cesar) y desde aqui no llevarian a ninguna
 * parte. En su lugar va solo el logo, que si es un enlace util.
 *
 * Sin export de metadata: el titulo del layout raiz ya sirve, y esta
 * pagina no deberia competir por posicionamiento.
 */
export default function NotFound() {
  return (
    <>
      <header className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
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

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center px-4 py-16 sm:px-6 sm:py-24">
        <p className="font-display text-7xl leading-none text-tinte-azul sm:text-8xl">404</p>

        <h1 className="mt-4 font-display text-3xl text-tinta md:text-4xl">
          Esta página no existe
        </h1>

        <p className="mt-4 max-w-md text-base text-tinta-suave sm:text-lg">
          Puede que el enlace esté mal escrito o que la hayamos movido de sitio. El Plan Detox5
          sigue donde siempre, y desde ahí puedes seguir con lo que venías a hacer.
        </p>

        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-amarillo px-8 py-4 font-semibold text-texto-oscuro shadow-[0_10px_28px_-8px_rgba(200,168,0,0.55)] transition-transform duration-[var(--dur-hover)] ease-signature hover:bg-amarillo-oscuro active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-texto"
          >
            Volver al Plan Detox5
            <ArrowRight size={18} weight="bold" />
          </Link>

          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-azul-texto transition-colors duration-[var(--dur-hover)] hover:text-azul focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-azul-texto"
          >
            <WhatsappLogo size={20} weight="fill" />
            O escríbenos por WhatsApp
          </a>
        </div>
      </main>

      <Footer />
    </>
  );
}
