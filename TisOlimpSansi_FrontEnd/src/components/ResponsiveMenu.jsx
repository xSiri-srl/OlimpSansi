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
          className="fixed top-0 right-0 w-3/4 h-full bg-primary text-white shadow-lg z-50 flex flex-col items-center p-6"
        >
          {/* Botón de cerrar */}
          <div className="w-full flex justify-end">
            <button onClick={() => setOpen(false)}>
              <IoMdClose className="text-3xl text-white" />
            </button>
          </div>

          {/* Links del menú */}
          <ul className="flex flex-col gap-6 text-lg mt-10">
            {navbarLinks.map((item) => (
              <li key={item.id}>
                <a
                  href={item.link}
                  onClick={() => setOpen(false)} // Cierra el menú al hacer clic en un enlace
                  className="hover:text-gray-300 transition duration-300"
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
