import { ImageResponse } from "next/og";

/**
 * Portada que ven WhatsApp, Instagram y Facebook cuando alguien comparte el
 * enlace. Antes no existia ninguna: los enlaces se compartian pelados, sin
 * titulo ni imagen, justo en los canales de donde viene todo el trafico.
 *
 * Se genera en build (no usa APIs de request), asi que sale como PNG estatico
 * y nunca se ejecuta dentro del Worker. Sin fuentes propias a proposito:
 * cargar Newsreader obligaria a leer un .ttf del disco y a que este archivo
 * dependa del sistema de ficheros.
 *
 * El mensaje es deliberadamente el de alimentacion: esta imagen es la segunda
 * portada del sitio y tiene que decir "comida" antes de que nadie entre.
 */
export const alt =
  "Plan Detox5: 7 días de comida real para reiniciar tu metabolismo, con César Activo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#003d73",
          backgroundImage:
            "radial-gradient(circle at 15% 20%, #005fa3 0px, transparent 55%), radial-gradient(circle at 85% 85%, #00294f 0px, transparent 55%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              backgroundColor: "#ffd700",
              color: "#1c1c1c",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 2,
              padding: "10px 22px",
              borderRadius: 999,
            }}
          >
            DETOX5
          </div>
          <div style={{ display: "flex", color: "#fffaf3", fontSize: 26, opacity: 0.85 }}>
            Programa de alimentación · 7 días
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#fffaf3",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 940,
            }}
          >
            7 días de comida real para reiniciar tu metabolismo
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              color: "#fffaf3",
              fontSize: 30,
              opacity: 0.85,
              maxWidth: 860,
            }}
          >
            Para mujeres de 40 a 70. Sin pasar hambre, sin suplementos y con acompañamiento
            diario.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", width: 40, height: 4, backgroundColor: "#ffd700" }} />
          <div style={{ display: "flex", color: "#fffaf3", fontSize: 26, opacity: 0.75 }}>
            César Activo · Coach de Bienestar
          </div>
        </div>
      </div>
    ),
    size,
  );
}
