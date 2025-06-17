import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../../../../utils/api";

export const useAreasCompetencia = () => {
  const [combinaciones, setCombinaciones] = useState([
    {
      area: "ASTRONOMIA Y ASTROFISICA",
      habilitado: false,
      categorias: [],
    },
    {
      area: "BIOLOGIA",
      habilitado: false,
      categorias: [],
    },
    {
      area: "FISICA",
      habilitado: false,
      categorias: [],
    },
    {
      area: "INFORMATICA",
      habilitado: false,
      categorias: [],
    },
    {
      area: "MATEMATICAS",
      habilitado: false,
      categorias: [],
    },
    {
      area: "QUIMICA",
      habilitado: false,
      categorias: [],
    },
    {
      area: "ROBOTICA",
      habilitado: false,
      categorias: [],
    },
  ]);
  const [cargandoAreas, setCargandoAreas] = useState(false);

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

      if (response.status === 200 && response.data.data) {
        const areasAsociadas = response.data.data;

        const normalizarNombre = (nombre) => {
          if (!nombre) return "";
          return nombre
            .toUpperCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^A-Z0-9\s\-]/g, "");
        };

        const areasNormalizadasMap = new Map();

        areasAsociadas.forEach((area) => {
          const nombreNormalizado = normalizarNombre(area.area);
          areasNormalizadasMap.set(nombreNormalizado, area);
        });

        setCombinaciones((prev) => {
          const nuevasCombinaciones = prev.map((combo) => {
            const nombreNormalizado = normalizarNombre(combo.area);
            const areaAsociada = areasNormalizadasMap.get(nombreNormalizado);

            if (areaAsociada) {
              return {
                ...combo,
                habilitado: true,
                yaAsociada: true,
                categorias: areaAsociada.categorias || [],
              };
            } else {
              return {
                ...combo,
                habilitado: false,
                yaAsociada: false,
                categorias: [],
              };
            }
          });

          return nuevasCombinaciones;
        });
      }
    } catch (error) {
      console.error("Error al cargar áreas asociadas:", error);
      setCombinaciones((prev) =>
        prev.map((combo) => ({
          ...combo,
          habilitado: false,
          yaAsociada: false,
          categorias: [],
        }))
      );
    } finally {
      setCargandoAreas(false);
    }
  };

  const resetAreas = () => {
    setCombinaciones((prev) =>
      prev.map((combo) => ({ ...combo, habilitado: false }))
    );
  };

  return {
    combinaciones,
    setCombinaciones,
    cargandoAreas,
    cargarAreasAsociadas,
    resetAreas,
  };
};