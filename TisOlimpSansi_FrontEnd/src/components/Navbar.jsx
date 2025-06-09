import { useState, useEffect } from "react"
import { navbarLinksByRole } from "../data/data"
import { IoIosMenu } from "react-icons/io"
import { FaUserCircle } from "react-icons/fa"
import ResponsiveMenu from "./ResponsiveMenu"
import axios from "axios"
import { useNavigate, useLocation, Link } from "react-router-dom"
import Cookies from "js-cookie"
import { API_URL } from "../utils/api"
import obtenerUsuario from "../funciones/obtenerUser"

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // nombres legibles para mostrar en el perfil
  const roleNames = {
    0: "Responsable",
    1: "Reportes",
    2: "CreadorOlimpiada",
  };

  
  useEffect(() => {
    (async () => {
      const usuario = await obtenerUsuario();
      if (usuario) setRole(usuario.id_rol);
    })();
  }, [location.pathname]);


  const navbarLinks = navbarLinksByRole[role] || navbarLinksByRole[0];

  const handleLogout = async () => {
    const csrf = Cookies.get("XSRF-TOKEN")
    axios.defaults.headers.common["X-XSRF-TOKEN"] = csrf

    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true })
    setRole(0)
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
              {role === 1 ? "AdminCreador":"Responsable"}
            </span>

            {role ===0 ? (
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
