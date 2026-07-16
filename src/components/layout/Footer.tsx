import Image from "next/image";

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
        <p className="text-xs text-tinta-suave">
          © {new Date().getFullYear()} César Activo. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
