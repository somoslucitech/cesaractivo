// Copia los ajustes de precio de la D1 de produccion a la D1 local antes del
// build. La portada se genera en el build leyendo la base, y durante el build
// OpenNext solo ve la D1 local: sin este paso se publicaria con los precios de
// la maquina que compila. Si algo falla, el deploy se corta aqui.
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const DB = "cesaractivo-leads";
// Se llama al bin con node y sin shell: con npx en Windows hace falta shell,
// y la shell rompe los argumentos con espacios y comillas (el SQL).
// wrangler no exporta su bin, asi que se llega desde su entrada principal.
const WRANGLER = join(
  dirname(createRequire(import.meta.url).resolve("wrangler")),
  "..",
  "bin",
  "wrangler.js",
);

function wrangler(...args) {
  return execFileSync(process.execPath, [WRANGLER, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });
}

const sqlTexto = (v) => (v === null ? "NULL" : `'${String(v).replaceAll("'", "''")}'`);

const [{ results: filas }] = JSON.parse(
  wrangler("d1", "execute", DB, "--remote", "--json", "--command", "SELECT key, value, updated_at FROM settings"),
);

wrangler("d1", "migrations", "apply", DB, "--local");

// updated_by queda en NULL: apunta a admins, que en local no tienen por que existir.
const sentencias = [
  "DELETE FROM settings;",
  ...filas.map(
    (f) =>
      `INSERT INTO settings (key, value, updated_at, updated_by) VALUES (${sqlTexto(f.key)}, ${sqlTexto(f.value)}, ${Number(f.updated_at)}, NULL);`,
  ),
];
wrangler("d1", "execute", DB, "--local", "--command", sentencias.join(" "));

console.log(`Precios de produccion copiados a la D1 local (${filas.length} ajustes).`);
