import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate ,useSearchParams} from "react-router-dom";
import { HiArrowCircleRight } from "react-icons/hi";
import { API_URL } from "../../../utils/api";
import axios from "axios"

const datos = {
  ASTRONOMIA_ASTROFISICA: [
    "3P - 3RO PRIMARIA",
    "4P - 4TO PRIMARIA",
    "5P - 5TO PRIMARIA",
    "6P - 6TO PRIMARIA",
    "1S - 1RO SECUNDARIA",
    "2S - 2DO SECUNDARIA",
    "3S - 3RO SECUNDARIA",
    "4S - 4TO SECUNDARIA",
    "5S - 5TO SECUNDARIA",
    "6S - 6TO SECUNDARIA",
  ],
  BIOLOGIA: [
    "2S - 2DO SECUNDARIA",
    "3S - 3RO SECUNDARIA",
    "4S - 4TO SECUNDARIA",
    "5S - 5TO SECUNDARIA",
    "6S - 6TO SECUNDARIA",
  ],
  FISICA: ["4S - 4TO SECUNDARIA", "5S - 5TO SECUNDARIA", "6S - 6TO SECUNDARIA"],
  INFORMATICA: [
    "GUACAMAYO - 5TO A 6TO PRIMARIA",
    "GUANACO - 1RO A 3RO SECUNDARIA",
    "LONDRA - 1RO A 3RO SECUNDARIA",
    "JUCUMARI - 4TO A 6TO SECUNDARIA",
    "BUFEO - 1RO A 3RO SECUNDARIA",
    "PUMA - 4TO A 6TO SECUNDARIA",
  ],
  MATEMATICAS: [
    "PRIMER NIVEL - 1RO SECUNDARIA",
    "SEGUNDO NIVEL - 2DO SECUNDARIA",
    "TERCER NIVEL - 3RO SECUNDARIA",
    "CUARTO NIVEL - 4TO SECUNDARIA",
    "QUINTO NIVEL - 5TO SECUNDARIA",
    "SEXTO NIVEL - 6TO SECUNDARIA",
  ],
  QUIMICA: [
    "2S - 2DO SECUNDARIA",
    "3S - 3RO SECUNDARIA",
    "4S - 4TO SECUNDARIA",
    "5S - 5TO SECUNDARIA",
    "6S - 6TO SECUNDARIA",
  ],
  ROBOTICA: [
    "BUILDERS P - 5TO A 6TO PRIMARIA",
    "BUILDERS S - 1RO A 6TO SECUNDARIA",
    "LEGO P - 5TO A 6TO PRIMARIA",
    "LEGO S - 1RO A 6TO SECUNDARIA",
  ],
};

