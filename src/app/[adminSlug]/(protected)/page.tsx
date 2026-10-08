import Link from "next/link";
import { CurrencyDollar, Clock, SealCheck, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { cf } from "@/lib/cloudflare";
import { obtenerEmbudo, obtenerIngresos, obtenerVisitasPorDia, listarLeads } from "@/lib/stats";
import { Embudo } from "@/components/admin/Embudo";
import { GraficoVisitas } from "@/components/admin/GraficoVisitas";
import { whatsappUrlDe } from "@/lib/contact";

export const dynamic = "force-dynamic";

function antiguedad(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const horas = Math.floor(ms / 3_600_000);
  if (horas < 1) return "hace menos de 1 h";
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  return `hace ${dias} ${dias === 1 ? "día" : "días"}`;
}

export default async function PanelResumen() {
  const { env } = await cf();
  const base = `/${env.ADMIN_PATH}`;

  // En paralelo: son cuatro consultas independientes contra la misma base.
  const [embudo, ingresos, visitas, ultimos] = await Promise.all([
    obtenerEmbudo(30),
    obtenerIngresos(),
    obtenerVisitasPorDia(30),
    listarLeads({ estado: "pending", limite: 8 }),
  ]);

  const tarjetas = [
    {
      icono: SealCheck,
      etiqueta: "Ventas confirmadas",
      valor: `${ingresos.pagadosUsd + ingresos.pagadosEur}`,
      pie: "desde el inicio",
    },
    {
      icono: CurrencyDollar,
      etiqueta: "Ingresos",
      // USD y EUR no se suman: son importes fijos por moneda, no una
      // conversion en vivo. Sumarlos daria un numero que no significa nada.
      valor: `$${ingresos.totalUsd}`,
      pie: ingresos.totalEur > 0 ? `y €${ingresos.totalEur} en euros` : "en dólares",
    },
    {
      icono: Clock,
      etiqueta: "Cerca de comprar",
      valor: `${ingresos.cercaDeComprar}`,
      pie: "dejaron datos, sin pagar",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tarjetas.map(({ icono: Icono, etiqueta, valor, pie }) => (
          <div
            key={etiqueta}
            className="rounded-3xl border border-linea bg-tarjeta p-6 shadow-[0_16px_36px_-24px_rgba(0,61,115,0.4)]"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-tinte-azul">
              <Icono size={20} weight="duotone" className="text-azul-texto" />
            </span>
            <p className="mt-4 font-display text-3xl text-tinta">{valor}</p>
            <p className="mt-0.5 text-sm font-medium text-tinta">{etiqueta}</p>
            <p className="text-xs text-tinta-suave">{pie}</p>
          </div>
        ))}
      </div>

      <Embudo datos={embudo} />

      <GraficoVisitas datos={visitas} />

      <section className="rounded-3xl border border-linea bg-tarjeta p-6 shadow-[0_16px_36px_-24px_rgba(0,61,115,0.4)] sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-xl text-tinta">Quiénes se quedaron a medias</h2>
          <Link
            href={`${base}/leads`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-azul-texto transition-colors duration-[var(--dur-hover)] hover:text-azul"
          >
            Ver todas
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
        <p className="mt-1 text-sm text-tinta-suave">
          Dejaron su contacto y no completaron el pago. Son las personas a las que más rinde
          escribir.
        </p>

        {ultimos.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-superficie-2 p-4 text-sm text-tinta-suave">
            No hay nadie pendiente ahora mismo.
          </p>
        ) : (
          <ul className="mt-5 flex flex-col divide-y divide-linea">
            {ultimos.map((lead) => (
              <li key={lead.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
                <span className="font-medium text-tinta">{lead.name}</span>
                <span className="text-sm text-tinta-suave">{lead.email}</span>
                <span className="text-xs text-tinta-suave">{antiguedad(lead.created_at)}</span>
                <a
                  href={whatsappUrlDe(
                    lead.whatsapp,
                    `Hola ${lead.name.split(" ")[0]}, te escribo del equipo de César Activo por tu registro en el Plan Detox5.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-sm font-semibold text-azul-texto transition-colors duration-[var(--dur-hover)] hover:text-azul"
                >
                  Escribirle
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
