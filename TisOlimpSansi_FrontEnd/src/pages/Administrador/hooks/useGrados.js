import { useState, useEffect } from "react";
import { API_URL } from "../../../utils/api";
import axios from "axios";

export const useGrados = () => {
  const [todosLosGrados, setTodosLosGrados] = useState([]);
  const [cargandoGrados, setCargandoGrados] = useState(true);
  const [errorGrados, setErrorGrados] = useState("");

  useEffect(() => {
    const cargarGrados = async () => {
      try {
        setCargandoGrados(true);
        const response = await axios.get(`${API_URL}/grados`, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.data) {
          setTodosLosGrados(response.data.data);
        }
      } catch (error) {
        console.error("Error al cargar grados:", error);
        setErrorGrados("Error al cargar los grados");
      } finally {
        setCargandoGrados(false);
      }
    };

    cargarGrados();
  }, []);

  return {
    todosLosGrados,
    cargandoGrados,
    errorGrados,
  };
};
