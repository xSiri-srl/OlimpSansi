"use client";
import { useEffect, useState, useMemo } from "react";
import { API_URL } from "../../../../../../utils/api";
import axios from "axios";
import { useFormData } from "../../../form-context";

const AreasCompetencia = ({
  estudianteData,
  areasActuales,
  handleChange,
  tieneError,
  campoEditable,
  errores,
}) => {
  const [areasHabilitadas, setAreasHabilitadas] = useState([]);
  const [areasLoaded, setAreasLoaded] = useState(false);
  const [gradoAreaCurso, setGradoAreaCurso] = useState({});
  const { globalData, setGlobalData } = useFormData();

  useEffect(() => {
    const obtenerAreasHabilitadas = async () => {
      try {
        const olimpiadaId = globalData.olimpiada;
        const response = await axios.get(
            `${API_URL}/api/curso-area-categoria-por-olimpiada?id=${olimpiadaId}`
          );

        const data = response.data || {};
        setGradoAreaCurso(data || {});
        setAreasLoaded(true);
      } catch (error) {
        console.error("Error obteniendo áreas habilitadas:", error);
        setGradoAreaCurso({});
        setAreasLoaded(true);
      }
    };

    if (globalData.olimpiada) {
      obtenerAreasHabilitadas();
    }
  }, [globalData.olimpiada]);

  // Obtener áreas disponibles para el curso del estudiante
  const areasDisponiblesPorCurso = useMemo(() => {
    const curso = estudianteData.colegio?.curso;
    if (!curso || !gradoAreaCurso[curso]) {
      return {};
    }
    return gradoAreaCurso[curso].areas || {};
  }, [gradoAreaCurso, estudianteData.colegio?.curso]);

  // Obtener lista de áreas disponibles
  const areas = useMemo(() => {
    return Object.keys(areasDisponiblesPorCurso);
  }, [areasDisponiblesPorCurso]);

  const normalizeString = (str) => {
    if (!str) return "";
    return str
      .toString()
      .trim()
      .toUpperCase()
      .replace(/Á/g, "A")
      .replace(/É/g, "E")
      .replace(/Í/g, "I")
      .replace(/Ó/g, "O")
      .replace(/Ú/g, "U")
      .replace(/Ñ/g, "N");
  };

  // FUNCIÓN CORREGIDA: Validar que la categoría esté disponible para el curso específico del estudiante
  const esCategoriaValida = (area, categoria) => {
    if (!categoria || !area) return true;

    const curso = estudianteData.colegio?.curso;
    if (!curso) return false;

    // Verificar que el curso tenga esta área y categoría específica
    if (!gradoAreaCurso[curso] || !gradoAreaCurso[curso].areas) {
      return false;
    }

    const areaNormalizada = normalizeString(area);
    const areaKey = Object.keys(gradoAreaCurso[curso].areas).find(
      (key) => normalizeString(key) === areaNormalizada
    );

    if (!areaKey || !gradoAreaCurso[curso].areas[areaKey]) {
      return false;
    }

    const categoriasDisponibles = gradoAreaCurso[curso].areas[areaKey];
    return categoriasDisponibles.some(
      (cat) => normalizeString(cat) === normalizeString(categoria)
    );
  };

  const obtenerCategorias = (area) => {
    if (!area) return [];

    const areaNormalizada = normalizeString(area);
    const areaKey = Object.keys(areasDisponiblesPorCurso).find(
      (key) => normalizeString(key) === areaNormalizada
    );

    if (!areaKey || !areasDisponiblesPorCurso[areaKey]) {
      return [];
    }

    // Eliminar duplicados si los hay
    const categorias = areasDisponiblesPorCurso[areaKey];
    return [...new Set(categorias)];
  };

  const handleCategoriaChange = (e, sectionIndex) => {
    const selectedCategory = e.target.value;
    handleChange(`area_${sectionIndex}`, "categoria", selectedCategory);
  };

  const obtenerErrorCategoria = (area, categoria, index) => {
    if (!categoria || !area) return null;

    if (!esCategoriaValida(area, categoria)) {
      return `La categoría "${categoria}" no está habilitada para ${area} en ${estudianteData.colegio?.curso || "este curso"}`;
    }

    return null;
  };

  const esAreaHabilitada = (area) => {
    if (!area) return false;

    const areaNormalizada = normalizeString(area);
    return Object.keys(areasDisponiblesPorCurso).some(
      (areaKey) => normalizeString(areaKey) === areaNormalizada
    );
  };

  const areaTieneCategorias = (area) => {
    if (!area) return false;
    const categorias = obtenerCategorias(area);
    return categorias.length > 0;
  };

  const esCategoriaEditable = (index) => {
    const tieneErrorCategoria = tieneError(`categoria_${index}`);
    const tieneErrorValidacion = obtenerErrorCategoria(
      areasActuales[index]?.nombre_area,
      areasActuales[index]?.categoria,
      index
    );

    const areaActual = areasActuales[index]?.nombre_area;
    const areaHabilitada = esAreaHabilitada(areaActual);
    const tieneCategorias = areaTieneCategorias(areaActual);

    return (
      campoEditable(`categoria_${index}`) ||
      tieneErrorCategoria ||
      tieneErrorValidacion ||
      (areaHabilitada && tieneCategorias)
    );
  };

  const esAreaEditable = () => {
    const tieneErrorArea = tieneError("areas");

    const areaNoHabilitada =
      areasActuales[0]?.nombre_area &&
      !esAreaHabilitada(areasActuales[0].nombre_area);

    const areaSinCategorias =
      areasActuales[0]?.nombre_area &&
      esAreaHabilitada(areasActuales[0].nombre_area) &&
      !areaTieneCategorias(areasActuales[0].nombre_area);

    return (
      campoEditable("areas") ||
      tieneErrorArea ||
      areaNoHabilitada ||
      areaSinCategorias
    );
  };

  if (!areasLoaded) {
    return (
      <div className="space-y-4">
        <h4 className="font-medium text-blue-700 border-b pb-1">
          ÁREA DE COMPETENCIA
        </h4>
        <div className="text-gray-500 text-center py-4">
          Cargando áreas disponibles...
        </div>
      </div>
    );
  }

  // Si no hay curso definido o no hay áreas para ese curso
  if (!estudianteData.colegio?.curso || areas.length === 0) {
    return (
      <div className="space-y-4">
        <h4 className="font-medium text-blue-700 border-b pb-1">
          ÁREA DE COMPETENCIA
        </h4>
        <div className="text-gray-500 text-center py-4">
          {!estudianteData.colegio?.curso 
            ? "Debe seleccionar un curso para ver las áreas disponibles"
            : `No hay áreas disponibles para ${estudianteData.colegio.curso}`
          }
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-blue-700 border-b pb-1">
        ÁREA DE COMPETENCIA
      </h4>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            Área de competencia para {estudianteData.colegio?.curso}
          </label>
          <div className="flex gap-2">
            <select
              className={`mt-1 p-2 w-full border rounded-md ${
                tieneError("areas") ? "border-red-500 bg-red-50" : ""
              } ${!esAreaEditable() ? "bg-gray-100" : ""}`}
              value={areasActuales[0]?.nombre_area || ""}
              onChange={(e) => {
                handleChange("area_0", "nombre_area", e.target.value);
                handleChange("area_0", "categoria", "");
              }}
              disabled={!esAreaEditable()}
            >
              <option value="">Seleccione un área</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
          {tieneError("areas") && (
            <p className="text-red-500 text-xs mt-1">{errores.areas}</p>
          )}
          {areasActuales[0]?.nombre_area &&
            !esAreaHabilitada(areasActuales[0].nombre_area) && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                El área "{areasActuales[0].nombre_area}" no está habilitada para {estudianteData.colegio?.curso || "este curso"} en esta olimpiada
              </p>
            )}
          {areasActuales[0]?.nombre_area &&
            esAreaHabilitada(areasActuales[0].nombre_area) &&
            !areaTieneCategorias(areasActuales[0].nombre_area) && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                El área "{areasActuales[0].nombre_area}" no tiene categorías disponibles para {estudianteData.colegio?.curso || "este curso"}
              </p>
            )}
        </div>

        {areasActuales[0]?.nombre_area && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              Categoría para {areasActuales[0].nombre_area}
            </label>
            <select
              className={`mt-1 p-2 w-full border rounded-md ${
                tieneError("categoria_0") ||
                obtenerErrorCategoria(
                  areasActuales[0].nombre_area,
                  areasActuales[0]?.categoria,
                  0
                )
                  ? "border-red-500 bg-red-50"
                  : ""
              } ${!esCategoriaEditable(0) ? "bg-gray-100" : ""}`}
              value={areasActuales[0]?.categoria || ""}
              onChange={(e) => handleCategoriaChange(e, 0)}
              disabled={!esCategoriaEditable(0)}
            >
              <option value="">Seleccione una categoría</option>
              {obtenerCategorias(areasActuales[0].nombre_area).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {tieneError("categoria_0") && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errores.categoria_0}
              </p>
            )}
            {obtenerErrorCategoria(
              areasActuales[0].nombre_area,
              areasActuales[0]?.categoria,
              0
            ) && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {obtenerErrorCategoria(
                  areasActuales[0].nombre_area,
                  areasActuales[0]?.categoria,
                  0
                )}
              </p>
            )}
          </div>
        )}

        {areasActuales[1]?.nombre_area && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              Categoría para {areasActuales[1].nombre_area}
            </label>
            <select
              className={`mt-1 p-2 w-full border rounded-md ${
                tieneError("categoria_1") ||
                obtenerErrorCategoria(
                  areasActuales[1].nombre_area,
                  areasActuales[1]?.categoria,
                  1
                )
                  ? "border-red-500 bg-red-50"
                  : ""
              } ${!esCategoriaEditable(1) ? "bg-gray-100" : ""}`}
              value={areasActuales[1]?.categoria || ""}
              onChange={(e) => handleCategoriaChange(e, 1)}
              disabled={!esCategoriaEditable(1)}
            >
              <option value="">Seleccione una categoría</option>
              {obtenerCategorias(areasActuales[1].nombre_area).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {tieneError("categoria_1") && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errores.categoria_1}
              </p>
            )}
            {obtenerErrorCategoria(
              areasActuales[1].nombre_area,
              areasActuales[1]?.categoria,
              1
            ) && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {obtenerErrorCategoria(
                  areasActuales[1].nombre_area,
                  areasActuales[1]?.categoria,
                  1
                )}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AreasCompetencia;