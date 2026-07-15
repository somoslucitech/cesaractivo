import { SealCheck } from "@phosphor-icons/react/dist/ssr";
import { CtaButton } from "@/components/checkout/CtaButton";
import { Reveal } from "@/components/ui/Reveal";

export function GuaranteeCta() {
  return (
    <section className="bg-crema/50 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-[2.5rem] border border-amarillo/40 bg-blanco-calido px-6 py-12 text-center shadow-[0_24px_50px_-20px_rgba(200,168,0,0.35)] sm:px-12">
            <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-amarillo/15 blur-3xl" />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-amarillo-claro">
              <SealCheck size={36} weight="duotone" className="text-azul" />
            </span>
            <h2 className="relative font-display text-3xl text-texto-oscuro md:text-4xl">
              Una semana para reconfigurar tu salud, sin riesgos
            </h2>
            <p className="relative text-base text-texto-medio sm:text-lg">
              Si implementas las pautas del método al 100% durante los 7 días, verás y sentirás
              la desinflamación en tu cuerpo. Te entregamos las herramientas, las guías y nuestra
              presencia diaria en los chats para asegurar tu proceso.
            </p>
            <CtaButton className="relative mt-2" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
