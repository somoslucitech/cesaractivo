import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { CtaButton } from "@/components/checkout/CtaButton";

const BENEFITS = [
  "Recupera tu vitalidad diaria",
  "Come rico y saludable, sin pasar hambre",
  "Controla tus primeros 2 o 3 kg",
  "Reduce hasta 5 cm de cintura",
  "Acompanamiento humano diario",
  "Resultados en solo 7 dias",
];

export function FinalCta() {
  return (
    <section className="bg-azul py-20 text-blanco-calido sm:py-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 text-center sm:px-6">
        <h2 className="font-display text-3xl leading-snug sm:text-4xl">
          Tu salud de los proximos 10 anos se decide hoy
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
      </div>
    </section>
  );
}
