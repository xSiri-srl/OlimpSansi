
import { useState, useEffect } from "react"
import { navbarLinksByRole } from "../data/data"
import { IoIosMenu } from "react-icons/io"
import { FaUserCircle } from "react-icons/fa"
import ResponsiveMenu from "./ResponsiveMenu"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import { Link } from "react-router-dom"
import Cookies from 'js-cookie';
const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [role, setRole] = useState("responsable")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [showRegister, setShowRegister] = useState(false)
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [rol, setRol] = useState(1)
  const [registerError, setRegisterError] = useState("")

  const navigate = useNavigate()
  const location = useLocation()

  const endpoint = "http://localhost:8000/api"
  const endpoint2 = "http://localhost:8000"

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user?.role) {
      setRole(user.role)
    }
  }, [location.pathname])

  const navbarLinks = navbarLinksByRole[role] || []

  const loginUser = async (username, password) => {
    
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true
    });


    const csrf = Cookies.get('XSRF-TOKEN');
    axios.defaults.headers.common['X-XSRF-TOKEN'] = csrf;
    try {
      const response = await axios.post(
        `${endpoint2}/login`,
        {
          email: username,
          password: password,
        },
        {
          withCredentials: true,
        },
      )

      return response.data
    } catch (error) {
      throw error.response?.data?.message || "Error en el login"
    }
  }
  const registerUser = async (username, password, rol) => {

    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true,
    });

    // 2. Leer la cookie y forzar el header
    const csrf = Cookies.get('XSRF-TOKEN');
    axios.defaults.headers.common['X-XSRF-TOKEN'] = csrf;

    try {
      const response = await axios.post(
        'http://localhost:8000/registro',
        {
          name: username,
          email: username,
          password: password,
          password_confirmation: password,
          id_rol: rol,
        },
        {
          withCredentials: true, // <-- ESTO FALTABA
        }
      );

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error en el registro";
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const data = await loginUser(username, password)
      setLoginError("")
      setShowLoginModal(false)
      setRole(data.role || "admin")
      localStorage.setItem("user", JSON.stringify(data))
      setShowSidebar(false)
      navigate("/admin/generar-reportes")
    } catch (error) {
      setLoginError(error)
    }
  }
  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const data = await registerUser(newUsername, newPassword)
      alert("Usuario registrado correctamente")
      setShowRegister(false)
      setNewUsername("")
      setNewPassword("")
      setRegisterError("")
    } catch (error) {
      setRegisterError(error)
    }
  }

  return (
    <>
      <nav className="fixed top-0 w-full z-50 shadow-md bg-primary h-24">
        <div className="container mx-auto flex justify-between items-center py-4 px-6 h-full">
          {/* Logo y texto */}
          <div className="flex items-center gap-4">
            <img src="/images/Ohsansi_Logo.png" alt="OlimpSansi Logo" className="h-12 md:h-16 lg:h-20 w-auto" />
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg sm:text-xl">O! SANSI</span>
              <p className="text-white text-xs sm:text-sm">Olimpiada de Ciencia y Tecnología</p>
            </div>
          </div>

          {/* Menú escritorio */}
          <div className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-6 text-white">
            {navbarLinks.map((item) => (
                <li key={item.id}>
                  <Link 
                    to={item.link} 
                    className="hover:text-gray-300 transition duration-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Icono de usuario */}
            <button
              className="ml-4 text-white hover:text-gray-300 transition duration-300 text-2xl"
              onClick={() => setShowSidebar(true)}
              title="Ver perfil"
            >
              <FaUserCircle />
            </button>
          </div>

          {/* Menú móvil */}
          <div className="md:hidden flex items-center gap-4">
            <button className="text-white text-2xl" onClick={() => setShowSidebar(true)} title="Ver perfil">
              <FaUserCircle />
            </button>
            <button onClick={() => setOpen(true)}>
              <IoIosMenu className="text-4xl text-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* Menú responsive */}
      <ResponsiveMenu open={open} setOpen={setOpen} navbarLinks={navbarLinks} />

      {/* Sidebar flotante */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end">
          <div className="w-64 bg-white h-full p-6 shadow-lg relative">
            <button onClick={() => setShowSidebar(false)} className="absolute top-2 right-3 text-gray-600 text-lg">
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Perfil</h2>
            <p className="mb-2">Rol actual:</p>
            <span className="block text-primary font-semibold capitalize mb-4">
              {role === "admin" ? "Administrador" : "Responsable"}
            </span>
            {role !== "admin" && (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
              >
                Iniciar sesión como Administrador
              </button>
            )}
            
           {role === "admin" && (
              //modifciar esto esto esta mal
              <button
              onClick={async () => {
                const csrf = Cookies.get('XSRF-TOKEN');
                axios.defaults.headers.common['X-XSRF-TOKEN'] = csrf;

                await axios.post('http://localhost:8000/logout', {}, {
                  withCredentials: true,
                });
                setRole("responsable");
                localStorage.removeItem("user");
                setShowSidebar(false);
                navigate("/");
              }}
                className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal de login para administrador */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-80 md:w-96 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{showRegister ? "Registro" : "Acceso Administrador"}</h2>
              <button
                onClick={() => {
                  setShowLoginModal(false)
                  setLoginError("")
                  setRegisterError("")
                  setUsername("")
                  setPassword("")
                  setNewUsername("")
                  setNewPassword("")
                  setShowRegister(false)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {showRegister ? (
              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Nuevo usuario</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                {registerError && <p className="text-red-600 text-sm mb-2">{registerError}</p>}
                <button type="submit" className="w-full bg-primary text-white py-2 rounded-md">
                  Registrar
                </button>
                <p className="text-sm text-center mt-3">
                  <button type="button" onClick={() => setShowRegister(false)} className="text-primary underline">
                    Inicia sesión
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Usuario</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                {loginError && <p className="text-red-600 text-sm mb-2">{loginError}</p>}
                <button type="submit" className="w-full bg-primary text-white py-2 rounded-md">
                  Iniciar sesión
                </button>
                <p className="text-sm text-center mt-3">
                  <button type="button" onClick={() => setShowRegister(true)} className="text-primary underline">
                    Regístrate
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar