import axios from 'axios';

const obtenerUsuario = async () => {
  try {
    const response = await axios.get("http://localhost:8000/user", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("No autenticado o error:", error);
    return null;
  }
};

export default obtenerUsuario;