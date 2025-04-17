import React, { useState } from "react";
import { navbarLinks } from "../data/data";
import { IoIosMenu } from "react-icons/io";
import ResponsiveMenu from "./ResponsiveMenu";

const Navbar = () => {
  const [open, setOpen] = useState(false);

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
            <p className="text-gray-600 text-sm mt-8 ">Olimpiada de Ciencia y Tecnología</p>
            
          </div>
          

          {/* Menú de navegación (escritorio) */}
          <div className="hidden md:flex">
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
          </div>

          {/* Icono del menú móvil */}
          <div className="md:hidden">
            <button onClick={() => setOpen(true)}>
              <IoIosMenu className="text-4xl text-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* Menú móvil */}
      <ResponsiveMenu open={open} setOpen={setOpen} navbarLinks={navbarLinks} />
    </>
  );
};

export default Navbar;
