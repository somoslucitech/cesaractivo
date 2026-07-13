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
  title: "Detox5 | Cesar Activo Coach",
  description:
    "Rompe el estancamiento, desinflama tu cuerpo y recupera tu vitalidad en solo 7 dias con el Plan Detox5 de Cesar Activo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-blanco-calido text-texto-oscuro">
        <CheckoutProvider>{children}</CheckoutProvider>
      </body>
    </html>
  );
}
