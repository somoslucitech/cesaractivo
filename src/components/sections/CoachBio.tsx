import Image from "next/image";

export function CoachBio() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="font-display text-3xl text-texto-oscuro md:text-4xl">
            Detras del metodo: Cesar Villegas
          </h2>
          <p className="mt-4 text-base text-texto-medio sm:text-lg">
            Preparador fisico integral con mas de 14 anos transformando vidas. Su
            especializacion esta en la salud hormonal y la reactivacion metabolica de mujeres
            mayores de 40, ensenandoles a usar la comida real como medicina diaria.
          </p>
          <p className="mt-3 text-base text-texto-medio sm:text-lg">
            Tras superar su propio proceso de transformacion, ha replicado el sistema guiando
            a mas de 800 graduadas en su Escuela de Alimentacion y Team Puro Power.
          </p>
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-azul-suave">
          <Image
            src="/photos/coach-bio-cesar.webp"
            alt="Cesar Villegas, coach de bienestar"
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-contain object-bottom"
            style={{
              maskImage: "linear-gradient(to bottom, black 82%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 82%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
