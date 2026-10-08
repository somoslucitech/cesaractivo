import type { DiaVisitas } from "@/lib/stats";

/**
 * Barras de visitantes por dia, hechas a mano con Tailwind.
 *
 * Sin librería de gráficos a propósito: Recharts o Chart.js pesan cientos de
 * kilobytes por un gráfico de barras, y el bundle del Worker tiene un límite
 * de 3 MiB. Esto son treinta divs.
 *
 * Es un Server Component: la pista al pasar el ratón va en el atributo
 * `title`, que el navegador resuelve solo y no necesita JavaScript.
 */
export function GraficoVisitas({ datos }: { datos: DiaVisitas[] }) {
  const tope = Math.max(...datos.map((d) => d.visitantes), 1);
  const total = datos.reduce((suma, d) => suma + d.visitantes, 0);

  return (
    <section className="rounded-3xl border border-linea bg-tarjeta p-6 shadow-[0_16px_36px_-24px_rgba(0,61,115,0.4)] sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl text-tinta">Visitantes por día</h2>
        <p className="text-sm text-tinta-suave">
          <span className="font-display text-lg text-azul-texto">{total}</span> en 30 días
        </p>
      </div>

      {total === 0 ? (
        <p className="mt-6 rounded-2xl bg-superficie-2 p-4 text-sm text-tinta-suave">
          Todavía no hay visitas registradas. Empezarán a aparecer en cuanto alguien entre a la
          página.
        </p>
      ) : (
        <>
          <div className="mt-6 flex h-32 items-end gap-[3px]" role="img"
               aria-label={`Visitantes por día durante los últimos 30 días. Total ${total}.`}>
            {datos.map((d) => (
              <span
                key={d.dia}
                title={`${d.dia}: ${d.visitantes} ${d.visitantes === 1 ? "visitante" : "visitantes"}`}
                className="flex-1 rounded-t-sm bg-azul/80 transition-colors duration-[var(--dur-hover)] hover:bg-azul"
                style={{ height: `${Math.max((d.visitantes / tope) * 100, 1.5)}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-tinta-suave">
            <span>{datos[0]?.dia}</span>
            <span>{datos[datos.length - 1]?.dia}</span>
          </div>
        </>
      )}
    </section>
  );
}
