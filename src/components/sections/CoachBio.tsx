import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

export function CoachBio() {
  return (
    <section id="cesar" className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2 className="font-display text-3xl text-tinta md:text-4xl">
            Yo también fui el &quot;antes&quot;
          </h2>
          <p className="mt-1 text-sm font-medium text-tinta-suave">
            César Villegas, coach de bienestar
          </p>
          <p className="mt-4 text-base text-tinta-suave sm:text-lg">
            Antes de ser coach, viví mi propio proceso de transformación. Aprendí en carne
            propia que no se trata de fuerza de voluntad: se trata de sanar la raíz, empezando
            por la alimentación.
          </p>
          <p className="mt-3 text-base text-tinta-suave sm:text-lg">
            Hoy, con más de 14 años de trayectoria, he replicado ese mismo sistema guiando a
            más de 800 mujeres en mi Escuela de Alimentación y Team Puro Power,
            especializándome en la salud hormonal y metabólica de mujeres mayores de 40.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="grid grid-cols-2 gap-3">
          <div>
            <div className="relative aspect-[9/20] w-full overflow-hidden rounded-2xl shadow-[0_18px_40px_-24px_rgba(28,28,28,0.5)]">
              <Image
                src="/photos/antes-cesar.webp"
                alt="César antes de su transformación, foto de cuerpo completo"
                fill
                sizes="(min-width: 1024px) 20vw, 45vw"
                className="object-cover object-top"
              />
            </div>
            <p className="mt-2 text-center text-sm font-medium text-tinta-suave">Antes</p>
          </div>
          <div>
            <div className="relative aspect-[9/20] w-full overflow-hidden rounded-2xl bg-tinte-azul shadow-[0_18px_40px_-24px_rgba(0,61,115,0.45)]">
              <Image
                src="/photos/despues-cesar.webp"
                alt="César después de su transformación, foto de cuerpo completo"
                fill
                sizes="(min-width: 1024px) 20vw, 45vw"
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-center text-sm font-medium text-azul-texto">Después</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
