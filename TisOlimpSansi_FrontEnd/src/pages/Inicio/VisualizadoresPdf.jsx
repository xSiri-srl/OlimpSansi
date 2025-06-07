import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaTiktok, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProcesoInscripcion from "./ProcesoInscripcion";

const VisualizadoresPdf = ({ pdfUrls }) => {
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState(false);
  const sliderRef = React.useRef(null);

  // Add safety check
  if (!pdfUrls || pdfUrls.length === 0) {
    return (
      <div className="py-12 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Convocatorias por Área
            </span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">No hay convocatorias disponibles en este momento.</p>
        </div>
      </div>
    );
  }

  const handleIframeLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError(true);
  };
  
  // Componentes personalizados para los botones de navegación
  const NextArrow = ({ onClick }) => (
    <motion.div 
      className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
    >
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full shadow-lg">
        <FaChevronRight className="text-white text-xl" />
      </div>
    </motion.div>
  );

  const PrevArrow = ({ onClick }) => (
    <motion.div 
      className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full shadow-lg">
        <FaChevronLeft className="text-white text-xl" />
      </div>
    </motion.div>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: "0",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current, next) => setActiveIndex(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false
        }
      }
    ],
    appendDots: dots => (
      <div className="custom-dots">
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div className="custom-dot">
        <div 
          className={`h-3 w-3 rounded-full transition-all duration-300 ease-in-out my-4 mx-1 ${i === activeIndex ? 'bg-purple-600 scale-125' : 'bg-gray-300'}`} 
        />
      </div>
    )
  };

  const IndicadorCarga = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-gray-600">Cargando PDF...</p>
      </div>
    </div>
  );

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="py-12 bg-gray-100"
      >
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Convocatorias por Área
            </span>
          </h2>

          <div className="sm:hidden flex justify-between items-center mb-6 px-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full shadow-lg"
              onClick={() => sliderRef.current.slickPrev()}
            >
              <FaChevronLeft className="text-white text-xl" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full shadow-lg"
              onClick={() => sliderRef.current.slickNext()}
            >
              <FaChevronRight className="text-white text-xl" />
            </motion.button>
          </div>

          {/* Carrusel de áreas */}
          <div className="relative max-w-6xl mx-auto px-8 mb-16">
            <Slider ref={sliderRef} {...settings}>
              {pdfUrls.map((pdf, index) => (
                <div key={index} className="px-3">
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -10 }}
                    className={`p-6 rounded-lg shadow-lg ${
                      activeIndex === index 
                        ? "bg-gradient-to-br from-purple-100 to-indigo-100 scale-105" 
                        : "bg-white"
                    } transition-all duration-500 h-64 flex flex-col items-center justify-center cursor-pointer
                      border-2 ${activeIndex === index ? 'border-purple-300' : 'border-transparent'}`}
                    onClick={() => {
                      setActiveIndex(index);
                      sliderRef.current.slickGoTo(index);
                    }}
                  >
                    <motion.div 
                      className="text-6xl mb-4"
                      animate={{ 
                        y: [0, activeIndex === index ? -8 : 0, 0],
                        scale: [1, activeIndex === index ? 1.2 : 1, 1] 
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    >
                      {pdf.icono}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 text-center text-gray-800">{pdf.title}</h3>
                    <p className="text-sm text-center text-gray-600">
                      {pdf.url 
                        ? `Convocatoria oficial ${new Date().getFullYear()}`
                        : "Convocatoria no disponible"
                      }
                    </p>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`mt-4 px-4 py-2 rounded-full text-white ${
                        pdf.url 
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" 
                          : "bg-gray-400"
                      } transition-all duration-300 shadow-md`}
                    >
                      {pdf.url ? "Ver convocatoria" : "No disponible"}
                    </motion.button>
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Visualizador PDF */}
          <div className="flex flex-col items-center w-full mx-auto mt-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-3xl h-[70vh] rounded-lg border border-gray-300 bg-white shadow-xl overflow-hidden"
            >
              <h3 className="text-2xl font-semibold p-4 text-gray-800 flex items-center">
                <span className="text-4xl mr-3">{pdfUrls[activeIndex].icono}</span> 
                {pdfUrls[activeIndex].title}
                {pdfUrls[activeIndex].convocatoriaTitle && (
                  <span className="ml-2 text-lg text-gray-500">
                    - {pdfUrls[activeIndex].convocatoriaTitle}
                  </span>
                )}
              </h3>
              {loading && <IndicadorCarga />}
              {error || !pdfUrls[activeIndex].url ? (
                <div className="flex flex-col items-center justify-center h-[calc(70vh-60px)] bg-gray-50 p-6">
                  <div className="text-amber-500 text-5xl mb-4">📄</div>
                  <h4 className="text-xl font-semibold text-amber-600 mb-2">
                    {error ? "Error al cargar el documento" : "Convocatoria no disponible"}
                  </h4>
                  <p className="text-gray-600 text-center mb-4">
                    {error 
                      ? "No se ha podido cargar el documento PDF. Verifica que el archivo exista y sea accesible."
                      : "La convocatoria para esta área aún no está disponible. Por favor revisa más tarde."}
                  </p>
                  {error && pdfUrls[activeIndex].url && (
                    <a 
                      href={pdfUrls[activeIndex].url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                    >
                      Intentar abrir en una nueva pestaña
                    </a>
                  )}
                </div>
              ) : (
                <iframe
                  src={`${pdfUrls[activeIndex].url}#toolbar=1&scrollbar=1&zoom=50`}
                  className="w-full h-full"
                  title="PDF Viewer"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                ></iframe>
              )}
            </motion.div>
            
            {pdfUrls[activeIndex].url ? (
              <a href={pdfUrls[activeIndex].url} download>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg shadow-lg transition duration-300"
                >
                  Descargar convocatoria
                </motion.button>
              </a>
            ) : null}
          </div>
        </div>
      </motion.div>

      <ProcesoInscripcion />
      {/* Información de contacto */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="bg-white py-12 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl p-6 md:p-8 bg-white border border-gray-200 shadow-md">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                Información por Área
              </span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-gray-800">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="p-3 md:p-4 text-left rounded-tl-lg">Área</th>
                    <th className="p-3 md:p-4 text-left">Contacto</th>
                    <th className="p-3 md:p-4 text-left rounded-tr-lg">Correo</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {area: "Astronomía y Astrofísica", contacto: "Juan Carlos Terrazas Vargas", correo: "juan.terrazas@fcyt.umss.edu.bo"},
                    {area: "Biología", contacto: "Erika Fernández", correo: "e.fernandez@umss.edu"},
                    {area: "Física", contacto: "Marko Andrade", correo: "markoandrade.u@fcyt.umss.edu.bo"},
                    {area: "Informática", contacto: "Vladimir Costas", correo: "vladimircostas.j@fcyt.umss.edu.bo"},
                    {area: "Matemática", contacto: "Vidal Matias", correo: "v.matias@umss.edu"},
                    {area: "Química", contacto: "Boris Moreira", correo: "borismoreira.r@fcyt.umss.edu.bo"}
                  ].map((item, index) => (
                    <motion.tr 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`
                        ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        hover:bg-purple-50
                        transition-colors duration-150
                      `}
                    >
                      <td className="p-3 md:p-4 border-t border-b border-l rounded-l-lg border-gray-200">{item.area}</td>
                      <td className="p-3 md:p-4 border-t border-b border-gray-200">{item.contacto}</td>
                      <td className="p-3 md:p-4 border-t border-b border-r rounded-r-lg border-gray-200">
                        <a href={`mailto:${item.correo}`} className="text-purple-500 hover:underline">
                          {item.correo}
                        </a>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Redes Sociales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mt-16 mb-6"
          >
            <h3 className="text-xl font-semibold mb-6 text-gray-900">
              Síguenos en redes sociales
            </h3>
            <div className="flex justify-center space-x-8 text-4xl">
              <motion.a
                href="https://www.facebook.com/profile.php?id=100082960521209"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-transform duration-300"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <FaFacebookF />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/ohsansi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-800 transition-transform duration-300"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <FaInstagram />
              </motion.a>
              <motion.a
                href="https://www.tiktok.com/@ohsansi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-700 transition-transform duration-300"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <FaTiktok />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default VisualizadoresPdf;