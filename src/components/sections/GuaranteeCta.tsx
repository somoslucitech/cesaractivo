import { SealCheck } from "@phosphor-icons/react/dist/ssr";
import { CtaButton } from "@/components/checkout/CtaButton";

export function GuaranteeCta() {
  return (
    <section className="bg-crema/50 py-16 sm:py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-4 text-center sm:px-6">
        <SealCheck size={44} weight="duotone" className="text-azul" />
        <h2 className="font-display text-3xl text-texto-oscuro md:text-4xl">
          Una semana para reconfigurar tu salud, sin riesgos
        </h2>
        <p className="text-base text-texto-medio sm:text-lg">
          Si implementas las pautas del metodo al 100% durante los 7 dias, veras y sentiras la
          desinflamacion en tu cuerpo. Te entregamos las herramientas, las guias y nuestra
          presencia diaria en los chats para asegurar tu proceso.
        </p>
        <CtaButton className="mt-2" />
      </div>
    </section>
  );
}
