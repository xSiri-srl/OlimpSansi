
import api from '../utils/api';

const obtenerUsuario = async () => {
  try {
    const response = await api.get("/user", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("No autenticado o error:", error);
    return null;
  }
};

export default obtenerUsuario;