import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import { CheckoutProvider } from "@/components/checkout/checkout-context";
import { PageTracker } from "@/components/PageTracker";
import { MetaPixel } from "@/components/MetaPixel";
import { BannerCookies } from "@/components/BannerCookies";
import { obtenerConfigPrecio } from "@/lib/settings";
import { cf } from "@/lib/cloudflare";
import "./globals.css";

/**
 * Dos familias con roles distintos (pedido del cliente: que se note la
 * jerarquia entre titulo, subtitulo y cuerpo, y que no se sienta generica).
 *
 * Newsreader es una serif editorial de contraste bajo y letra ancha para
 * h1/h2/h3. Se eligio sobre Fraunces porque a igual cuerpo es bastante mas
 * legible (aperturas mas abiertas), algo que pesa con un publico de 40 a 70
 * anos, y porque al ser mas ancha el titular del hero cae en dos lineas en
 * vez de tres.
 *
 * Inter cubre cuerpo, subtitulos y UI porque es extremadamente legible en
 * texto largo y deja que el serif sea lo unico que aporte personalidad.
 */
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["600", "700"],
  // Sin italic: no se usa cursiva en ninguna parte del proyecto, asi que
  // cargarla solo anadiria peso a la descarga.
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Dominio confirmado por el cliente (2026-09-18). metadataBase es obligatorio
 * para que og:image salga como URL absoluta; con una URL relativa WhatsApp y
 * Facebook no la resuelven.
 */
const SITE_URL = "https://cesaractivo.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Detox5 | Plan de alimentación de 7 días con César Activo",
  description:
    "7 días de comida real para desinflamar y reiniciar tu metabolismo, para mujeres de 40 a 70. Sin pasar hambre, sin suplementos y con acompañamiento diario por WhatsApp.",
  // El trafico llega por WhatsApp e Instagram y hasta ahora los enlaces se
  // compartian sin vista previa. La imagen la genera src/app/opengraph-image.tsx.
  openGraph: {
    type: "website",
    locale: "es_VE",
    url: SITE_URL,
    siteName: "César Activo",
    title: "Detox5 | 7 días de comida real para reiniciar tu metabolismo",
    description:
      "Plan de alimentación de 7 días para mujeres de 40 a 70. Comida que consigues en tu mercado, sin pasar hambre ni suplementos, con acompañamiento diario.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Detox5 | 7 días de comida real para reiniciar tu metabolismo",
    description:
      "Plan de alimentación de 7 días para mujeres de 40 a 70, con acompañamiento diario por WhatsApp.",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

/**
 * Corre de forma sincrona antes del primer pintado: si el usuario forzo un
 * tema con el selector, lo aplica ya. Sin esto, alguien con el SO en claro
 * que eligio oscuro veria la pagina clara y saltaria a oscura al hidratar.
 * La clave "tema" debe coincidir con CLAVE_TEMA de SelectorTema.tsx.
 */
const SCRIPT_TEMA = `try{var t=localStorage.getItem("tema");if(t==="claro"||t==="oscuro"){document.documentElement.dataset.theme=t==="claro"?"light":"dark"}}catch(e){}`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // La configuracion se lee aqui, en el servidor, y baja por props hasta el
  // contexto, que calcula el precio de la moneda elegida. Asi una sola
  // consulta sirve a todos los sitios donde aparece el precio y cambiar de
  // moneda no necesita ida y vuelta al servidor.
  const config = await obtenerConfigPrecio();
  const { env } = await cf();

  // Ojo: nada de h-full en <html>. Un height:100% fijo ahi rompe el scroll
  // por anclas (#plan, #cesar...). Era un resto del scaffold de Next.js.
  return (
    // suppressHydrationWarning: el script de abajo escribe data-theme antes
    // de que React hidrate, asi que el atributo no coincide con el HTML del
    // servidor. Es esperado.
    <html
      lang="es"
      className={`${newsreader.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body className="flex min-h-[100dvh] flex-col bg-superficie text-tinta">
        <PageTracker />
        <MetaPixel pixelId={env.META_PIXEL_ID} />
        <CheckoutProvider config={config}>{children}</CheckoutProvider>
        <BannerCookies pixelId={env.META_PIXEL_ID} />
      </body>
    </html>
  );
}
