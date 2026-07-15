"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { CtaButton } from "@/components/checkout/CtaButton";

const NAV_LINKS = [
  { href: "#plan", label: "El plan" },
  { href: "#casos-de-exito", label: "Casos de éxito" },
  { href: "#cesar", label: "Sobre César" },
];

// En el servidor no existe layout effect; useEffect evita el warning de SSR.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Layout effect (no useEffect) para corregir el estado ANTES del primer
  // pintado. Si la pagina carga ya scrolleada, sin esto se ve un flash de
  // navbar transparente con links blancos sobre fondo claro.
  useIsomorphicLayoutEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 24);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cierra el menu mobile si la pantalla crece a desktop mientras esta abierto.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = () => setIsMenuOpen(false);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const isSolid = isScrolled || isMenuOpen;

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        isSolid
          ? "border-b border-crema/80 bg-blanco-calido/90 backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      {/* Scrim sobre el video del hero: garantiza que los links blancos se
          lean aunque pase un frame claro detras. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-texto-oscuro/60 to-transparent transition-opacity duration-300 ${
          isSolid ? "opacity-0" : "opacity-100"
        }`}
      />

      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <span
          className={`inline-flex shrink-0 items-center rounded-xl transition-colors duration-300 ${
            isSolid ? "" : "bg-blanco-calido/90 px-3 py-1.5"
          }`}
        >
          <Image
            src="/logos/cesar-activo-coach-mark.png"
            alt="César Activo Coach"
            width={559}
            height={344}
            className="h-9 w-auto sm:h-11"
            priority
          />
        </span>

        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-300 hover:text-azul ${
                isSolid ? "text-texto-oscuro" : "text-blanco-calido"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <CtaButton className="hidden shrink-0 px-5 py-2.5 text-sm md:inline-flex" />

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "Cerrar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
          className={`inline-flex shrink-0 items-center justify-center rounded-full p-2 transition-colors duration-300 md:hidden ${
            isSolid ? "text-texto-oscuro" : "text-blanco-calido"
          }`}
        >
          {isMenuOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-crema/80 bg-blanco-calido md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg px-2 py-3 text-base font-medium text-texto-oscuro transition-colors duration-150 hover:bg-crema/60"
                >
                  {link.label}
                </a>
              ))}
              <CtaButton className="mt-2 w-full justify-center" />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
