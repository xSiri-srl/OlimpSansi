import React, { useState, useEffect } from "react";
import { navbarLinksByRole } from "../data/data";
import { IoIosMenu } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import ResponsiveMenu from "./ResponsiveMenu";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [role, setRole] = useState("responsable");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const savedRole = user?.role || "responsable";
    setRole(savedRole);
  }, []);

  const navbarLinks = navbarLinksByRole[role] || [];

  const handleLogin = (e) => {
    e.preventDefault();

    // Verificar credenciales
    if (username === "ohsansi" && password === "nosabemos") {
      // Credenciales correctas
      setLoginError("");
      setShowLoginModal(false);

      // Cambiar rol a admin
      setRole("admin");
      localStorage.setItem("user", JSON.stringify({ role: "admin" }));
      setShowSidebar(false);
      navigate("/admin/generar-reportes");

      // Limpiar el formulario
      setUsername("");
      setPassword("");
    } else {
      // Credenciales incorrectas
      setLoginError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    }
  };

  const toggleRole = () => {
    if (role === "responsable") {
      // Si intenta cambiar a admin, mostrar modal de login
      setShowLoginModal(true);
    } else {
      // Si ya es admin y quiere volver a responsable, cambiar directamente
      setRole("responsable");
      localStorage.setItem("user", JSON.stringify({ role: "responsable" }));
      setShowSidebar(false);
      navigate("/");
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 shadow-md bg-primary h-24">
        <div className="container mx-auto flex justify-between items-center py-4 px-6 h-full">
          {/* Logo y texto */}
          <div className="flex items-center gap-4">
            <img
              src="/images/Ohsansi_Logo.png"
              alt="OlimpSansi Logo"
              className="h-12 md:h-16 lg:h-20 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg sm:text-xl">
                O! SANSI
              </span>
              <p className="text-white text-xs sm:text-sm">
                Olimpiada de Ciencia y Tecnología
              </p>
            </div>
          </div>

          {/* Menú escritorio */}
          <div className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-6 text-white">
              {navbarLinks.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.link}
                    className="hover:text-gray-300 transition duration-300"
                  >
                    {item.title}
                  </a>
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
            <button
              className="text-white text-2xl"
              onClick={() => setShowSidebar(true)}
              title="Ver perfil"
            >
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
            <button
              onClick={() => setShowSidebar(false)}
              className="absolute top-2 right-3 text-gray-600 text-lg"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Perfil</h2>
            <p className="mb-2">Rol actual:</p>
            <span className="block text-primary font-semibold capitalize mb-4">
              {role === "admin" ? "Administrador" : "Responsable"}
            </span>
            <button
              onClick={toggleRole}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Cambiar a {role === "admin" ? "Responsable" : "Administrador"}
            </button>
          </div>
        </div>
      )}

      {/* Modal de login para administrador */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-80 md:w-96 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Acceso Administrador
              </h2>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError("");
                  setUsername("");
                  setPassword("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  Usuario
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              {loginError && (
                <div className="mb-4 text-sm text-red-600">{loginError}</div>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Iniciar sesión
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
