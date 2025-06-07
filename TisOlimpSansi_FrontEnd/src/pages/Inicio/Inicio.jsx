import React, { useRef, useState, useEffect } from "react";
import SeccionPrincipal from "./SeccionPrincipal";
import VisualizadoresPdf from "./VisualizadoresPdf";
import SeccionInformativa from "./SeccionInformativa";
import { API_URL } from "../../utils/api";
import axios from "axios"

const Inicio = () => {
  const requisitosRef = useRef(null);
  const [convocatorias, setConvocatorias] = useState([]);
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const areaIcons = {
    "Matemáticas": "📐",
    "Física": "⚛️",
    "Química": "🧪",
    "Robótica": "🤖",
    "Informática": "💻",
    "Biología": "🧬",
    "Astronomía y Astrofísica": "🔭"
  };

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [convocatoriasResponse, areasResponse] = await Promise.all([
          axios.get(`${API_URL}/api/convocatorias`),
          axios.get(`${API_URL}/api/areas`)
        ]);
        
        setConvocatorias(convocatoriasResponse.data);
        const areasData = areasResponse.data.data || [];
        const areasWithIcons = areasData.map(area => ({
          id: area.id,
          title: area.nombre_area,
          icono: areaIcons[area.nombre_area] || "📄",
          key: area.nombre_area.toLowerCase().replace(/\s+/g, '_')
        }));
        
        setAreas(areasWithIcons);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPdfUrls = () => {
    if (!areas.length) return [];
    
    const pdfUrlsFinal = areas.map(area => ({...area}));
    if (Array.isArray(convocatorias)) {
      convocatorias.forEach(convocatoria => {
        const areaIndex = pdfUrlsFinal.findIndex(area => area.id === convocatoria.id_area);
        if (areaIndex !== -1) {
          pdfUrlsFinal[areaIndex].url = convocatoria.documento_pdf;
          pdfUrlsFinal[areaIndex].convocatoriaTitle = convocatoria.titulo;
          pdfUrlsFinal[areaIndex].convocatoriaId = convocatoria.id;
        }
      });
    }
    
    return pdfUrlsFinal;
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