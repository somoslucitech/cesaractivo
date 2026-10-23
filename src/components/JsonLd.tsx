import { calcularPrecios, formatPrice, montoParaPasarela, type ConfigPrecio } from "@/lib/pricing";
import { FAQS, PRECIO } from "@/lib/faq";
import { WHATSAPP_DISPLAY } from "@/lib/contact";
import { SITE_URL } from "@/lib/site";

/**
 * Datos estructurados (schema.org) de la landing, en un solo @graph para que
 * las entidades se enlacen entre si por @id.
 *
 * Todo lo que se declara aqui tiene que verse tambien en la pagina: precios,
 * preguntas y datos de Cesar. Por eso el precio sale de la misma config que
 * pinta la landing y las FAQ de src/lib/faq.ts. No hay AggregateRating a
 * proposito: no hay reseñas con puntuacion que lo respalden.
 */
export function JsonLd({ config }: { config: ConfigPrecio }) {
  const usd = calcularPrecios(config, "usd");
  const eur = calcularPrecios(config, "eur");

  const org = `${SITE_URL}/#organizacion`;
  const cesar = `${SITE_URL}/#cesar`;
  const producto = `${SITE_URL}/#detox5`;

  const oferta = (p: typeof usd, moneda: "USD" | "EUR") => ({
    "@type": "Offer",
    price: montoParaPasarela(p.efectivo),
    priceCurrency: moneda,
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/#plan`,
    seller: { "@id": org },
    ...(p.enOferta && p.ofertaFin ? { priceValidUntil: p.ofertaFin.slice(0, 10) } : {}),
  });

  const datos = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": org,
        name: "César Activo",
        url: SITE_URL,
        logo: `${SITE_URL}/logos/cesar-activo-coach-mark.webp`,
        founder: { "@id": cesar },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: WHATSAPP_DISPLAY.replace(/[\s-]/g, ""),
          contactType: "customer service",
          availableLanguage: "es",
        },
      },
      {
        "@type": "Person",
        "@id": cesar,
        name: "César Villegas",
        jobTitle: "Coach de bienestar",
        image: `${SITE_URL}/photos/cesar-retrato.webp`,
        worksFor: { "@id": org },
        knowsAbout: [
          "Nutrición",
          "Fisiología del ejercicio",
          "Salud metabólica y hormonal de la mujer después de los 40",
          "Preparación física",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#web`,
        url: SITE_URL,
        name: "César Activo",
        inLanguage: "es",
        publisher: { "@id": org },
      },
      {
        "@type": "Product",
        "@id": producto,
        name: "Plan Detox5",
        description:
          "Plan detox de 7 días con comida real para desinflamar y reiniciar el metabolismo, para mujeres de 40 a 70 años. Incluye diagnóstico metabólico inicial, guía de alimentación con lista de compras, rutina diaria de movilidad y acompañamiento diario por WhatsApp.",
        image: `${SITE_URL}/opengraph-image`,
        brand: { "@id": org },
        offers: [oferta(usd, "USD"), oferta(eur, "EUR")],
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer.replace(PRECIO, `${formatPrice(usd.efectivo, "usd")} USD`),
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // "<" escapado: un texto con "</script>" no puede cerrar la etiqueta.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos).replace(/</g, "\\u003c") }}
    />
  );
}
