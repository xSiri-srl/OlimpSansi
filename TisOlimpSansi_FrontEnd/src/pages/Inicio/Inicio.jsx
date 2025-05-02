import React, { useState } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Inicio = () => {
  const [loading, setLoading] = useState(true);

  const pdfUrls = [
    { url: "/borrar/hSansi.pdf", title: "Convocatoria SANSI" },
    { url: "/borrar/grupal.pdf", title: "Convocatoria Grupal" },
    { url: "/borrar/hSansi.pdf", title: "Convocatoria SANSI (Copia)" },
    { url: "/borrar/hSansi.pdf", title: "Convocatoria SANSI Extra" },
    { url: "/borrar/grupal.pdf", title: "Convocatoria Grupal (Extra)" },
  ];

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <>
      <div className="h-[60vh] flex items-center justify-center  bg-gradient-to-r from-blue-800 via-purple-700 to-red-700">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-white text-left mb-10 md:mb-0">
            <motion.h1
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-5xl md:text-6xl font-extrabold drop-shadow-lg"
            >
              Bienvenido a <br></br>O! SANSI
            </motion.h1>

            <motion.p
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="text-lg mt-4 text-gray-200"
            >
              Olimpiada de Ciencia y Tecnología
            </motion.p>
          </div>

          <motion.img
            src="/images/Ohsansi_Logo.png"
            alt="OlimpSansi Logo"
            initial={{ x: 50, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{
              duration: 2.2,
              delay: 0.4,
              type: "spring",
              stiffness: 80,
            }}
            className="h-80 w-auto drop-shadow-xl"
          />
        </motion.div>
      </div>
      <h1 class="text-4xl p-5 text-center font-bold">
        OLIMPIADA CIENTÍFICA NACIONAL
        <span class="block mt-2">SAN SIMÓN 2025</span>
      </h1>

      <div className="text-center px-4 py-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Presentación</h2>
        <p className="text-lg text-gray-700">
          El Comité de la Olimpiada Científica Nacional San Simón{" "}
          <strong>O! SANSI</strong>, a través de la Facultad de Ciencias y
          Tecnología de la Universidad Mayor de San Simón, convoca a los
          estudiantes del Sistema de Educación Regular a participar en las
          Olimpiadas <strong>O! SANSI 2025</strong>.
        </p>
      </div>

      <div className="flex flex-col items-center w-full mx-auto">
        <div className="relative w-[55vh] h-[50vh] rounded-lg border border-gray-300 bg-white shadow-md overflow-hidden">
          <h3 className="text-xl font-semibold mb-4">{pdfUrls[0].title}</h3>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-gray-600">Cargando PDF...</p>
              </div>
            </div>
          )}

          <iframe
            src={`${pdfUrls[0].url}#toolbar=1&scrollbar=1&zoom=50`}
            className="w-full h-full"
            title="PDF Viewer"
            onLoad={handleIframeLoad}
          ></iframe>
        </div>
        <a href={pdfUrls[0].url} download>
          <button className="mt-4 bg-blue-500 text-white py-3 px-4 rounded-lg transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md">
            Descargar convocatoria
          </button>
        </a>
      </div>
      {/* ---------------------------------------RELLENO---------------------------------------*/}
      <div className="text-center px-4 py-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Requisitos</h2>
        <ul className="text-left list-disc list-inside text-gray-700 text-base space-y-2">
          <li>
            Ser estudiante de nivel primaria o secundaria en el sistema de
            Educación Regular del Estado Plurinacional de Bolivia.
          </li>
          <li>Registrar un tutor o profesor.</li>
          <li>
            Registrarse en el formulario de inscripción para el(las) área(s) que
            se postula.
          </li>
          <li>
            Cumplir los requisitos específicos de la categoría de competencia en
            la que se inscribe.
          </li>
          <li>
            Tener su documento de identificación personal vigente (cédula de
            identidad) en el desarrollo de la competencia.
          </li>
          <li>Contar con correo electrónico personal o del tutor.</li>
        </ul>
      </div>

      {/* Slider con PDFs */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Slider {...settings}>
          {pdfUrls.slice(1).map((pdf, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-full mx-auto"
            >
              {/* Título de cada PDF */}
              <h3 className="text-xl font-semibold mb-4">{pdf.title}</h3>
              <div className="relative w-full h-0 pb-[100%] rounded-lg border border-gray-300 bg-white shadow-md overflow-hidden">
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-2 text-gray-600">Cargando PDF...</p>
                    </div>
                  </div>
                )}

                <iframe
                  src={`${pdf.url}#toolbar=1&scrollbar=1&zoom=50`}
                  className="absolute inset-0 w-full h-full"
                  title="PDF Viewer"
                  onLoad={handleIframeLoad}
                ></iframe>
              </div>

              <div className="flex justify-center w-full mt-4">
                <a href={pdf.url} download>
                  <button className="bg-blue-500 text-white py-3 px-4 rounded-lg transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 shadow-md">
                    Descargar convocatoria
                  </button>
                </a>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className="text-center px-4 py-8 max-w-3xl mx-auto space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-4">Fechas importantes</h2>
          <ul className="text-left list-disc list-inside text-gray-700 text-base space-y-3">
            <li>
              <strong>Etapa Clasificatoria –</strong> Las pruebas se llevarán a
              cabo de forma presencial el <strong>31 de mayo</strong> en el
              Campus de la UMSS. Por año de escolaridad y/o categoría clasifican
              a la segunda etapa los estudiantes según las reglas de
              clasificación de cada área.
            </li>
            <li>
              <strong>Etapa Final –</strong> Las pruebas se llevarán a cabo de
              forma presencial el <strong>11 de julio</strong> en el Campus de
              la UMSS. De estas pruebas se conocerán los ganadores
              departamentales y nacionales.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">Premios</h2>
          <ul className="text-left list-disc list-inside text-gray-700 text-base space-y-3">
            <li>
              Los resultados de los ganadores se publicarán el{" "}
              <strong>11 de julio</strong> aca xd.
            </li>
            <li>
              La premiación se realizará el{" "}
              <strong>11 de julio a horas 15:00</strong>.
            </li>
            <li>
              Los estudiantes ubicados en los{" "}
              <strong>5 primeros puestos</strong> a nivel nacional de cada curso
              recibirán <strong>diplomas de honor</strong>, y los ubicados en
              los <strong>3 primeros puestos</strong> recibirán medallas de{" "}
              <strong>Oro, Plata y Bronce</strong>, respectivamente.
            </li>
            <li>
              Los profesores y profesoras tutores de los estudiantes ganadores
              recibirán <strong>certificados</strong>.
            </li>
            <li>
              Los estudiantes ganadores de medallas de Oro, Plata y Bronce de{" "}
              <strong>6to de secundaria</strong> tendrán{" "}
              <strong>ingreso libre</strong> a la Facultad de Ciencias y
              Tecnología.
            </li>
          </ul>
        </section>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-center text-2xl font-bold mb-6">
            Más Información por Área
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-300 text-sm md:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border-b">Área</th>
                  <th className="p-3 border-b">Contacto</th>
                  <th className="p-3 border-b">Correo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b">Astronomía y Astrofísica</td>
                  <td className="p-3 border-b">Juan Carlos Terrazas Vargas</td>
                  <td className="p-3 border-b">
                    <a
                      href="mailto:juan.terrazas@fcyt.umss.edu.bo"
                      className="text-blue-600 hover:underline"
                    >
                      juan.terrazas@fcyt.umss.edu.bo
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b">Biología</td>
                  <td className="p-3 border-b">Erika Fernández</td>
                  <td className="p-3 border-b">
                    <a
                      href="mailto:e.fernandez@umss.edu"
                      className="text-blue-600 hover:underline"
                    >
                      e.fernandez@umss.edu
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b">Física</td>
                  <td className="p-3 border-b">Marko Andrade</td>
                  <td className="p-3 border-b">
                    <a
                      href="mailto:markoandrade.u@fcyt.umss.edu.bo"
                      className="text-blue-600 hover:underline"
                    >
                      markoandrade.u@fcyt.umss.edu.bo
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b">Informática</td>
                  <td className="p-3 border-b">Vladimir Costas</td>
                  <td className="p-3 border-b">
                    <a
                      href="mailto:vladimircostas.j@fcyt.umss.edu.bo"
                      className="text-blue-600 hover:underline"
                    >
                      vladimircostas.j@fcyt.umss.edu.bo
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b">Matemática</td>
                  <td className="p-3 border-b">Vidal Matias</td>
                  <td className="p-3 border-b">
                    <a
                      href="mailto:v.matias@umss.edu"
                      className="text-blue-600 hover:underline"
                    >
                      v.matias@umss.edu
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b">Química</td>
                  <td className="p-3 border-b">Boris Moreira</td>
                  <td className="p-3 border-b">
                    <a
                      href="mailto:borismoreira.r@fcyt.umss.edu.bo"
                      className="text-blue-600 hover:underline"
                    >
                      borismoreira.r@fcyt.umss.edu.bo
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-10 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Síguenos en redes sociales
          </h3>
          <div className="flex justify-center space-x-6 text-gray-600 text-2xl">
            <a
              href="https://www.facebook.com/ohsansi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/ohsansi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-800"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.tiktok.com/@ohsansi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-700"
            >
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inicio;
