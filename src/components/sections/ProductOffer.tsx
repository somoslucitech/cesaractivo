import {
  ClipboardText,
  FileMagnifyingGlass,
  Barbell,
  ChatsCircle,
  VideoCamera,
} from "@phosphor-icons/react/dist/ssr";
import { CtaButton } from "@/components/checkout/CtaButton";

const INCLUSIONS = [
  {
    icon: ClipboardText,
    title: "Diagnostico metabolico inicial",
    body: "Apertura de tu ficha digital con el metodo C.A.D.D.: peso, medidas y antecedentes de salud para conocer tu punto de partida.",
    bg: "bg-azul-suave",
    span: "sm:col-span-2",
  },
  {
    icon: FileMagnifyingGlass,
    title: "Guia y lista de compras",
    body: "Que buscar en el supermercado. Comida real y accesible, sin suplementos costosos.",
    bg: "bg-crema",
  },
  {
    icon: Barbell,
    title: "Rutinas adaptadas",
    body: "Movilidad y fuerza segun tu condicion real, desde casa o al aire libre.",
    bg: "bg-amarillo-claro",
  },
  {
    icon: ChatsCircle,
    title: "Factor humano en WhatsApp",
    body: "Acompanamiento y feedback de lunes a domingo, 5:30 a 9:00 am con el coach de guardia.",
    bg: "bg-crema",
  },
  {
    icon: VideoCamera,
    title: "Live dominical de arranque",
    body: "Sesion en vivo para despejar dudas antes de iniciar tu semana de accion.",
    bg: "bg-azul-suave",
  },
];

export function ProductOffer() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="shrink-0 rounded-2xl bg-azul px-6 py-4 text-blanco-calido">
            <p className="text-sm text-blanco-calido/80">Acceso completo</p>
            <p className="font-display text-3xl">$18</p>
          </div>
          <div className="max-w-xl">
            <h2 className="font-display text-3xl text-texto-oscuro md:text-4xl">
              Plan Detox5: tu nuevo punto de partida
            </h2>
            <p className="mt-3 text-base text-texto-medio sm:text-lg">
              Una semana cerrada para resetear tu metabolismo, bajar los primeros kilos y
              recuperar tu vitalidad diaria. No es una dieta.
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {INCLUSIONS.map(({ icon: Icon, title, body, bg, span }) => (
            <div key={title} className={`rounded-2xl ${bg} p-6 ${span ?? ""}`}>
              <Icon size={26} weight="duotone" className="text-azul-oscuro" />
              <h3 className="mt-3 font-display text-xl text-texto-oscuro">{title}</h3>
              <p className="mt-1.5 text-sm text-texto-medio">{body}</p>
            </div>
          ))}
        </div>

        <CtaButton className="mt-10" />
      </div>
    </section>
  );
}
