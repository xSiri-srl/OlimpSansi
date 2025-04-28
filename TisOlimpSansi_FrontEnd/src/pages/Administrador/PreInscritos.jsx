import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HiArrowCircleRight } from "react-icons/hi";

function DescargarListas() {
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [carnetIdentidad, setCarnetIdentidad] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [correo, setCorreo] = useState("");

  const [inscritos, setInscritos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const navigate = useNavigate();

  const [cargandoPDF, setCargandoPDF] = useState(false);
  const [cargandoExcel, setCargandoExcel] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/estudiantes/pre-inscritos")
      .then((response) => {
        if (Array.isArray(response.data.estudiantes_no_pagados)) {
          setInscritos(response.data.estudiantes_no_pagados);
        } else {
          console.error("Datos no son un arreglo:", response.data);
          setInscritos([]);
        }
      })
      .catch((error) => {
        console.error("Error al cargar inscritos:", error);
      });
  }, []);

  const resultadosFiltrados = inscritos.filter((inscrito) => {
    return (
      (nombre === "" ||
        inscrito.nombre?.toLowerCase().includes(nombre.toLowerCase())) &&
      (apellidoPaterno === "" ||
        inscrito.apellido_paterno
          ?.toLowerCase()
          .includes(apellidoPaterno.toLowerCase())) &&
      (apellidoMaterno === "" ||
        inscrito.apellido_materno
          ?.toLowerCase()
          .includes(apellidoMaterno.toLowerCase())) &&
      (carnetIdentidad === "" ||
        inscrito.carnet_identidad
          ?.toLowerCase()
          .includes(carnetIdentidad.toLowerCase())) &&
      (fechaNacimiento === "" ||
        inscrito.fecha_nacimiento === fechaNacimiento) &&
      (correo === "" ||
        inscrito.correo?.toLowerCase().includes(correo.toLowerCase()))
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

    const doc = new jsPDF();
    doc.text("Lista de inscritos", 14, 10);
    autoTable(doc, {
      head: [
        [
          "N°",
          "Nombre",
          "Apellido Paterno",
          "Apellido Materno",
          "Carnet",
          "Fecha de Nacimiento",
          "Correo",
        ],
      ],
      body: resultadosFiltrados.map((item, index) => [
        index + 1,
        item.nombre,
        item.apellido_paterno,
        item.apellido_materno,
        item.carnet_identidad,
        item.fecha_nacimiento,
        item.correo,
      ]),
    });

    setTimeout(() => {
      doc.save(generarNombreArchivo("pdf")); // Guarda el PDF
      setCargandoPDF(false); // Finaliza animación
    }, 1000);
  };

  const descargarExcel = () => {
    setCargandoExcel(true); // Activa animación

    const ws = XLSX.utils.json_to_sheet(resultadosFiltrados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estudiantes");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, generarNombreArchivo("xlsx"));

    setTimeout(() => {
      setCargandoExcel(false); // Finaliza animación
    }, 1000);
  };

  const generarNombreArchivo = (tipo) => {
    const fechaActual = new Date().toISOString().slice(0, 10); // formato YYYY-MM-DD
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
     Generar lista de pre-inscritos
    </h1>

      <div className="w-full max-w-5xl mx-auto mt-8 bg-sky-50 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row p-6 gap-4">
          {/* Nombre */}
          <div className="flex-1">
            <label
              htmlFor="nombre"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          {/* Apellido Paterno */}
          <div className="flex-1">
            <label
              htmlFor="apellidoPaterno"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Apellido Paterno
            </label>
            <input
              id="apellidoPaterno"
              type="text"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
              value={apellidoPaterno}
              onChange={(e) => setApellidoPaterno(e.target.value)}
            />
          </div>

          {/* Apellido Materno */}
          <div className="flex-1">
            <label
              htmlFor="apellidoMaterno"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Apellido Materno
            </label>
            <input
              id="apellidoMaterno"
              type="text"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
              value={apellidoMaterno}
              onChange={(e) => setApellidoMaterno(e.target.value)}
            />
          </div>

          {/* Carnet de Identidad */}
          <div className="flex-1">
            <label
              htmlFor="carnetIdentidad"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Carnet de Identidad
            </label>
            <input
              id="carnetIdentidad"
              type="text"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
              value={carnetIdentidad}
              onChange={(e) => setCarnetIdentidad(e.target.value)}
            />
          </div>

          {/* Fecha de Nacimiento */}
          <div className="flex-1">
            <label
              htmlFor="fechaNacimiento"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Fecha de Nacimiento
            </label>
            <input
              id="fechaNacimiento"
              type="date"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
          </div>

          {/* Correo */}
          <div className="flex-1">
            <label
              htmlFor="correo"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Correo
            </label>
            <input
              id="correo"
              type="email"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-8 mt-4 text-gray-700">
        <div className="bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
          <p className="text-sm font-medium">Total de estudiantes:</p>
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
              <thead className="font-semibold bg-sky-100">
                <tr>
                  <th className="px-4 py-2 border">Nombre</th>
                  <th className="px-4 py-2 border">Apellido Paterno</th>
                  <th className="px-4 py-2 border">Apellido Materno</th>
                  <th className="px-4 py-2 border">Carnet de Identidad</th>
                  <th className="px-4 py-2 border">Fecha de Nacimiento</th>
                  <th className="px-4 py-2 border">Correo</th>
                  <th className="px-4 py-2 border">Propietario Correo</th>
                </tr>
              </thead>
              <tbody>
                {resultadosPaginados.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b hover:bg-gray-100"
                  >
                    <td className="px-4 py-2 border">{item.nombre}</td>
                    <td className="px-4 py-2 border">{item.apellido_pa}</td>
                    <td className="px-4 py-2 border">{item.apellido_ma}</td>
                    <td className="px-4 py-2 border">
                      {item.carnet_identidad}
                    </td>
                    <td className="px-4 py-2 border">
                      {item.fecha_nacimiento}
                    </td>
                    <td className="px-4 py-2 border">{item.correo}</td>
                    <td className="px-4 py-2 border">
                      {item.propietario_correo}
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
