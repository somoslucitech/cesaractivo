import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Salida del build de OpenNext para Cloudflare: es codigo generado, no
    // fuente. Sin esto, `npm run lint` reportaba mas de 13.000 problemas de
    // ficheros que nadie escribe a mano y ocultaba los de src/.
    ".open-next/**",
    // Temporales de wrangler (los crea `npm run preview`). Mismo caso.
    ".wrangler/**",
  ]),
]);

export default eslintConfig;
