import Link from "next/link";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { cf } from "@/lib/cloudflare";
import { listarLeads } from "@/lib/stats";
import { whatsappUrlDe } from "@/lib/contact";
import { MarcarPagado } from "@/components/admin/MarcarPagado";

export const dynamic = "force-dynamic";

const FILTROS = [
  { valor: "", etiqueta: "Todas" },
  { valor: "pending", etiqueta: "Cerca de comprar" },
  { valor: "paid", etiqueta: "Pagaron" },
] as const;

const METODOS: Record<string, string> = {
  paypal: "PayPal",
  apolopay: "Cripto",
  zelle: "Zelle",
  pago_movil: "Pago Móvil",
  otro: "Otro",
};

function fecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-VE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function PaginaLeads({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { env } = await cf();
  const base = `/${env.ADMIN_PATH}`;
  const { estado } = await searchParams;

  const valido = estado === "pending" || estado === "paid" ? estado : undefined;
  const leads = await listarLeads({ estado: valido, limite: 200 });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-tinta">Personas</h1>
        <p className="mt-1 text-sm text-tinta-suave">
          Todo el que dejó su contacto en la página, de lo más reciente a lo más antiguo.
        </p>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Filtrar por estado">
        {FILTROS.map((f) => {
          const activo = (valido ?? "") === f.valor;
          return (
            <Link
              key={f.etiqueta}
              href={f.valor ? `${base}/leads?estado=${f.valor}` : `${base}/leads`}
              aria-current={activo ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-[var(--dur-hover)] ${
                activo
                  ? "bg-tinte-azul text-azul-texto"
                  : "border border-linea text-tinta-suave hover:text-tinta"
              }`}
            >
              {f.etiqueta}
            </Link>
          );
        })}
      </nav>

      {leads.length === 0 ? (
        <p className="rounded-3xl border border-linea bg-tarjeta p-8 text-sm text-tinta-suave">
          No hay registros con ese filtro todavía.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {leads.map((lead) => {
            const pagado = lead.payment_status === "paid";
            const importe =
              lead.currency === "eur" ? `€${lead.amount_eur ?? 0}` : `$${lead.amount_usd}`;

            return (
              <li
                key={lead.id}
                className="rounded-3xl border border-linea bg-tarjeta p-5 shadow-[0_16px_36px_-24px_rgba(0,61,115,0.4)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-tinta">{lead.name}</p>
                    <p className="truncate text-sm text-tinta-suave">{lead.email}</p>
                    <p className="text-sm text-tinta-suave">{lead.whatsapp}</p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        pagado ? "bg-tinte-azul text-azul-texto" : "bg-tinte-amarillo text-acento"
                      }`}
                    >
                      {pagado ? "Pagó" : "Cerca de comprar"}
                    </span>
                    <p className="mt-1.5 font-display text-lg text-tinta">{importe}</p>
                    <p className="text-xs text-tinta-suave">
                      {lead.payment_method ? METODOS[lead.payment_method] : "sin método"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-linea pt-3">
                  <span className="text-xs text-tinta-suave">
                    Registro: {fecha(lead.created_at)}
                  </span>
                  {lead.paid_at && (
                    <span className="text-xs text-tinta-suave">Pago: {fecha(lead.paid_at)}</span>
                  )}
                  {lead.country && (
                    <span className="text-xs text-tinta-suave">{lead.country}</span>
                  )}

                  <div className="ml-auto flex flex-wrap items-center gap-2">
                    <a
                      href={whatsappUrlDe(
                        lead.whatsapp,
                        `Hola ${lead.name.split(" ")[0]}, te escribo del equipo de César Activo por tu registro en el Plan Detox5.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white transition-transform duration-[var(--dur-press)] ease-signature active:scale-[0.97]"
                    >
                      <WhatsappLogo size={14} weight="fill" />
                      Escribirle
                    </a>
                    {!pagado && <MarcarPagado leadId={lead.id} nombre={lead.name} />}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
