import type { Embudo as DatosEmbudo } from "@/lib/stats";

const PASOS: { clave: keyof DatosEmbudo; etiqueta: string; nota: string }[] = [
  { clave: "visitantes", etiqueta: "Entraron", nota: "personas distintas que vieron la página" },
  { clave: "abrieronCheckout", etiqueta: "Le dieron a comprar", nota: "abrieron el formulario" },
  { clave: "dejaronDatos", etiqueta: "Dejaron sus datos", nota: "nombre, correo y WhatsApp" },
  { clave: "eligieronMetodo", etiqueta: "Eligieron cómo pagar", nota: "llegaron a la pasarela" },
  { clave: "pagaron", etiqueta: "Pagaron", nota: "pago confirmado" },
];

function porcentaje(parte: number, total: number): string {
  if (total === 0) return "—";
  return `${Math.round((parte / total) * 100)}%`;
}

/**
 * El embudo de cinco pasos. Cada barra se mide contra el primer paso, no
 * contra el anterior: asi se ve de un vistazo que porcentaje del total llega
 * hasta cada punto, que es la pregunta que de verdad importa.
 */
export function Embudo({ datos }: { datos: DatosEmbudo }) {
  const tope = datos.visitantes || 1;

  return (
    <section className="rounded-3xl border border-linea bg-tarjeta p-6 shadow-[0_16px_36px_-24px_rgba(0,61,115,0.4)] sm:p-8">
      <h2 className="font-display text-xl text-tinta">El camino hasta la compra</h2>
      <p className="mt-1 text-sm text-tinta-suave">Últimos 30 días</p>

      <ol className="mt-6 flex flex-col gap-3">
        {PASOS.map(({ clave, etiqueta, nota }, i) => {
          const valor = datos[clave];
          const ancho = Math.max((valor / tope) * 100, valor > 0 ? 2 : 0);
          const anterior = i === 0 ? null : datos[PASOS[i - 1].clave];

          return (
            <li key={clave}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="text-sm font-medium text-tinta">{etiqueta}</span>
                <span className="text-sm text-tinta-suave">
                  <span className="font-display text-lg text-azul-texto">{valor}</span>
                  {anterior !== null && anterior > 0 && (
                    <span className="ml-2">{porcentaje(valor, anterior)} del paso anterior</span>
                  )}
                </span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-superficie-2">
                <div
                  className="h-full rounded-full bg-azul"
                  style={{ width: `${ancho}%` }}
                  role="presentation"
                />
              </div>
              <p className="mt-1 text-xs text-tinta-suave">{nota}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
