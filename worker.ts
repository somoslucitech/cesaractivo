// Entrada del Worker: envuelve el que genera OpenNext.
//
// Los escaneres de vulnerabilidades piden cientos de rutas inventadas
// (/.env, /wp-login.php, /boot.ini...). Cada una arrancaba Next para pintar
// la pagina 404 (20-200 ms de CPU) y en las rafagas Cloudflare cortaba
// peticiones por exceso de CPU. Aqui solo pasan a Next las rutas que existen;
// el resto recibe la 404 ya generada en el build (scripts/copiar-404.mjs).
//
// Los archivos de public/ y /_next/static los sirve Cloudflare antes de
// llegar aqui. Si se agrega una pagina nueva, hay que sumarla a PAGINAS.

// ts-ignore y no ts-expect-error: si ya hubo un build, el archivo existe y
// no hay error que esperar.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: .open-next/worker.js se genera en el build
import handler from "./.open-next/worker.js";

const PAGINAS = new Set([
  "/",
  "/privacidad",
  "/terminos",
  "/gracias",
  "/robots.txt",
  "/sitemap.xml",
  "/opengraph-image",
]);

type Env = { ASSETS: Fetcher; ADMIN_PATH?: string };

function esRutaDeNext(pathname: string, adminPath: string | undefined): boolean {
  // Sin la barra final: Next redirige /privacidad/ a /privacidad.
  const ruta = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (PAGINAS.has(ruta)) return true;
  if (ruta.startsWith("/api/") || ruta.startsWith("/_next/")) return true;
  return !!adminPath && (ruta === `/${adminPath}` || ruta.startsWith(`/${adminPath}/`));
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const { pathname } = new URL(request.url);
    if (esRutaDeNext(pathname, env.ADMIN_PATH)) {
      return handler.fetch(request, env, ctx);
    }

    // "/404" y no "/404.html": los assets redirigen las rutas con .html.
    const pagina = await env.ASSETS.fetch(new URL("/404", request.url));
    return new Response(request.method === "HEAD" ? null : pagina.body, {
      status: 404,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    });
  },
};

export default worker;
