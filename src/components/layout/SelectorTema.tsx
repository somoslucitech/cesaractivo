"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "@phosphor-icons/react";

export type Tema = "claro" | "oscuro";

/** Debe coincidir con la clave que lee el script anti-parpadeo del layout. */
export const CLAVE_TEMA = "tema";

const CONSULTA_OSCURO = "(prefers-color-scheme: dark)";

/* Cada opcion toma su color de marca: el sol amarillo, la luna azul. Como
   el boton activo solo se ve en su propio tema (el sol solo en claro, la
   luna solo en oscuro), cada par tinte+icono se calibro contra ese fondo.
   El sol usa `acento` y no `amarillo-oscuro`: este ultimo da 2.2:1 sobre el
   tinte claro, por debajo del minimo para iconos. */
const OPCIONES = [
  {
    valor: "claro",
    label: "Usar el tema claro",
    Icon: Sun,
    activo: "bg-tinte-amarillo text-acento",
  },
  {
    valor: "oscuro",
    label: "Usar el tema oscuro",
    Icon: Moon,
    activo: "bg-tinte-azul text-azul-texto",
  },
] as const;

/* localStorage y matchMedia son stores externos a React, asi que se leen con
   useSyncExternalStore en vez de useState + useEffect (que dispara renders
   en cascada). El evento "storage" solo avisa de cambios hechos en OTRA
   pestaña, por eso mantenemos ademas nuestra propia lista de oyentes. */
const oyentes = new Set<() => void>();

function suscribir(alCambiar: () => void) {
  oyentes.add(alCambiar);
  window.addEventListener("storage", alCambiar);
  // Si el usuario no ha elegido nada, el tema sigue al SO: hay que
  // re-renderizar cuando cambie para que el boton activo no mienta.
  const consulta = window.matchMedia(CONSULTA_OSCURO);
  consulta.addEventListener("change", alCambiar);
  return () => {
    oyentes.delete(alCambiar);
    window.removeEventListener("storage", alCambiar);
    consulta.removeEventListener("change", alCambiar);
  };
}

/** Devuelve el tema que se esta viendo, no solo el guardado. */
function leerTema(): Tema {
  try {
    const guardado = localStorage.getItem(CLAVE_TEMA);
    if (guardado === "claro" || guardado === "oscuro") return guardado;
  } catch {
    // localStorage bloqueado (modo privado): decide el SO.
  }
  return window.matchMedia(CONSULTA_OSCURO).matches ? "oscuro" : "claro";
}

/** El servidor no conoce ni la eleccion ni el SO; React re-renderiza al hidratar. */
function leerTemaEnServidor(): Tema {
  return "claro";
}

function elegirTema(tema: Tema) {
  try {
    localStorage.setItem(CLAVE_TEMA, tema);
  } catch {
    // Sin persistencia, pero el cambio igual aplica en esta sesion.
  }
  document.documentElement.dataset.theme = tema === "claro" ? "light" : "dark";
  oyentes.forEach((avisar) => avisar());
}

export function SelectorTema({ className = "" }: { className?: string }) {
  const tema = useSyncExternalStore(suscribir, leerTema, leerTemaEnServidor);

  return (
    <div
      role="group"
      aria-label="Tema de la página"
      className={`inline-flex items-center gap-0.5 rounded-full border border-linea p-0.5 ${className}`}
    >
      {OPCIONES.map(({ valor, label, Icon, activo: clasesActivo }) => {
        const activo = tema === valor;
        return (
          <button
            key={valor}
            type="button"
            onClick={() => elegirTema(valor)}
            aria-label={label}
            aria-pressed={activo}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-texto ${
              activo ? clasesActivo : "text-tinta-suave hover:text-tinta"
            }`}
          >
            <Icon size={15} weight={activo ? "fill" : "regular"} />
          </button>
        );
      })}
    </div>
  );
}
