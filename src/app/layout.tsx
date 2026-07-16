import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { CheckoutProvider } from "@/components/checkout/checkout-context";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Detox5 | César Activo de Bienestar",
  description:
    "Rompe el estancamiento, desinflama tu cuerpo y recupera tu vitalidad en solo 7 días con el Plan Detox5 de César Activo.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ojo: nada de h-full en <html>. Un height:100% fijo ahi rompe el scroll
  // por anclas (#plan, #cesar...). Era un resto del scaffold de Next.js.
  return (
    <html lang="es" className={`${spaceGrotesk.variable} antialiased`}>
      <body className="flex min-h-[100dvh] flex-col bg-blanco-calido text-texto-oscuro">
        <CheckoutProvider>{children}</CheckoutProvider>
      </body>
    </html>
  );
}
