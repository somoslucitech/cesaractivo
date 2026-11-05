// Copia la 404 que Next genera en el build a los archivos estaticos, para que
// worker.ts la sirva sin arrancar Next. Va despues de `opennextjs-cloudflare
// build`: es de ese mismo build, asi que sus /_next/static coinciden.
import { copyFileSync } from "node:fs";

copyFileSync(".next/server/app/_not-found.html", ".open-next/assets/404.html");
console.log("404 estatica copiada a .open-next/assets/404.html");
