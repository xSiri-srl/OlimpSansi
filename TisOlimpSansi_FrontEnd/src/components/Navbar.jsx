import { useState, useEffect } from "react"
import { navbarLinksByRole } from "../data/data"
import { IoIosMenu } from "react-icons/io"
import { FaUserCircle } from "react-icons/fa"
import ResponsiveMenu from "./ResponsiveMenu"
import axios from "axios"
import { useNavigate, useLocation, Link } from "react-router-dom"
import Cookies from "js-cookie"
import api from "../utils/api"

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [role, setRole] = useState("responsable")
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {

    const rol = JSON.parse(localStorage.getItem("user"))?.user?.id_rol
    if (rol) {
      setRole("admin")
    }
  }, [location.pathname])

  const navbarLinks = navbarLinksByRole[role] || []

  const handleLogout = async () => {
    const csrf = Cookies.get("XSRF-TOKEN")
    axios.defaults.headers.common["X-XSRF-TOKEN"] = csrf

    await api.post("/logout", {}, { withCredentials: true })
    localStorage.removeItem("user")
    localStorage.clear();
    setRole("responsable")
    setShowSidebar(false)
    navigate("/")
  }

  return (
    <>
      <nav className="fixed top-0 w-full z-50 shadow-md bg-primary h-24">
        <div className="container mx-auto flex justify-between items-center py-4 px-6 h-full">
          <div className="flex items-center gap-4">
            <img src="/images/Ohsansi_Logo.png" alt="Logo" className="h-12 md:h-16 lg:h-20 w-auto" />
            <div>
              <span className="text-white font-bold text-lg sm:text-xl">O! SANSI</span>
              <p className="text-white text-xs sm:text-sm">Olimpiada de Ciencia y Tecnología</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-6 text-white">
              {navbarLinks.map((item) => (
                <li key={item.id}>
                  <Link to={item.link} className="hover:text-gray-300 transition">{item.title}</Link>
                </li>
              ))}
            </ul>
            <button
              className="ml-4 text-white hover:text-gray-300 text-2xl"
              onClick={() => setShowSidebar(true)}
              title="Ver perfil"
            >
              <FaUserCircle />
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button className="text-white text-2xl" onClick={() => setShowSidebar(true)}>
              <FaUserCircle />
            </button>
            <button onClick={() => setOpen(true)}>
              <IoIosMenu className="text-4xl text-white" />
            </button>
          </div>
        </div>
      </nav>

      <ResponsiveMenu open={open} setOpen={setOpen} navbarLinks={navbarLinks} />

      {showSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end">
          <div className="w-64 bg-white h-full p-6 shadow-lg relative">
            <button onClick={() => setShowSidebar(false)} className="absolute top-2 right-3 text-gray-600 text-lg">✕</button>
            <h2 className="text-xl font-bold mb-4">Perfil</h2>
            <p className="mb-2">Rol actual:</p>
            <span className="block text-primary font-semibold capitalize mb-4">
              {role === "admin" ? "Administrador" : "Responsable"}
            </span>

            {role !== "admin" ? (
              <button
                
                onClick={() => {
                  setShowSidebar(false) 
                  navigate("/login")}}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
              >
                Iniciar sesión
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
