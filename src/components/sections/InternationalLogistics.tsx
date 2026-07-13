import Image from "next/image";

export function InternationalLogistics() {
  return (
    <section className="bg-crema/50 py-20 sm:py-28">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-2 aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-azul-suave lg:order-1">
          <Image
            src="/photos/logistics-cesar.webp"
            alt="Cesar Villegas listo para entrenar donde estes"
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-contain object-bottom"
            style={{
              maskImage: "linear-gradient(to bottom, black 82%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 82%, transparent 100%)",
            }}
          />
        </div>

        <div className="order-1 lg:order-2">
          <h2 className="font-display text-3xl text-texto-oscuro md:text-4xl">
            ¿Y si vives fuera de Venezuela?
          </h2>
          <p className="mt-4 text-base text-texto-medio sm:text-lg">
            Nuestro ecosistema es global. El control nutricional, el soporte y la entrega de
            guias se ejecutan 100% remoto por WhatsApp, sin importar tu zona horaria.
          </p>
          <p className="mt-3 text-base text-texto-medio sm:text-lg">
            Compras tus alimentos locales con la lista inteligente y recibes feedback diario
            del coach. Las rutinas se adaptan para hacerlas desde casa o cualquier espacio
            libre de tu rutina.
          </p>
        </div>
      </div>
    </section>
  );
}
