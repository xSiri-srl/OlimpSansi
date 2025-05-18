import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import obtenerUsuario from "../funciones/obtenerUser";

const RutaPrivada = () => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validarAuth = async () => {
      const user = await obtenerUsuario();
      setAuth(user);
      setLoading(false);
    };

    validarAuth();
  }, []);

  if (loading) return <p>Cargando...</p>;

  if (!auth) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default RutaPrivada;
