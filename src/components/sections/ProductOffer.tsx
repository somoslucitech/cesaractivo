import {
  ClipboardText,
  FileMagnifyingGlass,
  Barbell,
  ChatsCircle,
  VideoCamera,
} from "@phosphor-icons/react/dist/ssr";
import { CtaButton } from "@/components/checkout/CtaButton";
import { Reveal } from "@/components/ui/Reveal";

const INCLUSIONS = [
  {
    icon: ClipboardText,
    title: "Diagnóstico metabólico inicial",
    body: "Apertura de tu ficha digital con el método C.A.D.D.: peso, medidas y antecedentes de salud para conocer tu punto de partida.",
    bg: "bg-azul-suave",
    span: "sm:col-span-2",
  },
  {
    icon: FileMagnifyingGlass,
    title: "Guía y lista de compras",
    body: "Qué buscar en el supermercado. Comida real y accesible, sin suplementos costosos.",
    bg: "bg-crema",
  },
  {
    icon: Barbell,
    title: "Rutinas adaptadas",
    body: "Movilidad y fuerza según tu condición real, desde casa o al aire libre.",
    bg: "bg-amarillo-claro",
  },
  {
    icon: ChatsCircle,
    title: "Factor humano en WhatsApp",
    body: "Acompañamiento y feedback de lunes a domingo, 5:30 a 9:00 am con el coach de guardia.",
    bg: "bg-crema",
  },
  {
    icon: VideoCamera,
    title: "Live dominical de arranque",
    body: "Sesión en vivo para despejar dudas antes de iniciar tu semana de acción.",
    bg: "bg-azul-suave",
  },
];

export function ProductOffer() {
  return (
    <section id="plan" className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amarillo-oscuro">
            El programa
          </p>
          <h2 className="mt-3 font-display text-3xl text-texto-oscuro md:text-4xl">
            Plan Detox5: consigue el cambio que buscas en solo 7 días
          </h2>
          <p className="mt-4 text-base text-texto-medio sm:text-lg">
            Una semana cerrada de ejecución en nuestra comunidad diseñada específicamente para
            resetear tu metabolismo y balance hormonal, bajar esos primeros 2 o 3 kilos, reducir
            4 o 5 centímetros de cintura, eliminar la retención de líquidos y recuperar tu
            vitalidad diaria. No es una dieta, es un nuevo punto de partida.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {INCLUSIONS.map(({ icon: Icon, title, body, bg, span }, index) => (
            <Reveal
              key={title}
              as="div"
              delay={index * 0.06}
              className={span ?? ""}
            >
              <div
                className={`h-full rounded-3xl ${bg} p-6 shadow-[0_16px_36px_-24px_rgba(0,61,115,0.4)] transition-transform duration-200 ease-out hover:-translate-y-1`}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blanco-calido/70">
                  <Icon size={24} weight="duotone" className="text-azul-oscuro" />
                </span>
                <h3 className="mt-4 font-display text-xl text-texto-oscuro">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-texto-medio">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10">
          <div className="flex flex-col items-start gap-6 rounded-3xl border border-crema bg-blanco-calido p-6 shadow-[0_20px_44px_-24px_rgba(0,61,115,0.35)] sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-baseline gap-3">
              <p className="font-display text-5xl text-azul">$18</p>
              <p className="text-sm text-texto-medio">
                acceso completo
                <br />
                pago único
              </p>
            </div>
            <CtaButton />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
