"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    instgrm?: {
      Embeds: { process: () => void };
    };
  }
}

interface InstagramReelEmbedProps {
  reelUrl: string;
}

/**
 * Tarjeta oficial de Instagram (oEmbed/blockquote) renderizada desde el
 * primer render, sin gate de click. embed.js se carga una sola vez para
 * las 3 tarjetas de la seccion (Next dedupea por src) y procesa todos los
 * blockquotes pendientes en la pagina.
 */
export function InstagramReelEmbed({ reelUrl }: InstagramReelEmbedProps) {
  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, []);

  return (
    <div className="w-full overflow-hidden bg-texto-oscuro/5 [&_iframe]:!w-full">
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onReady={() => window.instgrm?.Embeds.process()}
        onLoad={() => window.instgrm?.Embeds.process()}
      />
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={reelUrl}
        data-instgrm-version="14"
        style={{ margin: 0, width: "100%", minWidth: "unset" }}
      />
    </div>
  );
}
