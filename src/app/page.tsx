import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { WhatsappBubble } from "@/components/layout/WhatsappBubble";
import { Hero } from "@/components/sections/Hero";
import { ProblemAgitation } from "@/components/sections/ProblemAgitation";
import { ParadigmShift } from "@/components/sections/ParadigmShift";
import { ProductOffer } from "@/components/sections/ProductOffer";
import { KeyStats } from "@/components/sections/KeyStats";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { DifferentiationMatrix } from "@/components/sections/DifferentiationMatrix";
import { InternationalLogistics } from "@/components/sections/InternationalLogistics";
import { CoachBio } from "@/components/sections/CoachBio";
import { OtherServices } from "@/components/sections/OtherServices";
import { GuaranteeCta } from "@/components/sections/GuaranteeCta";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/JsonLd";
import { CheckoutProvider } from "@/components/checkout/checkout-context";
import { obtenerConfigPrecio } from "@/lib/settings";

// La portada es estatica: se genera una vez y OpenNext la sirve desde KV sin
// renderizar. Se regenera al guardar precios en el panel (revalidatePath en
// /api/admin/settings/pricing) y, por si una oferta empieza o termina por
// fecha, como mucho una vez por hora.
export const revalidate = 3600;

export default async function Home() {
  // Una sola lectura para el contexto de compra y el JSON-LD: el precio de
  // los datos estructurados tiene que coincidir con el que se ve.
  const config = await obtenerConfigPrecio();

  return (
    <CheckoutProvider config={config}>
      <JsonLd config={config} />
      <Nav />
      <main>
        <Hero />
        <ProblemAgitation />
        <ParadigmShift />
        <ProductOffer />
        <KeyStats />
        <SuccessStories />
        <DifferentiationMatrix />
        <InternationalLogistics />
        <CoachBio />
        <OtherServices />
        <GuaranteeCta />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <WhatsappBubble />
    </CheckoutProvider>
  );
}
