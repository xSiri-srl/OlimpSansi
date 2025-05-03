import React, { useRef } from "react";
import SeccionPrincipal from "./SeccionPrincipal";
import VisualizadoresPdf from "./VisualizadoresPdf";
import SeccionInformativa from "./SeccionInformativa";

const Inicio = () => {
  const requisitosRef = useRef(null);

  const pdfUrlsPorArea = {
    matematicas: { url: "/borrar/hSansi.pdf", title: "Matemáticas", icono: "📐" },
    fisica: { url: "/borrar/grupal.pdf", title: "Física", icono: "⚛️" },
    quimica: { url: "/borrar/hSansi.pdf", title: "Química", icono: "🧪" },
    robotica: { url: "/borrar/grupal.pdf", title: "Robótica", icono: "🤖" },
    informatica: { url: "/borrar/hSansi.pdf", title: "Informática", icono: "💻" },
    biologia: { url: "/borrar/grupal.pdf", title: "Biología", icono: "🧬" },
    astronomia: { url: "/borrar/hSansi.pdf", title: "Astronomía y Astrofísica", icono: "🔭" }
  };

  const scrollToRequisitos = () => {
    if (requisitosRef.current) {
      const rect = requisitosRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const offsetTop = rect.top + scrollTop - 80; 
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SeccionPrincipal scrollToRequisitos={scrollToRequisitos} />
      <SeccionInformativa requisitosRef={requisitosRef} />
      <VisualizadoresPdf pdfUrls={Object.values(pdfUrlsPorArea)} />
    </div>
  );
};

export default Inicio;