import { headers } from "next/headers";
import { cf } from "@/lib/cloudflare";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerConfigPrecio } from "@/lib/settings";
import { listarAdmins, listarInvitacionesVigentes } from "@/lib/admins";
import { FormPrecio } from "@/components/admin/FormPrecio";
import { PanelAdmins } from "@/components/admin/PanelAdmins";

export const dynamic = "force-dynamic";

export default async function PaginaAjustes() {
  const admin = await requireAdmin();
  const { env } = await cf();

  const [config, admins, invitaciones, cabeceras] = await Promise.all([
    obtenerConfigPrecio(),
    listarAdmins(),
    listarInvitacionesVigentes(),
    headers(),
  ]);

  // La URL del panel se arma con el host real de la peticion: es lo que hay
  // que pasarle a quien se invita, y cambia segun se entre por workers.dev o
  // por el dominio definitivo.
  const host = cabeceras.get("host") ?? "";
  const protocolo = host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
  const urlPanel = `${protocolo}://${host}/${env.ADMIN_PATH}`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-tinta">Ajustes</h1>
        <p className="mt-1 text-sm text-tinta-suave">
          Los cambios se aplican al instante en la página, sin desplegar nada.
        </p>
      </div>

      <FormPrecio inicial={config} />

      <PanelAdmins
        admins={admins}
        invitaciones={invitaciones}
        esPropietario={admin.role === "owner"}
        miId={admin.adminId}
        urlPanel={urlPanel}
      />
    </div>
  );
}
