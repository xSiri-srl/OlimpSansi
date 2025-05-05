import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import SeccionPrincipal from "./SeccionPrincipal";
import VisualizadoresPdf from "./VisualizadoresPdf";
import SeccionInformativa from "./SeccionInformativa";

const Inicio = () => {
  const requisitosRef = useRef(null);
  const [convocatorias, setConvocatorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Definición base de áreas con sus íconos
  const areasBase = {
    1: { title: "Matemáticas", icono: "📐", key: "matematicas" },
    2: { title: "Física", icono: "⚛️", key: "fisica" },
    3: { title: "Química", icono: "🧪", key: "quimica" },
    4: { title: "Robótica", icono: "🤖", key: "robotica" },
    5: { title: "Informática", icono: "💻", key: "informatica" },
    6: { title: "Biología", icono: "🧬", key: "biologia" },
    7: { title: "Astronomía y Astrofísica", icono: "🔭", key: "astronomia" }
  };

  useEffect(() => {
    const fetchConvocatorias = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:8000/api/convocatorias");
        setConvocatorias(response.data);
      } catch (error) {
        console.error("Error al cargar las convocatorias:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConvocatorias();
  }, []);

  // Combinar las áreas base con las convocatorias reales
  const getPdfUrls = () => {
    // Crear una copia del objeto base
    const pdfUrlsFinal = { ...areasBase };
    
    console.log("Convocatorias recibidas:", convocatorias);
    
    // Actualizar con las convocatorias reales
    convocatorias.forEach(convocatoria => {
      console.log("Procesando convocatoria:", convocatoria);
      if (pdfUrlsFinal[convocatoria.id_area]) {
        pdfUrlsFinal[convocatoria.id_area].url = convocatoria.documento_pdf;
        pdfUrlsFinal[convocatoria.id_area].title = convocatoria.titulo || pdfUrlsFinal[convocatoria.id_area].title;
        console.log(`Asignada URL ${convocatoria.documento_pdf} al área ${convocatoria.id_area}`);
      }
    });
    
    const filteredUrls = Object.values(pdfUrlsFinal).filter(area => area.url);
    console.log("URLs filtradas:", filteredUrls);
    return filteredUrls;
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
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
        </div>
      ) : (
        <VisualizadoresPdf pdfUrls={getPdfUrls()} />
      )}
    </div>
  );
};

export default Inicio;