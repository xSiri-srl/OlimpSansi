import { useState, useEffect } from "react";
import HeaderSelector from "./AreasCompetencia/HeaderSelector";
import AreaCosto from "./AreasCompetencia/AreaCosto";
import AccionesFooter from "./AreasCompetencia/AccionesFooter";

const AsociarCosto = () => {
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [olimpiadaSeleccionada, setOlimpiadaSeleccionada] = useState("");
  const [nombreOlimpiada, setNombreOlimpiada] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [areasAsociadas, setAreasAsociadas] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Cargar la lista de olimpiadas disponibles
  useEffect(() => {
    // Aquí se conectaría con la API para obtener olimpiadas reales
    setOlimpiadas([
      { id: 1, titulo: "Olimpiada Nacional de Matemática 2025" },
      { id: 2, titulo: "Olimpiada de Ciencia Escolar 2025" },
      { id: 3, titulo: "Olimpiada de Lógica y Pensamiento 2025" },
    ]);
  }, []);

  // Actualizar nombre de olimpiada cuando se selecciona una
  useEffect(() => {
    if (olimpiadaSeleccionada) {
      const olimpiada = olimpiadas.find(
        (o) => o.id.toString() === olimpiadaSeleccionada
      );
      setNombreOlimpiada(olimpiada ? olimpiada.titulo : "");
      
      // Cargar las áreas asociadas a esta olimpiada
      cargarAreasAsociadas(olimpiadaSeleccionada);
    } else {
      setNombreOlimpiada("");
      setAreasAsociadas([]);
    }
  }, [olimpiadaSeleccionada, olimpiadas]);

  // Función para cargar las áreas ya asociadas a una olimpiada
  const cargarAreasAsociadas = async (idOlimpiada) => {
    setCargando(true);
    try {
      // Aquí se conectaría con la API para obtener las áreas asociadas
      // Por ahora, usamos datos de ejemplo
      await new Promise(resolve => setTimeout(resolve, 800)); // Simular carga

      // Datos de ejemplo - esto vendría de la API
      const areasEjemplo = [
        {
          id: 1,
          area: "Matemáticas",
          habilitado: true,
          costoInscripcion: "50",
          niveles: [
            { nivel: "Primer Nivel", grado: "1ro Secundaria" },
            { nivel: "Segundo Nivel", grado: "2do Secundaria" },
            { nivel: "Tercer Nivel", grado: "3ro Secundaria" },
            { nivel: "Cuarto Nivel", grado: "4to Secundaria" },
            { nivel: "Quinto Nivel", grado: "5to Secundaria" },
            { nivel: "Sexto Nivel", grado: "6to Secundaria" },
          ],
        },
        {
          id: 2,
          area: "Física",
          habilitado: true,
          costoInscripcion: "",
          niveles: [
            { nivel: "4S", grado: "4to Secundaria" },
            { nivel: "5S", grado: "5to Secundaria" },
            { nivel: "6S", grado: "6to Secundaria" },
          ],
        },
        {
          id: 3,
          area: "Informática",
          habilitado: true,
          costoInscripcion: "70",
          rangos: [
            { nivel: "Guacamayo", desde: "5to Primaria", hasta: "6to Primaria" },
            { nivel: "Guanaco", desde: "1ro Secundaria", hasta: "3ro Secundaria" },
            { nivel: "Londra", desde: "1ro Secundaria", hasta: "3ro Secundaria" },
            { nivel: "Jucumari", desde: "4to Secundaria", hasta: "6to Secundaria" },
            { nivel: "Bufeo", desde: "1ro Secundaria", hasta: "3ro Secundaria" },
            { nivel: "Puma", desde: "4to Secundaria", hasta: "6to Secundaria" },
          ],
        },
      ];

      setAreasAsociadas(areasEjemplo);
    } catch (error) {
      console.error("Error al cargar áreas asociadas:", error);
      alert("Error al cargar las áreas asociadas a la olimpiada");
    } finally {
      setCargando(false);
    }
  };

  // Actualizar el costo de un área
  const actualizarCosto = (areaId, nuevoCosto) => {
    setAreasAsociadas(prev => 
      prev.map(area => 
        area.id === areaId 
          ? { ...area, costoInscripcion: nuevoCosto } 
          : area
      )
    );
  };

  // Guardar todas las configuraciones de costo
  const guardarConfiguracion = async () => {
    if (!olimpiadaSeleccionada) {
      alert("Por favor seleccione una olimpiada");
      return;
    }

    setGuardando(true);

    try {
      // Preparar datos para enviar
      const datosAEnviar = {
        id_olimpiada: olimpiadaSeleccionada,
        areas: areasAsociadas.map(area => ({
          id: area.id,
          costoInscripcion: area.costoInscripcion || "0"
        }))
      };

      console.log("Guardando configuración de costos:", datosAEnviar);

      // Aquí se conectaría con la API para guardar los costos
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular guardado

      setMensajeExito("¡Costos asignados exitosamente!");
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (error) {
      console.error("Error al guardar costos:", error);
      alert("Error al guardar la configuración de costos");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <HeaderSelector
        nombreOlimpiada={nombreOlimpiada}
        olimpiadas={olimpiadas}
        olimpiadaSeleccionada={olimpiadaSeleccionada}
        setOlimpiadaSeleccionada={setOlimpiadaSeleccionada}
        titulo="Asignación de Costos"
        subtitulo="Defina los costos de inscripción para las áreas de competencia"
      />

      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        {!olimpiadaSeleccionada ? (
          <div className="p-8 text-center text-gray-600">
            Seleccione una olimpiada para administrar los costos de sus áreas de competencia
          </div>
        ) : cargando ? (
          <div className="p-8 text-center text-gray-600">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
            Cargando áreas de competencia...
          </div>
        ) : areasAsociadas.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            No hay áreas de competencia asociadas a esta olimpiada. 
            Primero debe asignar áreas de competencia en la sección "Asignar Áreas".
          </div>
        ) : (
          <div className="space-y-6">
            {areasAsociadas.map((area) => (
              <AreaCosto
                key={area.id}
                area={area}
                actualizarCosto={(nuevoCosto) => actualizarCosto(area.id, nuevoCosto)}
              />
            ))}
          </div>
        )}

        <AccionesFooter
          guardarConfiguracion={guardarConfiguracion}
          olimpiadaSeleccionada={olimpiadaSeleccionada}
          guardando={guardando}
          mensajeExito={mensajeExito}
          textoBoton="Guardar Costos"
        />
      </div>
    </div>
  );
};

export default AsociarCosto;