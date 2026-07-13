import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { InstagramReelEmbed } from "./InstagramReelEmbed";

const STORIES = [
  {
    name: "Gladys",
    age: 70,
    achievement:
      "Su medico le retiro por completo la medicacion para la hipertension que tomaba desde 2009, tras una prueba MAPA perfecta.",
    reelUrl: "https://www.instagram.com/reel/DYDhZygA7Gv/",
  },
  {
    name: "Karelys",
    age: null,
    achievement:
      "Bajo casi 7 kilos en un mes y recupero la movilidad que creia perdida por completo.",
    reelUrl: "https://www.instagram.com/reel/DQvA5h_ACH1/",
  },
  {
    name: "Fanny",
    age: 62,
    achievement:
      "Bajo 10 kilos y hoy dice sentirse mas activa que una muchacha de 15 anos.",
    reelUrl: "https://www.instagram.com/reel/DQp1bCFAKf9/",
  },
];

export function SuccessStories() {
  return (
    <section className="bg-crema/50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="max-w-xl font-display text-3xl text-texto-oscuro md:text-4xl">
          Quienes ya dejaron de sufrir con metodos tradicionales
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STORIES.map((story) => (
            <div
              key={story.name}
              className="flex flex-col overflow-hidden rounded-3xl bg-blanco-calido shadow-sm"
            >
              <InstagramReelEmbed reelUrl={story.reelUrl} />
              <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-xl text-texto-oscuro">
                    {story.name}
                    {story.age ? `, ${story.age} anos` : ""}
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
                <p className="text-sm text-texto-medio">{story.achievement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
