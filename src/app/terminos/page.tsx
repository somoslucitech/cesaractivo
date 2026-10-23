import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegal } from "@/components/layout/PaginaLegal";
import { whatsappUrl, WHATSAPP_DISPLAY } from "@/lib/contact";

/**
 * Condiciones del Plan Detox5. Pendiente de revision por el cliente, sobre
 * todo el apartado de reembolsos (ver la nota del proyecto en la boveda).
 */
export const metadata: Metadata = {
  title: "Términos y condiciones | César Activo",
  description:
    "Condiciones de compra y de uso del Plan Detox5 de César Activo: qué incluye, pago, acceso, acompañamiento y aviso de salud.",
  alternates: { canonical: "/terminos" },
};

export default function Terminos() {
  return (
    <PaginaLegal titulo="Términos y condiciones" actualizado="7 de octubre de 2026">
      <p>
        Estos términos regulan la compra y el uso del Plan Detox5, que ofrece César Villegas con
        la marca César Activo. Al inscribirte y pagar, aceptas estas condiciones.
      </p>

      <h2>Qué incluye el Plan Detox5</h2>
      <ul>
        <li>Un diagnóstico metabólico inicial (ficha C.A.D.D.).</li>
        <li>La guía de alimentación del método y la lista de compras de la semana.</li>
        <li>Una rutina diaria y corta de movilidad, sin equipos ni impacto.</li>
        <li>
          Acompañamiento por WhatsApp de lunes a domingo, de 5:30 a 9:00 a. m., con el coach de
          guardia.
        </li>
        <li>Un live dominical de arranque.</li>
      </ul>
      <p>Todo el programa se hace a distancia, desde donde estés.</p>

      <h2>Precio y pago</h2>
      <p>
        El precio es un pago único por los 7 días y se muestra en la página antes de pagar, en
        dólares o en euros según la moneda que elijas. Puedes pagar con tarjeta o PayPal, o por
        Pago Móvil, Zelle y Binance, que se coordinan por WhatsApp. El importe que se cobra es siempre el
        que confirma nuestro sistema en el momento del pago.
      </p>

      <h2>Acceso</h2>
      <p>
        Cuando se confirma tu pago, el equipo te escribe por WhatsApp al número que registraste
        para abrir tu ficha y darte acceso al grupo. Si pasan más de 24 horas sin noticias,
        escríbenos al{" "}
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
          {WHATSAPP_DISPLAY}
        </a>
        .
      </p>

      <h2>Problemas con el pago y reembolsos</h2>
      <p>
        Si tienes un problema con tu pago o no recibiste el acceso, escríbenos por WhatsApp y lo
        revisamos contigo. Las solicitudes de reembolso se atienden caso por caso.
      </p>

      <h2>Aviso de salud</h2>
      <p>
        El Plan Detox5 es un acompañamiento nutricional y de hábitos.{" "}
        <strong>No es un tratamiento médico ni sustituye la indicación de tu médico.</strong> No
        suspendas ni modifiques ningún tratamiento sin consultarlo con él. Si estás embarazada o
        en lactancia, o tienes una enfermedad o tomas medicación, consulta a tu médico antes de
        empezar.
      </p>
      <p>
        Los resultados son individuales y dependen de tu punto de partida y de tu compromiso con
        las pautas. Los testimonios de la página son experiencias reales de otras personas y no
        garantizan el mismo resultado.
      </p>

      <h2>Uso de los materiales</h2>
      <p>
        Las guías, listas y contenidos del programa son para tu uso personal. No puedes
        revenderlos ni compartirlos públicamente.
      </p>

      <h2>Tus datos</h2>
      <p>
        Cómo tratamos tu información está explicado en la{" "}
        <Link href="/privacidad">política de privacidad</Link>.
      </p>

      <h2>Contacto</h2>
      <p>Para cualquier duda sobre estos términos, escríbenos por WhatsApp al {WHATSAPP_DISPLAY}.</p>
    </PaginaLegal>
  );
}
