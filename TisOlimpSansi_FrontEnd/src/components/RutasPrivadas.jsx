import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import obtenerUsuario from "../funciones/obtenerUser";

const RutaPrivada = () => {
  
  return <Outlet />;
};

export default RutaPrivada;
