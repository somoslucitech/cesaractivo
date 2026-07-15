import Image from "next/image";
import { WhatsappLogo, GlobeHemisphereWest } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";

export function InternationalLogistics() {
  return (
    <section className="bg-crema/50 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="grid grid-cols-1 overflow-hidden rounded-[2.5rem] bg-azul-oscuro text-blanco-calido shadow-[0_30px_60px_-24px_rgba(0,61,115,0.55)] lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-center gap-5 p-8 sm:p-12">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blanco-calido/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-blanco-calido/80">
                <GlobeHemisphereWest size={16} weight="fill" className="text-amarillo" />
                Ecosistema global
              </span>
              <h2 className="font-display text-3xl md:text-4xl">¿Y si vives fuera de Venezuela?</h2>
              <p className="text-base text-blanco-calido/80 sm:text-lg">
                El control nutricional, el soporte y la entrega de guías se ejecutan 100% remoto
                por WhatsApp, sin importar tu zona horaria.
              </p>
              <p className="text-base text-blanco-calido/80 sm:text-lg">
                Compras tus alimentos locales con la lista inteligente y recibes feedback diario
                del coach. Las rutinas se adaptan para hacerlas desde casa o cualquier espacio
                libre de tu rutina.
              </p>
              <div className="mt-2 flex items-center gap-2.5 text-sm font-medium text-blanco-calido/90">
                <WhatsappLogo size={22} weight="fill" className="text-amarillo" />
                Acompañamiento diario de lunes a domingo
              </div>
            </div>

            <div className="relative min-h-[20rem] bg-azul">
              <Image
                src="/photos/logistics-cesar.webp"
                alt="César Villegas listo para entrenar donde estés"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-contain object-bottom"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
