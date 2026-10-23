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
import { obtenerConfigPrecio } from "@/lib/settings";

export default async function Home() {
  // Misma lectura que el layout: el precio del JSON-LD tiene que coincidir
  // con el que se ve en la pagina.
  const config = await obtenerConfigPrecio();

  return (
    <>
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
    </>
  );
}
