import Image from "next/image";
import { CtaButton } from "@/components/checkout/CtaButton";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-crema/80 bg-blanco-calido/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Image
          src="/logos/cesar-activo-coach-mark.png"
          alt="Cesar Activo Coach"
          width={559}
          height={344}
          className="h-9 w-auto sm:h-11"
          priority
        />
        <CtaButton className="px-5 py-2.5 text-sm" />
      </div>
    </header>
  );
}
