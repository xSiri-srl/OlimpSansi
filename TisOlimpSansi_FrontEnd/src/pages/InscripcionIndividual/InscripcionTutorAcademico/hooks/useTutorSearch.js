import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../utils/api";

export function useTutorSearch({ setTutoresPorArea, setErrors }) {
  const [searchingTutores, setSearchingTutores] = useState({});
  const [tutoresEncontrados, setTutoresEncontrados] = useState({});

  const buscarTutorPorCI = async (ci, area) => {
    if (ci?.length >= 7) {
      setSearchingTutores((prev) => ({
        ...prev,
        [area]: true,
      }));

      try {
        const response = await axios.get(`${API_URL}/api/buscar-tutor/${ci}`);

        if (response.data.found) {
          const tutor = response.data.tutor;

          setTutoresPorArea((prev) => ({
            ...prev,
            [area]: {
              ...prev[area],
              apellidoPaterno: tutor.apellido_pa || "",
              apellidoMaterno: tutor.apellido_ma || "",
              nombres: tutor.nombre || "",
              correo: tutor.correo || "",
              ci: tutor.ci,
            },
          }));

          setTutoresEncontrados((prev) => ({
            ...prev,
            [area]: true,
          }));

        } else {
          setTutoresEncontrados((prev) => ({
            ...prev,
            [area]: false,
          }));
        }
      } catch (error) {
        console.error("Error al buscar tutor:", error);
        setErrors((prev) => ({
          ...prev,
          [`${area}-ci`]: "Error al buscar en la base de datos. Intente de nuevo.",
        }));
      } finally {
        setSearchingTutores((prev) => ({
          ...prev,
          [area]: false,
        }));
      }
    }
  };

  return {
    searchingTutores,
    tutoresEncontrados,
    setTutoresEncontrados,
    buscarTutorPorCI,
  };
}