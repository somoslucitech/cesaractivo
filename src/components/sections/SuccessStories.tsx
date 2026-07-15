import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { InstagramReelEmbed } from "./InstagramReelEmbed";
import { Reveal } from "@/components/ui/Reveal";

const STORIES = [
  {
    name: "Gladys",
    age: 70,
    achievement:
      "Su médico le indicó eliminar por completo la medicación para la hipertensión que tomaba desde 2009, tras confirmar que su prueba MAPA salió perfecta. Demostró que la constancia transforma una vida entera y no solo un peso, graduándose con éxito en la Escuela de Alimentación.",
    reelUrl: "https://www.instagram.com/reel/DQp1bCFAKf9/",
  },
  {
    name: "Karelys",
    age: null,
    achievement:
      "Logró bajar casi 7 kilos en tan solo un mes y recuperar por completo la movilidad corporal que creía totalmente perdida. Pasó de costarle y no poder pararse del piso, a levantarse por sí sola gracias al impulso, la energía y el sistema de apoyo de nuestra comunidad.",
    reelUrl: "https://www.instagram.com/reel/DQvA5h_ACH1/",
  },
  {
    name: "Fanny",
    age: 62,
    achievement:
      "Demostró que el cuerpo no tiene fecha de vencimiento. No solo bajó 10 kilos y evidenció un cambio físico drástico en la báscula y la estética, sino que recuperó los niveles de energía y hoy afirma sentirse más activa que una muchacha de 15 años.",
    reelUrl: "https://www.instagram.com/reel/DYDhZygA7Gv/",
  },
];

export function SuccessStories() {
  return (
    <section id="casos-de-exito" className="bg-crema/50 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amarillo-oscuro">
            Testimonios reales
          </p>
          <h2 className="mt-3 font-display text-3xl text-texto-oscuro md:text-4xl">
            Quienes ya dejaron de sufrir con métodos tradicionales
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STORIES.map((story, index) => (
            <Reveal
              key={story.name}
              as="div"
              delay={index * 0.1}
              className="flex flex-col overflow-hidden rounded-3xl border border-crema bg-blanco-calido shadow-[0_18px_40px_-24px_rgba(0,61,115,0.35)]"
            >
              <div className="flex flex-col gap-2 p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-xl text-texto-oscuro">
                    {story.name}
                    {story.age ? `, ${story.age} años` : ""}
                  </p>
                  <a
                    href={story.reelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex shrink-0 items-center gap-1 text-xs text-texto-medio transition-colors duration-150 hover:text-azul"
                  >
                    Instagram
                    <ArrowUpRight size={14} />
                  </a>
                </div>
                <p className="text-sm leading-relaxed text-texto-medio">{story.achievement}</p>
              </div>
              <div className="mt-auto">
                <InstagramReelEmbed reelUrl={story.reelUrl} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
