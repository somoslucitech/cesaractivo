import Image from "next/image";
import { Certificate } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { FOLLOW_THROUGH, STAGGER } from "@/lib/motion";

/**
 * Certificaciones tal cual las envio el cliente, sin renombrar ninguna: son
 * credenciales verificables y su titulo es un hecho.
 *
 * Lo unico que se decide aca es el ORDEN. De las siete, cinco son de area
 * fisica y solo dos de nutricion, asi que en el orden original la seccion que
 * sostiene la autoridad del metodo empezaria diciendo "preparador fisico" y
 * "planificacion del entrenamiento", justo lo contrario de lo que la pagina
 * necesita comunicar. Abren las dos de nutricion y el coach de bienestar;
 * las de preparacion fisica van despues, que es donde apoyan sin liderar.
 */
const CERTIFICACIONES: { title: string; issuer: string; year: string }[] = [
  { title: "Nutrición y fisiología del ejercicio", issuer: "Filacmio", year: "2017" },
  { title: "Nutrición deportiva y suplementación aplicada", issuer: "FEDA", year: "2018" },
  { title: "Fitness and Wellness Coach", issuer: "Dynamic Power System", year: "2026" },
  { title: "Preparador físico integral", issuer: "Filacmio", year: "2017" },
  { title: "Planificación del entrenamiento", issuer: "Filacmio", year: "2017" },
  { title: "Métodos y patrones de movimiento", issuer: "Filacmio", year: "2018" },
  { title: "Fundamentos de la motricidad humana", issuer: "FEDA", year: "2018" },
];

export function CoachBio() {
  return (
    <section id="cesar" className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
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

        <Reveal delay={FOLLOW_THROUGH} className="grid grid-cols-2 gap-3">
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

        {/* Bloque propio y a todo el ancho, no una lista suelta dentro de la
            columna de texto: son siete credenciales y apelmazadas junto a la
            bio no se leerian. Es la unica prueba de autoridad de la pagina. */}
        {CERTIFICACIONES.length > 0 && (
          <div className="mt-14 border-t border-linea pt-10">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-acento">
                Formación
              </p>
              <p className="mt-2 max-w-2xl text-base text-tinta-suave">
                La base técnica detrás del método: nutrición aplicada, fisiología y bienestar.
              </p>
            </Reveal>
            <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              {CERTIFICACIONES.map(({ title, issuer, year }, index) => (
                <Reveal
                  key={title}
                  as="li"
                  // El stagger se topa a los 6 pasos: motion.ts declara un
                  // techo de 500 ms y siete items lo pasarian.
                  delay={FOLLOW_THROUGH + Math.min(index, 5) * STAGGER}
                  className="flex items-start gap-3"
                >
                  <Certificate size={20} weight="duotone" className="mt-0.5 shrink-0 text-acento" />
                  <span className="text-sm leading-snug text-tinta-suave">
                    <span className="font-medium text-tinta">{title}</span>
                    <br />
                    {issuer} · {year}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
