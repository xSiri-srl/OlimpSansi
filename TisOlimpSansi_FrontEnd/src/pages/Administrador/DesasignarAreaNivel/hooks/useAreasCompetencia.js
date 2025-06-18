import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { API_URL } from "../../../../utils/api";

const AREAS_INICIAL = [
  "ASTRONOMIA Y ASTROFISICA",
  "BIOLOGIA",
  "FISICA",
  "INFORMATICA",
  "MATEMATICAS",
  "QUIMICA",
  "ROBOTICA",
].map((area) => ({
  area,
  habilitado: false,
  categorias: [],
  categoriasEliminadas: [],
}));

export const useAreasOlimpiada = () => {
  const [combinaciones, setCombinaciones] = useState(AREAS_INICIAL);
  const [cargandoAreas, setCargandoAreas] = useState(false);

  const normalizarNombre = (nombre) => {
    if (!nombre) return "";
    return nombre
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Z0-9\s\-]/g, "");
  };

  const cargarAreasAsociadas = async (idOlimpiada) => {
    setCargandoAreas(true);
    try {
      await axios.get(`${API_URL}/api/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      const csrfToken = Cookies.get("XSRF-TOKEN");
      const config = {
        headers: {
          "X-XSRF-TOKEN": csrfToken,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      };

      const response = await axios.get(
        `${API_URL}/areas-olimpiada/${idOlimpiada}`,
        config
      );
      if (response.status === 200 && response.data?.data) {
        const areasAsociadas = response.data.data;
        const areasNormalizadasMap = new Map();

        areasAsociadas.forEach((area) => {
          const nombreNormalizado = normalizarNombre(area.area);
          areasNormalizadasMap.set(nombreNormalizado, area);
        });

        setCombinaciones((prev) =>
          prev.map((combo) => {
            const nombreNormalizado = normalizarNombre(combo.area);
            const areaAsociada = areasNormalizadasMap.get(nombreNormalizado);

            if (areaAsociada) {
              return {
                ...combo,
                habilitado: true,
                yaAsociada: true,
                categorias: (areaAsociada.categorias || []).map((cat) => ({
                  ...cat,
                  marcadaParaEliminar: false,
                })),
                categoriasEliminadas: [],
              };
            }

            return {
              ...combo,
              habilitado: false,
              yaAsociada: false,
              categorias: [],
              categoriasEliminadas: [],
            };
          })
        );
      }
    } catch (error) {
      console.error("Error al cargar áreas asociadas:", error);
      setCombinaciones((prev) =>
        prev.map((combo) => ({
          ...combo,
          habilitado: false,
          yaAsociada: false,
          categorias: [],
          categoriasEliminadas: [],
        }))
      );
    } finally {
      setCargandoAreas(false);
    }
  };

  const resetearAreas = () => {
    setCombinaciones(AREAS_INICIAL);
  };

  const marcarCategoriaParaEliminar = (areaName, categoria) => {
    setCombinaciones((prev) =>
      prev.map((combo) => {
        if (combo.area === areaName) {
          return {
            ...combo,
            categorias: combo.categorias.filter(
              (cat) => cat.id !== categoria.id
            ),
            categoriasEliminadas: [...combo.categoriasEliminadas, categoria],
          };
        }
        return combo;
      })
    );
  };

  return {
    combinaciones,
    setCombinaciones,
    cargandoAreas,
    cargarAreasAsociadas,
    resetearAreas,
    marcarCategoriaParaEliminar,
    normalizarNombre,
  };
};
