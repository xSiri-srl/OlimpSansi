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

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const savedRole = user?.role || "responsable";
    setRole(savedRole);
  }, []);

  const navbarLinks = navbarLinksByRole[role] || [];

  const toggleRole = () => {
    const newRole = role === "responsable" ? "admin" : "responsable";
    setRole(newRole);
    localStorage.setItem("user", JSON.stringify({ role: newRole }));
    setShowSidebar(false);
    navigate(newRole === "admin" ? "/home-admin" : "/");
  };

  return (
    <>
      <nav className="bg-primary">
        <div className="container mx-auto flex justify-between items-center py-6 px-6">
          {/* Logo */}
          <div className="text-2xl flex items-center gap-2 font-bold uppercase">
            <img
              src="/images/Ohsansi_Logo.png"
              alt="OlimpSansi Logo"
              className="h-12 md:h-20 lg:h-24 w-auto"
            />
            <p className="text-white text-sm mt-8">
              Olimpiada de Ciencia y Tecnología
            </p>
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
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex justify-end">
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
    </>
  );
};

export default Navbar;
