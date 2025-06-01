import axios from 'axios';
import { API_URL } from '../utils/api';

const obtenerUsuario = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("No autenticado o error:", error);
    return null;
  }
};

export default obtenerUsuario;