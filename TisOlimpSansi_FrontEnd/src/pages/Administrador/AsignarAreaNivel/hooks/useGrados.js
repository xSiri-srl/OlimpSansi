import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../../utils/api";

export const useGrados = () => {
  const [todosLosGrados, setTodosLosGrados] = useState([]);

  useEffect(() => {
    const cargarGrados = async () => {
      try {
        const response = await axios.get(`${API_URL}/grados`, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.data) {
          setTodosLosGrados(response.data.data);
        }
      } catch (error) {
        console.error("Error al cargar grados:", error);
      }
    };

    cargarGrados();
  }, []);

  return {
    todosLosGrados,
  };
};