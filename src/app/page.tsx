import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { WhatsappBubble } from "@/components/layout/WhatsappBubble";
import { Hero } from "@/components/sections/Hero";
import { ProblemAgitation } from "@/components/sections/ProblemAgitation";
import { ParadigmShift } from "@/components/sections/ParadigmShift";
import { ProductOffer } from "@/components/sections/ProductOffer";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { DifferentiationMatrix } from "@/components/sections/DifferentiationMatrix";
import { InternationalLogistics } from "@/components/sections/InternationalLogistics";
import { CoachBio } from "@/components/sections/CoachBio";
import { GuaranteeCta } from "@/components/sections/GuaranteeCta";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProblemAgitation />
        <ParadigmShift />
        <ProductOffer />
        <SuccessStories />
        <DifferentiationMatrix />
        <InternationalLogistics />
        <CoachBio />
        <GuaranteeCta />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <WhatsappBubble />
    </>
  );
}
