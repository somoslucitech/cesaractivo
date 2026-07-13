const DIFFERENTIATORS = [
  {
    n: "01",
    title: "Tu biologia real",
    body: "Disenado para la salud hormonal y metabolica de la mujer a partir de los 40.",
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
    body: "Un grupo de enfoque activo y un coach respondiendo tus dudas cada dia.",
  },
  {
    n: "05",
    title: "Resultados en dias, no meses",
    body: "En 7 dias sientes un cambio fisico visible y un pico de energia celular.",
  },
];

export function DifferentiationMatrix() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="max-w-xl font-display text-3xl text-texto-oscuro md:text-4xl">
          Por que este metodo y no un sistema tradicional
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
          {DIFFERENTIATORS.map(({ n, title, body }) => (
            <div key={n} className="flex gap-4 border-t border-crema pt-5">
              <span className="font-display text-2xl text-amarillo-oscuro">{n}</span>
              <div>
                <h3 className="font-display text-lg text-texto-oscuro">{title}</h3>
                <p className="mt-1 text-sm text-texto-medio">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
