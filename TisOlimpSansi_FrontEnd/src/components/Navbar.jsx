import React from "react";
import { navbarLinks } from "../data/data";

const Navbar = () => {
  return (
    <nav className="bg-primary">
      <div className="container flex justify-between items-center py-8">
        {/* Logo de OlimpSansi */}
        <div className="text-2xl flex items-center gap-2 font-bold uppercase">
        <img src="/images/Olimp_logo.png" alt="OlimpSansi Logo" className="h-12 w-auto" />

        <p className="text-white">Olimp</p>
          <p className="text-secondary">Sansi</p>
        </div>

        {/* Menú de navegación */}
        <div className="hidden md:flex">
          <ul className="flex items-center gap-6 text-white">
            {navbarLinks.map((item) => (
              <li key={item.id}>
                <a href={item.link} className="hover:text-gray-900 transition-colors duration-300">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile sidebar section (por implementar) */}
      </div>
    </nav>
  );
};

export default Navbar;
