import {
  ClipboardText,
  ForkKnife,
  FileMagnifyingGlass,
  ChatsCircle,
  VideoCamera,
  Timer,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { CtaButton } from "@/components/checkout/CtaButton";
import { VideoLoop } from "@/components/ui/VideoLoop";
import { PriceTag } from "@/components/checkout/PriceTag";
import { Reveal } from "@/components/ui/Reveal";
import { FOLLOW_THROUGH, STAGGER } from "@/lib/motion";

/**
 * Las cinco tarjetas son alimentacion y acompanamiento. El movimiento ya no
 * esta aqui dentro: tiene bloque propio debajo, con foto.
 * Antes el icono de comida (ForkKnife) estaba en OtherServices y aqui dentro
 * habia un Barbell, asi que la pieza central del producto se anunciaba con el
 * simbolo de un gimnasio. La guia y la lista de compras van separadas porque
 * son dos entregables distintos que el titulo anterior ya nombraba juntos.
 */
const INCLUSIONS = [
  {
    icon: ClipboardText,
    title: "Diagnóstico metabólico inicial",
    body: "Apertura de tu ficha digital con el método C.A.D.D.: peso, medidas y antecedentes de salud para conocer tu punto de partida.",
    bg: "bg-tinte-azul",
    span: "sm:col-span-2",
  },
  {
    icon: ForkKnife,
    title: "Qué vas a comer estos 7 días",
    body: "La guía de comida real del método: cómo combinar alimentos cotidianos para desinflamar, sin batidos ni suplementos.",
    bg: "bg-tinte-amarillo",
  },
  {
    icon: FileMagnifyingGlass,
    title: "Lista de compras",
    body: "Qué buscar en el supermercado. Comida real y accesible, que consigues en tu mercado de siempre.",
    bg: "bg-superficie-2",
  },
  {
    icon: ChatsCircle,
    title: "Factor humano en WhatsApp",
    body: "Acompañamiento y feedback de lunes a domingo, 5:30 a 9:00 am con el coach de guardia.",
    bg: "bg-superficie-2",
  },
  {
    icon: VideoCamera,
    title: "Live dominical de arranque",
    body: "Sesión en vivo para despejar dudas antes de iniciar tu semana de acción.",
    bg: "bg-tinte-azul",
  },
];

export function ProductOffer() {
  return (
    <section id="plan" className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-acento">
              El programa
            </p>
            <h2 className="mt-3 font-display text-3xl text-tinta md:text-4xl">
              Plan Detox5: 7 días de comida real para reiniciar tu metabolismo
            </h2>
            <p className="mt-4 text-base text-tinta-suave sm:text-lg">
              Una semana cerrada de ejecución en nuestra comunidad diseñada específicamente para
              resetear tu metabolismo y balance hormonal, bajar esos primeros 2 o 3 kilos, reducir
              4 o 5 centímetros de cintura, eliminar la retención de líquidos y recuperar tu
              vitalidad diaria. No es una dieta, es un nuevo punto de partida.
            </p>
          </Reveal>

          {/* Este hueco estaba reservado para fotografia de comida: ya no hace
              falta el retrato del coach. Un bucle de alguien cocinando dice
              "esto va de comer" mejor que cualquier titular. */}
          <Reveal delay={FOLLOW_THROUGH} className="mx-auto w-full max-w-[22rem] lg:max-w-none">
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[0_20px_44px_-24px_rgba(0,61,115,0.45)]">
              <VideoLoop nombre="video2" alt="Mujer picando verduras frescas sobre una tabla" />
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {INCLUSIONS.map(({ icon: Icon, title, body, bg, span }, index) => (
            <Reveal
              key={title}
              as="div"
              delay={index * STAGGER}
              className={span ?? ""}
            >
              <div
                className={`h-full rounded-3xl ${bg} p-6 shadow-[0_16px_36px_-24px_rgba(0,61,115,0.4)] transition-transform duration-[var(--dur-hover)] ease-signature hover:-translate-y-1`}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-superficie/70">
                  <Icon size={24} weight="duotone" className="text-azul-texto" />
                </span>
                <h3 className="mt-4 font-display text-xl text-tinta">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-tinta-suave">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* El movimiento sale de la rejilla y tiene bloque propio. Dentro de
            una tarjeta mas era una linea de texto que nadie leia; el cliente
            pedia que el ejercicio se transmitiera, y aqui se transmite sin
            competir con la alimentacion, porque llega despues de las cinco
            tarjetas de comida y acompanamiento.
            El cronometro por fin encaja: en el hero significaba "entrenador
            personal", pero en un bloque que habla de rutinas es el objeto
            correcto. */}
        <Reveal delay={FOLLOW_THROUGH} className="mt-4">
          <div className="grid grid-cols-1 items-center gap-6 overflow-hidden rounded-3xl bg-tinte-azul p-6 shadow-[0_16px_36px_-24px_rgba(0,61,115,0.4)] sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-4 lg:py-0 lg:pr-0">
            <div className="lg:py-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-superficie/70">
                <Timer size={24} weight="duotone" className="text-azul-texto" />
              </span>
              <h3 className="mt-4 font-display text-2xl text-tinta">
                Y el movimiento que tu cuerpo sí puede sostener
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-tinta-suave sm:text-base">
                Cada día suma una rutina corta de movilidad y activación, ajustada a tu edad y a
                tu condición real. Desde casa o al aire libre, sin equipos y sin impacto. No
                sustituye al plan de alimentación: lo acompaña, y es así como el cambio se
                sostiene más allá de los 7 días.
              </p>
            </div>

            <div className="relative mx-auto h-56 w-full max-w-[15rem] sm:h-64 lg:mx-0 lg:h-72 lg:max-w-none">
              <Image
                src="/photos/hero-cesar.webp"
                alt="César Villegas con un cronómetro, marcando el ritmo de la rutina"
                fill
                sizes="(min-width: 1024px) 30vw, 15rem"
                className="object-contain object-bottom"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={FOLLOW_THROUGH} className="mt-10">
          <div className="flex flex-col items-start gap-6 rounded-3xl border border-linea bg-tarjeta p-6 shadow-[0_20px_44px_-24px_rgba(0,61,115,0.35)] sm:flex-row sm:items-center sm:justify-between sm:p-8">
            {/* items-center, no items-baseline: con baseline el precio se
                alinea a la primera linea del texto y queda montado hacia
                arriba. */}
            <div className="flex items-center gap-4">
              <p className="font-display text-5xl leading-none text-azul-texto">
                <PriceTag />
              </p>
              <p className="text-sm leading-snug text-tinta-suave">
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
