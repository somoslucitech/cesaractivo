import type { Metadata } from "next";
import { PaginaLegal } from "@/components/layout/PaginaLegal";
import { whatsappUrl, WHATSAPP_DISPLAY } from "@/lib/contact";

/**
 * Texto redactado a partir de lo que el sitio hace de verdad (formulario,
 * pasarelas, cookies, proveedores). Cualquier cambio en lo que se recoge o en
 * los proveedores tiene que reflejarse aqui. Pendiente de revision por el
 * cliente (ver la nota del proyecto en la boveda).
 */
export const metadata: Metadata = {
  title: "Política de privacidad | César Activo",
  description:
    "Qué datos recoge César Activo cuando te inscribes en el Plan Detox5, para qué los usa, con quién los comparte y cómo ejercer tus derechos.",
  alternates: { canonical: "/privacidad" },
};

export default function Privacidad() {
  return (
    <PaginaLegal titulo="Política de privacidad" actualizado="7 de octubre de 2026">
      <p>
        En César Activo, la marca con la que César Villegas ofrece el Plan Detox5 y sus otros
        programas de acompañamiento, cuidamos los datos que nos confías. Aquí te contamos qué
        recogemos, para qué y qué puedes hacer con ellos.
      </p>

      <h2>Quién es el responsable</h2>
      <p>
        César Villegas (César Activo). Puedes escribirnos por WhatsApp al{" "}
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
          {WHATSAPP_DISPLAY}
        </a>{" "}
        para cualquier consulta sobre tus datos.
      </p>

      <h2>Qué datos recogemos</h2>
      <ul>
        <li>
          <strong>Al inscribirte:</strong> tu nombre, tu email y tu número de WhatsApp.
        </li>
        <li>
          <strong>Al pagar:</strong> el método de pago, el importe y el estado del pago. Los datos
          de tu tarjeta los gestiona PayPal directamente; nosotros nunca los vemos ni los
          guardamos. Los pagos por Pago Móvil, Zelle y Binance se coordinan por WhatsApp.
        </li>
        <li>
          <strong>Durante el programa:</strong> para tu ficha de diagnóstico (método C.A.D.D.) te
          pedimos por WhatsApp tu peso, tus medidas y tus antecedentes de salud. Son datos de
          salud: solo los usamos para acompañarte en el plan y solo con tu consentimiento.
        </li>
        <li>
          <strong>Al navegar:</strong> datos de uso de la página (qué secciones se visitan, el tipo
          de dispositivo y el país o la ciudad aproximados) para medir cómo funciona la web.
        </li>
      </ul>

      <h2>Para qué los usamos</h2>
      <ul>
        <li>Darte acceso al Plan Detox5 y acompañarte durante los 7 días.</li>
        <li>Confirmar tu pago y avisar al equipo de tu inscripción.</li>
        <li>Responder tus consultas por WhatsApp.</li>
        <li>Mejorar la web y, solo si lo aceptas, medir el resultado de nuestros anuncios.</li>
      </ul>
      <p>No vendemos tus datos a nadie.</p>

      <h2>Cookies y tecnologías similares</h2>
      <ul>
        <li>
          <strong>Medición propia</strong> (cookie <code>ca_device</code>, 1 año): un identificador
          aleatorio que se guarda cifrado e irreversible, para contar visitas sin saber quién eres.
        </li>
        <li>
          <strong>Preferencias</strong> (almacenamiento del navegador): el tema claro u oscuro y tu
          elección sobre las cookies.
        </li>
        <li>
          <strong>Píxel de Meta</strong> (Facebook e Instagram): solo se carga si pulsas
          &quot;Aceptar&quot; en el aviso de cookies. Sirve para medir nuestros anuncios. Si lo
          rechazas, no se carga.
        </li>
      </ul>
      <p>
        Puedes cambiar tu elección borrando los datos de este sitio en tu navegador; el aviso
        volverá a aparecer.
      </p>

      <h2>Con quién los compartimos</h2>
      <p>Solo con los proveedores que necesitamos para que el servicio funcione:</p>
      <ul>
        <li>Cloudflare, que aloja la web y la base de datos.</li>
        <li>PayPal, que procesa los pagos con tarjeta o con cuenta PayPal.</li>
        <li>Resend, que envía los correos de aviso de inscripción.</li>
        <li>Meta (WhatsApp, y el píxel solo si lo aceptas).</li>
      </ul>
      <p>
        Algunos de estos proveedores están fuera de tu país, sobre todo en Estados Unidos, y
        aplican sus propias garantías de protección de datos.
      </p>

      <h2>Cuánto tiempo los guardamos</h2>
      <p>
        Mientras dure tu relación con nosotros y, después, el tiempo que exijan las obligaciones
        legales y contables. Los datos de medición se guardan sin identificarte.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes pedirnos en cualquier momento ver tus datos, corregirlos, borrarlos, oponerte a su
        uso o retirar tu consentimiento. Escríbenos por WhatsApp al {WHATSAPP_DISPLAY} y lo
        atendemos. Si vives en la Unión Europea, también puedes reclamar ante la autoridad de
        protección de datos de tu país.
      </p>

      <h2>Cambios</h2>
      <p>
        Si cambiamos esta política, publicaremos la nueva versión en esta página con su fecha de
        actualización.
      </p>
    </PaginaLegal>
  );
}
