import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { HiArrowCircleRight } from "react-icons/hi";
import { API_URL } from "../../../utils/api";
import axios from "axios"

function OrdenesPago() {
  const [estado, setEstado] = useState("");

  const [ordenesPago, setOrdenesPago] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const navigate = useNavigate();
  const [cargandoPDF, setCargandoPDF] = useState(false);
  const [cargandoExcel, setCargandoExcel] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [contadorNumeracion, setContadorNumeracion] = useState(1);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/orden-de-pago/info`)
      .then((response) => {
        if (Array.isArray(response.data.ordenes)) {
          setOrdenesPago(response.data.ordenes);
        } else {
          console.error("Datos no son un arreglo:", response.data);
          setOrdenesPago([]);
        }
      })
      .catch((error) => {
        console.error("Error al cargar ordenes pago:", error);
      });
  }, []);
  const resultadosFiltrados = ordenesPago.filter((orden) => {
    const coincideBusqueda =
      orden.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      orden.apellido_paterno?.toLowerCase().includes(busqueda.toLowerCase()) ||
      orden.apellido_materno?.toLowerCase().includes(busqueda.toLowerCase()) ||
      String(orden.carnet_identidad)
        ?.toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      orden.codigo_generado?.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      estado === "pagado"
        ? orden.estado_pago === 1
        : estado === "no_pagado"
        ? orden.estado_pago === 0
        : true; 

    return coincideBusqueda && coincideEstado;
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
    doc.text("Lista de ordenes de pago", 14, 10);
    autoTable(doc, {
      head: [
        [
          "N°",
          "Codigo Generado",
          "Nombre",
          "Apellido Paterno",
          "Apellido Materno",
          "Carnet",
          "Monto Total",
          "Estado",
        ],
      ],
      body: resultadosFiltrados.map((item, index) => [
        index + 1,
        item.codigo_generado,
        item.nombre,
        item.apellido_paterno,
        item.apellido_materno,
        item.carnet_identidad,
        item.monto_total,
        item.estado_pago === 1 ? "Pagado" : "No pagado",
      ]),
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
    return `ordenes_pago_${fechaActual}.${tipo}`;
  };

  useEffect(() => {
    if (resultadosFiltrados.length < 20 && paginaActual !== 1) {
      setPaginaActual(1);
    }
  }, [resultadosFiltrados, paginaActual]);

  const handleSiguiente = () => {
    setPaginaActual((prevPagina) => prevPagina + 1);
    setContadorNumeracion(contadorNumeracion + resultadosPorPagina);
  };

  const handleAnterior = () => {
    setPaginaActual((prevPagina) => prevPagina - 1);
    setContadorNumeracion(contadorNumeracion - resultadosPorPagina);
  };

  return (
    <div className="relative p-6 bg-white shadow-md rounded-xl">
      <div className="absolute top-9 right-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300"
        >
          Regresar
          <HiArrowCircleRight className="w-5 h-5" />
        </button>
      </div>
      <h1 className="text-sky-950 font-bold text-3xl text-center">
        Lista de Ordenes de Pago
      </h1>

      <div className="w-full max-w-5xl mx-auto mt-8 bg-sky-50 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row p-6 gap-4">
          {/* buscador */}
          <div className="flex-1">
            <label
              htmlFor="busqueda"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Buscar por nombre, apellidos, carnet o código
            </label>
            <input
              id="busqueda"
              type="text"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* Estado */}
          <div className="flex-1">
            <label
              htmlFor="estado"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Estado
            </label>
            <select
              id="estado"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="pagado">Pagado</option>
              <option value="no_pagado">No pagado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-8 mt-4 text-gray-700">
        <div className="bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
          <p className="text-sm font-medium">Total ordenes de pago:</p>
          <p className="text-xl font-semibold text-blue-600">
            {ordenesPago.length}
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
                  <th className="px-4 py-2 border">Número</th>
                  <th className="px-4 py-2 border">Codigo generado</th>
                  <th className="px-4 py-2 border">Nombre Responsable</th>
                  <th className="px-4 py-2 border">Apellido Paterno</th>
                  <th className="px-4 py-2 border">Apellido Materno</th>
                  <th className="px-4 py-2 border">Carnet de Identidad</th>
                  <th className="px-4 py-2 border">Monto Total (Bs)</th>
                  <th className="px-4 py-2 border">Estado</th>
                </tr>
              </thead>
              <tbody>
                {resultadosPaginados.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b hover:bg-gray-100"
                  >
                    <td className="px-4 py-2 border">
                      {contadorNumeracion + index}
                    </td>
                    <td className="px-4 py-2 border">{item.codigo_generado}</td>
                    <td className="px-4 py-2 border">{item.nombre}</td>
                    <td className="px-4 py-2 border">
                      {item.apellido_paterno}
                    </td>
                    <td className="px-4 py-2 border">
                      {item.apellido_materno}
                    </td>
                    <td className="px-4 py-2 border">
                      {item.carnet_identidad}
                    </td>
                    <td className="px-4 py-2 border">{item.monto_total}</td>
                    <td className="px-4 py-2 border">
                      {item.estado_pago === 1 ? "Pagado" : "No pagado"}
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
            onClick={handleAnterior}
            disabled={paginaActual === 1}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm font-semibold text-gray-700">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={handleSiguiente}
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

export default OrdenesPago;
