import { Reveal } from "@/components/ui/Reveal";
import { STAGGER } from "@/lib/motion";

/**
 * Las cuatro cifras salen de hechos que ya estaban escritos en la propia
 * landing (CoachBio, OtherServices, Faq, ProductOffer). Ninguna es nueva:
 * la seccion existia pero renderizaba null, asi que la pagina no mostraba
 * un solo numero pese a tenerlos en el cuerpo del texto.
 *
 * TODO(cliente): faltan todavia las metricas de resultado (promedio de kilos
 * y centimetros, indice de satisfaccion). Cuando Cesar las confirme, se
 * agregan aca. No inventar ninguna.
 */
const STATS: { value: string; label: string }[] = [
  { value: "+800", label: "mujeres acompañadas en la Escuela de Alimentación" },
  { value: "14 años", label: "de trayectoria de César como coach" },
  { value: "40-70", label: "el rango de edad para el que se diseñó el método" },
  { value: "7 días", label: "de acompañamiento diario, de lunes a domingo" },
];

export function KeyStats() {
  if (STATS.length === 0) return null;

  return (
    <section className="bg-superficie-2 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
          {STATS.map(({ value, label }, index) => (
            <Reveal key={label} delay={index * STAGGER} className="text-center">
              <p className="font-display text-4xl text-azul-texto sm:text-5xl">{value}</p>
              <p className="mt-1.5 text-sm leading-snug text-tinta-suave">{label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
