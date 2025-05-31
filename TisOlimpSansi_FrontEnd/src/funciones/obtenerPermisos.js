import axios from 'axios';
const obtenerPermisos = async () => {
  try {
    const response = await axios.get('http://localhost:8000/permisos', {
      withCredentials: true
    });
    console.log('Permisos del usuario:', response.data.permisos);
  } catch (error) {
    console.error('No se pudieron obtener los permisos:', error);
  }
};

export default obtenerPermisos;