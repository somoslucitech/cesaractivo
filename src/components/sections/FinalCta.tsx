import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { CtaButton } from "@/components/checkout/CtaButton";
import { Reveal } from "@/components/ui/Reveal";

const BENEFITS = [
  "Recupera tu vitalidad diaria",
  "Come rico y saludable, sin pasar hambre",
  "Controla tus primeros 2 o 3 kg",
  "Reduce hasta 5 cm de cintura",
  "Acompañamiento humano diario",
  "Resultados en solo 7 días",
];

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-azul py-24 text-blanco-calido sm:py-32">
      <div className="pointer-events-none absolute -top-24 -right-16 h-[28rem] w-[28rem] rounded-full bg-azul-oscuro/50 blur-[120px]" />
      <Reveal className="relative mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 text-center sm:px-6">
        <h2 className="font-display text-3xl leading-snug sm:text-4xl md:text-5xl">
          Tu salud de los próximos 10 años se decide hoy
        </h2>

        <ul className="grid grid-cols-1 gap-x-8 gap-y-3 text-left sm:grid-cols-2">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2.5">
              <CheckCircle size={20} weight="fill" className="shrink-0 text-amarillo" />
              <span className="text-blanco-calido/90">{benefit}</span>
            </li>
          ))}
        </ul>

        <CtaButton />
      </Reveal>
    </section>
  );
}
