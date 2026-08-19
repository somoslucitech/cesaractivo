import { ArrowUpRight, GraduationCap, Barbell } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { whatsappUrl, otroServicioMessage } from "@/lib/contact";
import { STAGGER } from "@/lib/motion";

/**
 * Copy tomada de hechos ya publicados en otras secciones (CoachBio, Faq),
 * no inventada: mas de 800 graduadas y los horarios de Team Puro Power ya
 * se mencionan en el resto de la landing. Precio: pendiente de confirmar
 * con el cliente, por eso no aparece ninguno aca todavia. Si Cesar quiere
 * mas programas listados o precios, se agregan como un item mas de este
 * array.
 */
const SERVICIOS = [
  {
    // GraduationCap y no ForkKnife: el icono de comida hacia falta dentro del
    // Detox5, que es el producto que se vende en esta pagina. Aca encaja mejor
    // porque la Escuela se cursa y se gradua.
    icon: GraduationCap,
    title: "Escuela de Alimentación",
    body: "El programa completo de nutrición de César: más de 800 mujeres ya se graduaron aprendiendo a comer comida real para sanar su metabolismo, sin dietas restrictivas ni suplementos.",
  },
  {
    // Barbell si corresponde aca: este si es el programa de entrenamiento.
    icon: Barbell,
    title: "Team Puro Power Online",
    body: "Más de 18 horarios de clases en vivo por semana, streaming o presencial en el Parque del Este de lunes a viernes, más el Encuentro de Bienestar comunitario los domingos desde las 7:00 am.",
  },
] as const;

export function OtherServices() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-acento">
            Más allá del Detox5
          </p>
          <h2 className="mt-3 font-display text-3xl text-tinta md:text-4xl">
            Otros programas de César
          </h2>
          <p className="mt-4 text-base text-tinta-suave sm:text-lg">
            Si el Detox5 es tu punto de partida, estos son los programas donde continúa el
            acompañamiento.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {SERVICIOS.map(({ icon: Icon, title, body }, index) => (
            <Reveal
              key={title}
              as="div"
              delay={index * STAGGER}
              className="flex h-full flex-col rounded-3xl border border-linea bg-tarjeta p-6 shadow-[0_16px_36px_-24px_rgba(0,61,115,0.4)] sm:p-8"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-tinte-azul">
                <Icon size={24} weight="duotone" className="text-azul-texto" />
              </span>
              <h3 className="mt-4 font-display text-xl text-tinta">{title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-tinta-suave">{body}</p>
              <a
                href={whatsappUrl(otroServicioMessage(title))}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-azul-texto transition-colors duration-150 hover:text-azul"
              >
                Preguntar por WhatsApp
                <ArrowUpRight size={16} />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
