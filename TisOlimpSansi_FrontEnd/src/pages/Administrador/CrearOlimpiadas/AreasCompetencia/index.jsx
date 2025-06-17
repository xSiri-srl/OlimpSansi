import { useState, useEffect } from "react";

import AreaCompetencia from "./AreaCompetencia";

import { gradosDisponibles, areasDefault } from "./constants";
import AccionesFooter from "../../components/AccionesFooter";
import HeaderSelector from "../../components/HeaderSelector";

const AreasCompetenciaManager = () => {
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [olimpiadaSeleccionada, setOlimpiadaSeleccionada] = useState("");
  const [nombreOlimpiada, setNombreOlimpiada] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  const [combinaciones, setCombinaciones] = useState([
    {
      area: "",
      modoRango: false,
      niveles: [{ grado: "", categoria: "" }],
      categoriasRango: [{ rangoInicial: "", rangoFinal: "", nombre: "" }],
    },
  ]);

  useEffect(() => {
    setOlimpiadas([
      { id: 1, titulo: "Olimpiada Nacional de Matemática 2025" },
      { id: 2, titulo: "Olimpiada de Ciencia Escolar 2025" },
      { id: 3, titulo: "Olimpiada de Lógica y Pensamiento 2025" },
    ]);
  }, []);

  useEffect(() => {
    if (olimpiadaSeleccionada) {
      const olimpiada = olimpiadas.find(
        (o) => o.id.toString() === olimpiadaSeleccionada
      );
      setNombreOlimpiada(olimpiada ? olimpiada.titulo : "");
    } else {
      setNombreOlimpiada("");
    }
  }, [olimpiadaSeleccionada, olimpiadas]);

  const agregarCombinacion = () => {
    setCombinaciones([
      ...combinaciones,
      {
        area: "",
        modoRango: false,
        niveles: [{ grado: "", categoria: "" }],
        categoriasRango: [{ rangoInicial: "", rangoFinal: "", nombre: "" }],
      },
    ]);
  };

  const eliminarCombinacion = (index) => {
    if (combinaciones.length > 1) {
      const nuevaLista = combinaciones.filter((_, i) => i !== index);
      setCombinaciones(nuevaLista);
    } else {
      alert("Debe mantener al menos una combinación de área");
    }
  };
  

  const guardarConfiguracion = async () => {
    if (!olimpiadaSeleccionada) {
      alert("Por favor seleccione una olimpiada");
      return;
    }
  if (areasHabilitadas.length === 0) {
    alert("Debe habilitar al menos un área de competencia");
    return;
  }
    const areasSinCategorias = areasHabilitadas.filter(combo => 
    !combo.categorias || combo.categorias.length === 0
  );
  
  if (areasSinCategorias.length > 0) {
    const areasNombres = areasSinCategorias.map(a => a.area).join(", ");
    alert(`Las siguientes áreas no tienen categorías definidas: ${areasNombres}. Debe definir al menos una categoría por área.`);
    return;
  }
    areasHabilitadas.forEach(combo => {
    const categoriasVistas = new Set();
    
    combo.categorias.forEach(cat => {
      if (categoriasVistas.has(cat.nombre)) {
        tieneCategoriaDuplicada = true;
        areaDuplicada = combo.area;
        categoriaDuplicada = cat.nombre;
      } else {
        categoriasVistas.add(cat.nombre);
      }
    });
  });
  
  if (tieneCategoriaDuplicada) {
    alert(`Error: El área "${areaDuplicada}" tiene la categoría "${categoriaDuplicada}" duplicada. No se pueden asociar dos categorías iguales a la misma área.`);
    return;
  }
    let datosCompletos = true;
    let mensaje = "";

    combinaciones.forEach((combo) => {
      if (!combo.area || (combo.area === "Otra" && !combo.areaPersonalizada)) {
        datosCompletos = false;
        mensaje = "Todas las áreas deben tener un nombre válido";
      }

      if (combo.modoRango) {
        let rangoValido = true;
        combo.categoriasRango.forEach((cat) => {
          if (!cat.rangoInicial || !cat.rangoFinal || !cat.nombre) {
            datosCompletos = false;
            mensaje =
              "Todos los campos de rango y categoría deben estar completos";
          }
          if (
            gradosDisponibles.indexOf(cat.rangoInicial) >
            gradosDisponibles.indexOf(cat.rangoFinal)
          ) {
            rangoValido = false;
          }
        });

        if (!rangoValido) {
          datosCompletos = false;
          mensaje =
            "El grado inicial no puede ser mayor que el grado final en alguna categoría";
        }
      } else {
        combo.niveles.forEach((nivel) => {
          if (!nivel.grado || !nivel.categoria) {
            datosCompletos = false;
            mensaje = "Todos los grados y categorías deben estar completos";
          }
        });
      }
    });

    if (!datosCompletos) {
      alert(mensaje || "Por favor complete todos los campos antes de guardar");
      return;
    }

    setGuardando(true);

    try {
      const datosAEnviar = combinaciones.map((combo) => {
        const comboCopia = { ...combo };
        if (combo.area === "Otra" && combo.areaPersonalizada) {
          comboCopia.area = combo.areaPersonalizada;
          delete comboCopia.areaPersonalizada;
        }
        return comboCopia;
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMensajeExito("¡Configuración guardada exitosamente!");
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (error) {
      alert("Error al guardar la configuración");
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
      />

      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Configuración de Áreas y Categorías
        </h3>

        {combinaciones.map((combo, comboIndex) => (
          <AreaCompetencia
            key={comboIndex}
            combo={combo}
            comboIndex={comboIndex}
            combinaciones={combinaciones}
            setCombinaciones={setCombinaciones}
            eliminarCombinacion={eliminarCombinacion}
          />
        ))}

        <AccionesFooter
          agregarCombinacion={agregarCombinacion}
          guardarConfiguracion={guardarConfiguracion}
          olimpiadaSeleccionada={olimpiadaSeleccionada}
          guardando={guardando}
          mensajeExito={mensajeExito}
        />
      </div>
    </div>
  );
};

export default AreasCompetenciaManager;
