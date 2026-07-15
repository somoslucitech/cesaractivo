import { Lightning } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";

const DIFFERENTIATORS = [
  {
    n: "01",
    title: "Tu biología real",
    body: "Diseñado para la salud hormonal y metabólica de la mujer a partir de los 40.",
  },
  {
    n: "02",
    title: "Comida real como medicina",
    body: "Combinas alimentos cotidianos para desinflamar, sin batidos ni suplementos costosos.",
  },
  {
    n: "03",
    title: "Ingredientes accesibles",
    body: "Nada de productos importados ni recetas raras. Todo lo encuentras en tu mercado.",
  },
  {
    n: "04",
    title: "Cero aislamiento",
    body: "Un grupo de enfoque activo y un coach respondiendo tus dudas cada día.",
  },
];

export function DifferentiationMatrix() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amarillo-oscuro">
            La diferencia
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl text-texto-oscuro md:text-4xl">
            ¿Por qué este método y no un sistema tradicional?
          </h2>
          <p className="mt-4 max-w-2xl text-base text-texto-medio sm:text-lg">
            A diferencia de las aplicaciones de fitness, los gimnasios saturados o las dietas de
            moda impresas en hojas genéricas, el Plan Detox5 ataca la raíz del problema de forma
            integrada:
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
          {DIFFERENTIATORS.map(({ n, title, body }, index) => (
            <Reveal key={n} as="div" delay={index * 0.08} className="flex gap-5 border-t border-crema pt-6">
              <span className="font-display text-3xl leading-none text-amarillo-oscuro">{n}</span>
              <div>
                <h3 className="font-display text-lg text-texto-oscuro">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-texto-medio">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-8">
          <div className="flex flex-col items-start gap-5 rounded-3xl bg-azul px-8 py-8 text-blanco-calido shadow-[0_20px_40px_-16px_rgba(0,61,115,0.5)] sm:flex-row sm:items-center sm:gap-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blanco-calido/15">
              <Lightning size={28} weight="fill" className="text-amarillo" />
            </span>
            <div>
              <h3 className="font-display text-xl sm:text-2xl">Resultados en días, no en meses</h3>
              <p className="mt-1.5 text-sm text-blanco-calido/85 sm:text-base">
                En 7 días sientes un cambio físico visible y un pico de energía celular.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
