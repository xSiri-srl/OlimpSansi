import { Navigate, Outlet } from "react-router-dom"
import Cookies from "js-cookie"

const RutaPrivada = () => {
  // Verificar si el usuario está autenticado
  const token = Cookies.get("XSRF-TOKEN")
  const userString = localStorage.getItem("user")
  const user = userString ? JSON.parse(userString) : null


  if (!token || !user) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}

export default RutaPrivada
