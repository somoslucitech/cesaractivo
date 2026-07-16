import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { whatsappUrl } from "@/lib/contact";

/**
 * Burbuja flotante de contacto. Es solo un enlace: no necesita JS ni
 * estado, asi que funciona desde el primer pintado del servidor.
 * z-30 la deja bajo el nav (z-40) y bajo el modal de checkout (z-50).
 */
export function WhatsappBubble() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="group fixed bottom-5 right-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_-6px_rgba(37,211,102,0.6)] transition-transform duration-200 ease-out hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-texto sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
    >
      <WhatsappLogo size={30} weight="fill" className="sm:hidden" />
      <WhatsappLogo size={34} weight="fill" className="hidden sm:block" />
    </a>
  );
}
