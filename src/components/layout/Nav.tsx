"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { CtaButton } from "@/components/checkout/CtaButton";

const NAV_LINKS = [
  { href: "#plan", label: "El plan" },
  { href: "#casos-de-exito", label: "Casos de éxito" },
  { href: "#cesar", label: "Sobre César" },
];

/**
 * Isla flotante de cristal. A proposito NO depende de ningun estado de
 * scroll: el navegador pinta el HTML del servidor antes de que React
 * hidrate, asi que cualquier estilo atado a JS produce un parpadeo si la
 * pagina carga ya scrolleada. Aca el panel siempre lleva su propio fondo
 * translucido + blur, de modo que se lee igual sobre el video del hero y
 * sobre el contenido claro, incluso antes de que corra el JS.
 */
export function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  // Cierra el menu mobile si la pantalla crece a desktop mientras esta abierto.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = () => setIsMenuOpen(false);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-2xl border border-blanco-calido/60 bg-blanco-calido/80 shadow-[0_10px_30px_-12px_rgba(0,61,115,0.35)] backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-6 px-4 sm:px-5">
            <a href="#top" aria-label="Ir al inicio" className="shrink-0">
              <Image
                src="/logos/cesar-activo-coach-mark.png"
                alt="César Activo Coach"
                width={559}
                height={344}
                className="h-9 w-auto sm:h-10"
                priority
              />
            </a>

            <nav aria-label="Principal" className="hidden flex-1 items-center justify-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded text-sm font-medium text-texto-oscuro transition-colors duration-200 hover:text-azul focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-azul"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <CtaButton className="hidden shrink-0 px-5 py-2.5 text-sm md:inline-flex" />

            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
              aria-controls="menu-mobile"
              className="inline-flex shrink-0 items-center justify-center rounded-full p-2 text-texto-oscuro transition-transform duration-150 ease-out active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul md:hidden"
            >
              {isMenuOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {isMenuOpen && (
              <motion.div
                id="menu-mobile"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden border-t border-crema/70 md:hidden"
              >
                <nav aria-label="Principal móvil" className="flex flex-col gap-1 p-4">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-lg px-2 py-3 text-base font-medium text-texto-oscuro transition-colors duration-150 hover:bg-crema/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul"
                    >
                      {link.label}
                    </a>
                  ))}
                  <CtaButton className="mt-2 w-full justify-center" />
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
