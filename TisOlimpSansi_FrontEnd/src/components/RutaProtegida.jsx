import { Navigate } from "react-router-dom"
import Cookies from "js-cookie"

const RutaProtegida = ({ children }) => {
  const token = Cookies.get("XSRF-TOKEN")
  const userString = localStorage.getItem("user")
  const user = userString ? JSON.parse(userString) : null

  if (!token || !user) {
    return <Navigate to="/login" />
  }

  return children
}

export default RutaProtegida
