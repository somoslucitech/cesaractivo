import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sin optimizacion server-side por ahora: next/image sirve <img> directo.
  // Cuando el cliente habilite Cloudflare Images en su zona se puede migrar
  // a un loader custom (ver https://opennext.js.org/cloudflare/howtos/image).
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
