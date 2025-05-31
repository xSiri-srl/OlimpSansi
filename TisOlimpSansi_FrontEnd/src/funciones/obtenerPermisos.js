import api from '../utils/api';
const obtenerPermisos = async () => {
  try {
    const response = await api.get('/permisos', {
      withCredentials: true
    });
    console.log('Permisos del usuario:', response.data.permisos);
  } catch (error) {
    console.error('No se pudieron obtener los permisos:', error);
  }
};

export default obtenerPermisos;