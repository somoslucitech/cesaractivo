import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  SealCheck,
  ChatsCircle,
  ClipboardText,
  ForkKnife,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Footer } from "@/components/layout/Footer";
import { whatsappUrl, WHATSAPP_DISPLAY } from "@/lib/contact";

/**
 * Confirmacion de compra.
 *
 * Hoy el checkout se resuelve entero dentro del modal, asi que nadie aterriza
 * aqui por redireccion todavia. Esta pagina existe para tres usos reales:
 *   - URL de retorno cuando se active el flujo de PayPal con redireccion,
 *   - el pago con criptomoneda, que se confirma por webhook y puede llegar
 *     cuando la compradora ya cerro la pestana,
 *   - un enlace que el equipo puede reenviar por WhatsApp como comprobante
 *     de que el proceso siguio adelante.
 *
 * El contenido responde a la unica pregunta que importa despues de pagar:
 * "y ahora que pasa". Dejar eso sin responder es lo que genera ansiedad y
 * solicitudes de reembolso.
 */
export const metadata: Metadata = {
  title: "Gracias por tu compra | Plan Detox5",
  // Una pagina de gracias jamas debe indexarse: se colaria en los resultados
  // de busqueda y ademas ensuciaria cualquier medicion de conversion.
  robots: { index: false, follow: false },
};

const PASOS = [
  {
    icon: ChatsCircle,
    title: "Te escribimos por WhatsApp",
    body: `El equipo de César te contacta al número que registraste. Guarda ${WHATSAPP_DISPLAY} en tus contactos para que el mensaje no se te pierda.`,
  },
  {
    icon: ClipboardText,
    title: "Abrimos tu ficha C.A.D.D.",
    body: "Tu diagnóstico metabólico inicial: peso, medidas y antecedentes de salud. Es el punto de partida contra el que vas a medir tus 7 días.",
  },
  {
    icon: ForkKnife,
    title: "Recibes la guía y entras al grupo",
    body: "La guía de comida real, la lista de compras de la semana y el acceso al grupo de enfoque, donde está el acompañamiento diario.",
  },
];

export default function Gracias() {
  return (
    <>
      <header className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <Link href="/" aria-label="Ir al inicio" className="inline-block">
          <Image
            src="/logos/cesar-activo-coach-mark.webp"
            alt="César Activo Coach"
            width={390}
            height={240}
            className="h-10 w-auto"
            priority
          />
        </Link>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-20 sm:px-6">
        <div className="rounded-[2rem] border border-amarillo/40 bg-tarjeta p-8 text-center shadow-[0_24px_50px_-20px_rgba(200,168,0,0.35)] sm:p-12">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-tinte-azul">
            <SealCheck size={34} weight="fill" className="text-azul-texto" />
          </span>
          <h1 className="mt-5 font-display text-3xl text-azul-titulo md:text-4xl">
            Listo, ya eres parte del reto
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-base text-tinta-suave sm:text-lg">
            Tu pago quedó registrado. A partir de aquí el proceso es acompañado: no tienes que
            hacer nada más por tu cuenta.
          </p>
        </div>

        <h2 className="mt-14 font-display text-2xl text-tinta">Qué pasa ahora</h2>

        <ol className="mt-6 flex flex-col gap-4">
          {PASOS.map(({ icon: Icon, title, body }, index) => (
            <li
              key={title}
              className="flex gap-4 rounded-3xl border border-linea bg-superficie-2 p-6 shadow-[0_16px_36px_-24px_rgba(0,61,115,0.4)]"
            >
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-tinte-azul">
                <Icon size={22} weight="duotone" className="text-azul-texto" />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amarillo text-[11px] font-bold text-texto-oscuro">
                  {index + 1}
                </span>
              </span>
              <div>
                <h3 className="font-display text-lg text-tinta">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-tinta-suave">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-3xl bg-tinte-amarillo p-6 sm:p-8">
          <h2 className="font-display text-xl text-tinta">¿No te ha llegado el mensaje?</h2>
          <p className="mt-2 text-sm leading-relaxed text-tinta-suave">
            Si pasan más de 24 horas sin que te escribamos, escríbenos tú. A veces el número
            queda mal registrado en el formulario y preferimos que no pierdas ni un día de tu
            semana.
          </p>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 font-semibold text-white shadow-[0_10px_28px_-8px_rgba(37,211,102,0.6)] transition-transform duration-[var(--dur-hover)] ease-signature active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-texto"
          >
            <WhatsappLogo size={20} weight="fill" />
            Escribir por WhatsApp
          </a>
        </div>

        <Link
          href="/"
          className="mt-10 inline-block text-sm font-semibold text-azul-texto transition-colors duration-[var(--dur-hover)] hover:text-azul focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-azul-texto"
        >
          Volver al inicio
        </Link>
      </main>

      <Footer />
    </>
  );
}
