import React, { useRef, useState, useEffect } from "react";
import SeccionPrincipal from "./SeccionPrincipal";
import VisualizadoresPdf from "./VisualizadoresPdf";
import SeccionInformativa from "./SeccionInformativa";


const Inicio = () => {
  const requisitosRef = useRef(null);
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

 

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

    </div>
  );
};

export default Inicio;