function DescargarListas() {
  const [area, setArea] = useState("");
  const categorias = datos[area] || [];
  const navigate = useNavigate();
  const [curso, setCurso] = useState("");
  const [categoria, setCategoria] = useState("");
  const [colegio, setColegio] = useState("");
  const [fecha, setFecha] = useState("");

  const [inscritos, setInscritos] = useState([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("");
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);

  const [cargandoPDF, setCargandoPDF] = useState(false);
  const [cargandoExcel, setCargandoExcel] = useState(false);
  const [searchParams] = useSearchParams();
const idOlimpiada = searchParams.get('olimpiada');
  const departamentosDisponibles = [
    ...new Set(inscritos.map((i) => i.departamento).filter(Boolean)),
  ];

  const provinciasDisponibles = [
    ...new Set(
      inscritos
        .filter((i) => i.departamento === departamentoSeleccionado)
        .map((i) => i.provincia)
        .filter(Boolean)
    ),
  ];

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [inscritosResponse, preInscritosResponse] = await Promise.all([
        axios.get(`${API_URL}/api/lista-inscritos/${idOlimpiada}`),
        axios.get(`${API_URL}/api/lista-preinscritos/${idOlimpiada}`)
      ]);
      
      // Combinar ambas listas
      const listaCompleta = [...inscritosResponse.data, ...preInscritosResponse.data];
      setInscritos(listaCompleta);
    } catch (error) {
      console.error('Error al cargar las listas:', error);
    }
  };

  fetchData();
}, [idOlimpiada]);


  const resultadosFiltrados = inscritos.filter((inscrito) => {
    return (
      (area === "" ||
        inscrito.nombre_area?.toLowerCase() === area.toLowerCase()) &&
      (curso === "" || inscrito.curso?.toLowerCase() === curso.toLowerCase()) &&
      (categoria === "" ||
        inscrito.categoria?.toLowerCase() === categoria.toLowerCase()) &&
      (colegio === "" ||
        inscrito.colegio?.toLowerCase() === colegio.toLowerCase()) &&
      (fecha === "" || inscrito.fecha_nacimiento === fecha) &&
      (departamentoSeleccionado === "" ||
        inscrito.departamento === departamentoSeleccionado) &&
      (provinciaSeleccionada === "" ||
        inscrito.provincia === provinciaSeleccionada)
    );
  });

  const resultadosPorPagina = 20;
  const totalPaginas = Math.ceil(
    resultadosFiltrados.length / resultadosPorPagina
  );
  const indiceInicial = (paginaActual - 1) * resultadosPorPagina;
  const indiceFinal = indiceInicial + resultadosPorPagina;
  const resultadosPaginados = resultadosFiltrados.slice(
    indiceInicial,
    indiceFinal
  );

  const descargarPDF = () => {
    setCargandoPDF(true);

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [260, 406],
    });

    doc.text("Lista de Inscritos", 14, 10);

    const columnas = [
      "N°",
      "Apellido Paterno",
      "Apellido Materno",
      "Nombres",
      "Carnet de Identidad",
      "Curso",
      "Colegio",
      "Departamento",
      "Provincia",
      "Correo Electrónico",
      "Tutor Legal Nombre",
      "Tutor Legal CI",
    ];

    const body = resultadosFiltrados.map((item, index) => [
      index + 1,
      item.apellido_pa || "",
      item.apellido_ma || "",
      item.nombre || "",
      item.ci || "",
      item.curso || "",
      item.colegio || "",
      item.departamento || "",
      item.provincia || "",
      item.correo || "",
      item.tutor_legal_nombre || "",
      item.tutor_legal_ci || "",
    ]);

    autoTable(doc, {
      head: [columnas],
      body: body,
      startY: 20,
      styles: {
        fontSize: 7,
        overflow: "linebreak",
        cellWidth: "wrap",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 8,
      },
      theme: "grid",
    });

    setTimeout(() => {
      doc.save(generarNombreArchivo("pdf"));
      setCargandoPDF(false);
    }, 1000);
  };

  const descargarExcel = () => {
    setCargandoExcel(true);

    const ws = XLSX.utils.json_to_sheet(resultadosFiltrados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estudiantes");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, generarNombreArchivo("xlsx"));

    setTimeout(() => {
      setCargandoExcel(false); 
    }, 1000);
  };

  const generarNombreArchivo = (tipo) => {
    const fechaActual = new Date().toISOString().slice(0, 10); 
    const nombreArea = area || "todas-las-areas";
    const nombreCategoria = categoria || "todas-las-categorias";

    return `estudiantes_${nombreArea}_${nombreCategoria}_${fechaActual}.${tipo}`;
  };

  useEffect(() => {
    if (resultadosFiltrados.length < 20 && paginaActual !== 1) {
      setPaginaActual(1);
    }
  }, [resultadosFiltrados, paginaActual]);

  return (
    <div className="relative p-6 bg-white shadow-md rounded-xl">
      {/* Botón arriba a la derecha */}
      <div className="absolute top-9 right-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300"
        >
          Regresar
          <HiArrowCircleRight className="w-5 h-5" />
        </button>
      </div>

      {/* Título centrado */}
      <h1 className="text-sky-950 font-bold text-3xl text-center">
        Total Inscritos y Pre-Inscritos
      </h1>

      <div className="w-full max-w-4xl mx-auto mt-8 bg-sky-50 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row p-6 gap-4">
          {/* Área */}
          <div className="flex-1">
            <label
              htmlFor="area"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Área
            </label>
            <select
              id="area"
              name="area"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            >
              <option value="">Ver todo</option>
              {Object.keys(datos).map((key) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Curso */}
          <div className="flex-1">
            <label
              htmlFor="curso"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Curso
            </label>
            <select
              id="curso"
              name="curso"
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
            >
              <option value="">Ver todo</option>
              {[...new Set(categorias.map((cat) => cat.split(" - ")[1]))].map(
                (curso, index) => (
                  <option key={index} value={curso}>
                    {curso}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Categoría */}
          <div className="flex-1">
            <label
              htmlFor="categoria"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Categoría
            </label>
            <select
              id="categoria"
              name="categoria"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Ver todo</option>
              {categorias.map((cat, index) => (
                <option key={index} value={cat.split(" - ")[0]}>
                  {cat.split(" - ")[0]}
                </option>
              ))}
            </select>
          </div>

          {/* colegio */}
          <div className="flex-1">
            <label
              htmlFor="colegio"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Unidad Educativa
            </label>
            <select
              id="colegio"
              name="colegio"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
              value={colegio}
              onChange={(e) => setColegio(e.target.value)}
            >
              <option value="">Ver todo</option>
              {[...new Set(inscritos.map((item) => item.colegio))].map(
                (colegioName, idx) => (
                  <option key={idx} value={colegioName}>
                    {colegioName}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Departamento */}
          <div className="flex-1">
            <label
              htmlFor="departamento"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Departamento
            </label>
            <select
              id="departamento"
              name="departamento"
              value={departamentoSeleccionado}
              onChange={(e) => {
                setDepartamentoSeleccionado(e.target.value);
                setProvinciaSeleccionada(""); 
              }}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
            >
              <option value="">Ver todo</option>
              {departamentosDisponibles.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>

          {/* Provincia */}
          <div className="flex-1">
            <label
              htmlFor="provincia"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Distrito
            </label>
            <select
              id="provincia"
              name="provincia"
              value={provinciaSeleccionada}
              onChange={(e) => setProvinciaSeleccionada(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
            >
              <option value="">Ver todo</option>
              {provinciasDisponibles.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-8 mt-4 text-gray-700">
        <div className="bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
          <p className="text-sm font-medium">Total de inscritos y preinscritos:</p>
          <p className="text-xl font-semibold text-blue-600">
            {inscritos.length}
          </p>
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
          <p className="text-sm font-medium">Total con filtros aplicados:</p>
          <p className="text-xl font-semibold text-green-600">
            {resultadosFiltrados.length}
          </p>
        </div>
        {resultadosFiltrados.length > 0 && (
          <div className="flex justify-end mt-6 gap-2 mb-4">
            <button
              onClick={descargarPDF}
              disabled={cargandoPDF}
              className={`flex items-center gap-2 px-4 py-2 rounded text-white ${
                cargandoPDF
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {cargandoPDF ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    />
                  </svg>
                  Generando PDF...
                </>
              ) : (
                "Descargar PDF"
              )}
            </button>

            <button
              onClick={descargarExcel}
              disabled={cargandoExcel}
              className={`flex items-center gap-2 px-4 py-2 rounded text-white ${
                cargandoExcel
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {cargandoExcel ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    />
                  </svg>
                  Generando Excel...
                </>
              ) : (
                "Descargar Excel"
              )}
            </button>
          </div>
        )}
      </div>

      {resultadosFiltrados.length > 0 ? (
        <div className="mt-6 flex justify-center">
          <div className="overflow-x-auto w-full max-w-6xl">
            <table className="min-w-max border border-gray-300 text-sm text-left">
              <thead>
                <tr>
                  <th
                    colSpan="13"
                    className="py-2 px-4 border border-gray-300 font-semibold bg-green-200 text-center"
                  >
                    Datos del competidor
                  </th>
                  <th
                    colSpan="8"
                    className="py-2 px-4 border border-gray-300 font-semibold bg-blue-200 text-center"
                  >
                    Datos del tutor legal
                  </th>
                  <th
                    colSpan="6"
                    className="py-2 px-4 border border-gray-300 font-semibold bg-purple-200 text-center"
                  >
                    Datos del tutor académico
                  </th>
                </tr>
                <tr>
                  {[
                    "Número",
                    "Apellido Paterno",
                    "Apellido Materno",
                    "Nombres",
                    "Carnet de Identidad",
                    "Fecha de nacimiento",
                    "Correo Electrónico",
                    "El correo pertenece a",
                    "Curso",
                    "Área",
                    "Categoría",
                    "Colegio",
                    "Departamento",
                    "Provincia",
                    "Rol del tutor",
                    "Apellido Paterno",
                    "Apellido Materno",
                    "Nombres",
                    "Carnet de Identidad",
                    "Correo Electrónico",
                    "Teléfono/Celular",
                    "Apellido Paterno",
                    "Apellido Materno",
                    "Nombres",
                    "Carnet de Identidad",
                    "Correo Electrónico",
                  ].map((title, idx) => {
                    let bgColor = "";
                    if (idx < 13) bgColor = "bg-green-100";
                    else if (idx < 21) bgColor = "bg-blue-100";
                    else bgColor = "bg-purple-100";

                    return (
                      <th
                        key={idx}
                        className={`py-2 px-4 border border-gray-300 font-medium whitespace-nowrap text-center ${bgColor}`}
                      >
                        {title}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {resultadosPaginados.map((inscritos, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">
                      {(paginaActual - 1) * resultadosPorPagina + index + 1}
                    </td>
                    <td className="px-4 py-2 border">
                      {inscritos.apellido_pa}
                    </td>
                    <td className="px-4 py-2 border">
                      {inscritos.apellido_ma}
                    </td>
                    <td className="px-4 py-2 border">{inscritos.nombre}</td>
                    <td className="px-4 py-2 border">{inscritos.ci}</td>
                    <td className="px-4 py-2 border">
                      {inscritos.fecha_nacimiento}
                    </td>
                    <td className="px-4 py-2 border">{inscritos.correo}</td>
                    <td className="px-4 py-2 border">
                      {inscritos.propietario_correo}
                    </td>
                    <td className="px-4 py-2 border">{inscritos.curso}</td>
                    <td className="px-4 py-2 border">
                      {inscritos.nombre_area}
                    </td>
                    <td className="px-4 py-2 border">{inscritos.categoria}</td>
                    <td className="px-4 py-2 border">{inscritos.colegio}</td>
                    <td className="px-4 py-2 border">
                      {inscritos.departamento}
                    </td>
                    <td className="px-4 py-2 border">{inscritos.provincia}</td>
                    <td className="px-4 py-2 border">
                      {inscritos.rol_tutor_legal}
                    </td>
                    <td className="px-4 py-2 border">
                      {inscritos.tutor_legal_apellido_pa}
                    </td>
                    <td className="px-4 py-2 border">
                      {inscritos.tutor_legal_apellido_ma}
                    </td>
                    <td className="px-4 py-2 border">
                      {inscritos.tutor_legal_nombre}
                    </td>
                    <td className="px-4 py-2 border">
                      {inscritos.tutor_legal_ci}
                    </td>
                    <td className="px-4 py-2 border">
                      {inscritos.tutor_legal_correo}
                    </td>
                    <td className="px-4 py-2 border">
                      {inscritos.tutor_legal_telefono}
                    </td>
                    <td className="px-4 py-2 border">
                      {inscritos.tutor_academico_apellido_pa}
                    </td>
                    <td className="px-4 py-2 border">
                      {inscritos.tutor_academico_apellido_ma}
                    </td>
                    <td className="px-4 py-2 border">
                      {inscritos.tutor_academico_nombre}
                    </td>
                    <td className="px-4 py-2 border">
                      {inscritos.tutor_academico_ci}
                    </td>
                    <td className="px-4 py-2 border">
                      {inscritos.tutor_academico_correo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-center text-gray-600">
          No se encontraron resultados.
        </p>
      )}
      {resultadosFiltrados.length > 0 && (
        <div className="flex justify-center items-center gap-4 my-6">
          <button
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm font-semibold text-gray-700">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() =>
              setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
            }
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default DescargarListas;
