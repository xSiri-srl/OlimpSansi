import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";

const ResponsiveMenu = ({ open, setOpen, navbarLinks }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 right-0 w-3/4 h-full bg-gray-900 bg-opacity-95 text-white shadow-2xl z-50 flex flex-col items-center p-8"
        >
          {/* Botón de cerrar */}
          <div className="w-full flex justify-end mb-6">
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-gray-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-2"
              aria-label="Cerrar menú"
            >
              <IoMdClose className="text-4xl" />
            </button>
          </div>

    
          <h2 className="text-2xl font-bold text-gray-200 mb-8 text-center">
            Menú
          </h2>

          {/* Links del menú */}
          <ul className="flex flex-col gap-8 w-full">
            {navbarLinks.map((item) => (
              <li key={item.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                <a
                  href={item.link}
                  onClick={() => setOpen(false)} 
                  className="block p-4 rounded-lg hover:bg-gray-800 hover:text-gray-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 text-xl font-medium"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;