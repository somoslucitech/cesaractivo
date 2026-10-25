import Image from "next/image";
import Link from "next/link";

// Crédito del desarrollador, con UTM para medir en la analítica de Somos Luci
// cuánta gente llega desde aquí. Sin rel="nofollow" a propósito, igual que en
// Bonchona, para que cuente para el SEO de Somos Luci.
const CREDIT_URL =
  "https://somosluci.com/?utm_source=cesaractivo&utm_medium=referral&utm_campaign=credito-web";

export function Footer() {
  return (
    <footer className="border-t border-linea bg-superficie-2 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:px-6">
        <Image
          src="/logos/cesar-activo-coach-mark.webp"
          alt="César Activo Coach"
          width={390}
          height={240}
          className="h-9 w-auto opacity-90"
        />
        <p className="max-w-md text-sm text-tinta-suave">
          Acompañamiento nutricional y de movimiento para mujeres que quieren recuperar su
          energía, sin dietas de hambre ni promesas vacías.
        </p>
        <nav aria-label="Legal" className="flex gap-5 text-xs font-semibold text-azul-texto">
          <Link href="/privacidad" className="hover:text-azul">
            Política de privacidad
          </Link>
          <Link href="/terminos" className="hover:text-azul">
            Términos y condiciones
          </Link>
        </nav>
        <p className="text-xs text-tinta-suave">
          © {new Date().getFullYear()} César Activo. Todos los derechos reservados.
        </p>
        <a
          href={CREDIT_URL}
          target="_blank"
          rel="noopener"
          className="group inline-flex items-center gap-2 text-xs text-tinta-suave transition-colors hover:text-tinta"
        >
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-white opacity-80 transition-opacity group-hover:opacity-100">
            <Image src="/creditos/somosluci.png" alt="" width={16} height={16} className="h-4 w-4" />
          </span>
          <span>
            Hecho con <span className="text-error" aria-label="amor">♥</span> por{" "}
            <span className="font-semibold text-azul-texto">Somos Luci</span>
          </span>
        </a>
      </div>
    </footer>
  );
}
