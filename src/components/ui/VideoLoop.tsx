"use client";

import { useReducedMotion } from "motion/react";

interface VideoLoopProps {
  /** Nombre base en /public/videos, sin extension. Ej: "video1". */
  nombre: string;
  /** Texto alternativo del poster, que es lo que ve quien no reproduce video. */
  alt: string;
  className?: string;
  /**
   * "none" para todo lo que este bajo el pliegue: el poster se pinta al
   * instante y el video solo se descarga cuando el navegador arranca el
   * autoplay. Solo el hero justifica "metadata".
   */
  preload?: "none" | "metadata";
}

/**
 * Bucle de video decorativo con poster.
 *
 * Los clips pesan varios MB, asi que el poster no es un adorno: es el
 * fotograma que se pinta primero y el que cuenta como LCP. Sin el, el hero
 * volveria al problema que tenia el video anterior de 6.3 MB.
 *
 * Con prefers-reduced-motion no se monta el <video> en absoluto y se queda
 * el poster fijo. Es contenido decorativo: nada de lo que se cuenta aqui
 * existe solo en el video.
 */
export function VideoLoop({ nombre, alt, className = "", preload = "none" }: VideoLoopProps) {
  const reducirMovimiento = useReducedMotion();
  const poster = `/videos/${nombre}-poster.webp`;

  if (reducirMovimiento) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt={alt} className={`h-full w-full object-cover ${className}`} />;
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload={preload}
      poster={poster}
      aria-label={alt}
      className={`h-full w-full object-cover ${className}`}
    >
      <source src={`/videos/${nombre}.mp4`} type="video/mp4" />
    </video>
  );
}
