import { Quotes } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";

export function ParadigmShift() {
  return (
    <section className="relative overflow-hidden bg-azul-oscuro py-24 text-blanco-calido sm:py-32">
      {/* Glow radial de marca para dar profundidad al fondo solido. */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-azul/40 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-amarillo/10 blur-[120px]" />

      <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Quotes size={56} weight="fill" className="mx-auto mb-6 text-amarillo" />
        <h2 className="font-display text-2xl font-bold leading-snug sm:text-3xl md:text-[2.75rem] md:leading-[1.15]">
          El error del 90% de las mujeres después de los 40: matarse haciendo ejercicio antes
          de sanar la raíz, tus hábitos de alimentación.
        </h2>
        <div className="mx-auto mt-8 h-px w-16 bg-amarillo/60" />
        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-blanco-calido/80 sm:text-lg">
          Si tu cuerpo está inflamado y perdiste tu balance hormonal, sumar actividad física
          de forma aislada solo eleva el cortisol y ralentiza tu metabolismo. El movimiento es
          medicina, pero primero hay que limpiar el terreno.
        </p>
      </Reveal>
    </section>
  );
}
