import React, { useState, useEffect  } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";

const datos = {
  astronomia: [
    "3P - 3ro Primaria",
    "4P - 4to Primaria",
    "5P - 5to Primaria",
    "6P - 6to Primaria",
    "1S - 1ro Secundaria",
    "2S - 2do Secundaria",
    "3S - 3ro Secundaria",
    "4S - 4to Secundaria",
    "5S - 5to Secundaria",
    "6S - 6to Secundaria",
  ],
  astrofisica: [
    "3P - 3ro Primaria",
    "4P - 4to Primaria",
    "5P - 5to Primaria",
    "6P - 6to Primaria",
    "1S - 1ro Secundaria",
    "2S - 2do Secundaria",
    "3S - 3ro Secundaria",
    "4S - 4to Secundaria",
    "5S - 5to Secundaria",
    "6S - 6to Secundaria",
  ],
  biologia: [
    "2S - 2do Secundaria",
    "3S - 3ro Secundaria",
    "4S - 4to Secundaria",
    "5S - 5to Secundaria",
    "6S - 6to Secundaria",
  ],
  fisica: ["4S - 4to Secundaria", "5S - 5to Secundaria", "6S - 6to Secundaria"],
  informatica: [
    "Guacamayo - 5to a 6to Primaria",
    "Guanaco - 1ro a 3ro Secundaria",
    "Londra - 1ro a 3ro Secundaria",
    "Jucumari - 4to a 6to Secundaria",
    "Bufeo - 1ro a 3ro Secundaria",
    "Puma - 4to a 6to Secundaria",
  ],
  matematicas: [
    "Primer Nivel - 1ro Secundaria",
    "Segundo Nivel - 2do Secundaria",
    "Tercer Nivel - 3ro Secundaria",
    "Cuarto Nivel - 4to Secundaria",
    "Quinto Nivel - 5to Secundaria",
    "Sexto Nivel - 6to Secundaria",
  ],
  quimica: [
    "2S - 2do Secundaria",
    "3S - 3ro Secundaria",
    "4S - 4to Secundaria",
    "5S - 5to Secundaria",
    "6S - 6to Secundaria",
  ],
  robotica: [
    "Builders P - 5to a 6to Primaria",
    "Builders S - 1ro a 6to Secundaria",
    "Lego P - 5to a 6to Primaria",
    "Lego S - 1ro a 6to Secundaria",
  ],
};



function DescargarListas() {
  const [area, setArea] = useState("");
  const categorias = datos[area] || [];

  const [curso, setCurso] = useState("");
  const [categoria, setCategoria] = useState("");
  const [colegio, setColegio] = useState("");
  const [fecha, setFecha] = useState("");


  const [inscritos, setInscritos] = useState([]);
 

  useEffect(() => {
    axios.get("http://localhost:8000/api/lista-inscritos").then((response) => {
      setInscritos(response.data); 
    });
  }, []);

  const resultadosFiltrados = inscritos.filter((inscrito) => {
    return (
      (area === "" || inscrito.nombre_area === area) &&
      (curso === "" || inscrito.curso === curso) &&
      (categoria === "" || inscrito.categoria === categoria) &&
      (colegio === "" || inscrito.colegio === colegio) &&
      (fecha === "" || inscrito.fecha_nacimiento === fecha)
    );
  });
  

  const descargarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Listado de estudiantes", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [["Estudiante", "Área", "Categoría", "Curso", "Colegio", "Fecha"]],
      body: resultadosFiltrados.map((i) => [
        i.area,
        i.categoria,
        i.curso,
        i.colegio,
        i.fecha,
      ]),
    });

    doc.save(generarNombreArchivo("pdf"));
  };

  const descargarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(resultadosFiltrados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estudiantes");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, generarNombreArchivo("xlsx"));
  };

  const generarNombreArchivo = (tipo) => {
    const fechaActual = new Date().toISOString().slice(0, 10); // formato YYYY-MM-DD
    const nombreArea = area || "todas-las-areas";
    const nombreCategoria = categoria || "todas-las-categorias";

    return `estudiantes_${nombreArea}_${nombreCategoria}_${fechaActual}.${tipo}`;
  };

  return (
    <div>
      <h1 className="text-sky-950 font-bold text-3xl mb-6 p-6 text-center">
        Descargar lista de inscritos
      </h1>
  
      <div className="w-full max-w-4xl mx-auto bg-sky-50 p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Área */}
          <div className="flex-1">
            <label htmlFor="area" className="block mb-2 text-sm font-semibold text-gray-700">
              Área
            </label>
            <select
              id="area"
              name="area"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            >
              <option value="">-- Selecciona --</option>
              {Object.keys(datos).map((key) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>
          </div>
  
          {/* Curso */}
          <div className="flex-1">
            <label htmlFor="curso" className="block mb-2 text-sm font-semibold text-gray-700">
              Curso
            </label>
            <select
              id="curso"
              name="curso"
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
            >
              <option value="">-- Selecciona --</option>
              {[...new Set(categorias.map((cat) => cat.split(" - ")[1]))].map((curso, index) => (
                <option key={index} value={curso}>
                  {curso}
                </option>
              ))}
            </select>
          </div>
  
          {/* Categoría */}
          <div className="flex-1">
            <label htmlFor="categoria" className="block mb-2 text-sm font-semibold text-gray-700">
              Categoría
            </label>
            <select
              id="categoria"
              name="categoria"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">-- Selecciona --</option>
              {categorias.map((cat, index) => (
                <option key={index} value={cat.split(" - ")[0]}>
                  {cat.split(" - ")[0]}
                </option>
              ))}
            </select>
          </div>
  
          {/* colegio */}
          <div className="flex-1">
            <label htmlFor="colegio" className="block mb-2 text-sm font-semibold text-gray-700">
              Colegio
            </label>
            <select
              id="colegio"
              name="colegio"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
              value={colegio}
              onChange={(e) => setColegio(e.target.value)}
            >
              <option value="">-- Selecciona --</option>
              {[...new Set(inscritos.map((item) => item.colegio))].map((colegioName, idx) => (
                <option key={idx} value={colegioName}>
                  {colegioName}
                </option>
              ))}
            </select>
          </div>
  
          <div className="flex-1">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              name="fechaNacimiento"
              className="p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-700"
            />
          </div>
        </div>
      </div>
  
      {resultadosFiltrados.length > 0 ? (
        <div className="mt-6 flex justify-center">
          <div className="overflow-x-auto w-full max-w-6xl">
            <table className="min-w-max border border-gray-300 text-sm text-left">
              <thead>
                <tr>
                  <th colSpan="13" className="py-2 px-4 border border-gray-300 font-semibold bg-green-200 text-center">
                    Datos del competidor
                  </th>
                  <th colSpan="7" className="py-2 px-4 border border-gray-300 font-semibold bg-blue-200 text-center">
                    Datos del tutor legal
                  </th>
                  <th colSpan="5" className="py-2 px-4 border border-gray-300 font-semibold bg-purple-200 text-center">
                    Datos del tutor académico
                  </th>
                </tr>
                <tr>
                  {[
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
                    else if (idx < 20) bgColor = "bg-blue-100";
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
                {resultadosFiltrados.map((inscritos, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{inscritos.apellido_pa}</td>
                    <td className="px-4 py-2 border">{inscritos.apellido_ma}</td>
                    <td className="px-4 py-2 border">{inscritos.nombre}</td>
                    <td className="px-4 py-2 border">{inscritos.ci}</td>
                    <td className="px-4 py-2 border">{inscritos.fecha_nacimiento}</td>
                    <td className="px-4 py-2 border">{inscritos.correo}</td>
                    <td className="px-4 py-2 border">{inscritos.propietario_correo}</td>
                    <td className="px-4 py-2 border">{inscritos.curso}</td>
                    <td className="px-4 py-2 border">{inscritos.nombre_area}</td>
                    <td className="px-4 py-2 border">{inscritos.categoria}</td>
                    <td className="px-4 py-2 border">{inscritos.colegio}</td>
                    <td className="px-4 py-2 border">{inscritos.departamento}</td>
                    <td className="px-4 py-2 border">{inscritos.provincia}</td>
                    <td className="px-4 py-2 border">{inscritos.rol_tutor_legal}</td>
                    <td className="px-4 py-2 border">{inscritos.tutor_legal_apellido_pa}</td>
                    <td className="px-4 py-2 border">{inscritos.tutor_legal_apellido_ma}</td>
                    <td className="px-4 py-2 border">{inscritos.tutor_legal_nombre}</td>
                    <td className="px-4 py-2 border">{inscritos.tutor_legal_ci}</td>
                    <td className="px-4 py-2 border">{inscritos.tutor_legal_correo}</td>
                    <td className="px-4 py-2 border">{inscritos.tutor_legal_telefono}</td>
                    <td className="px-4 py-2 border">{inscritos.tutor_academico_apellido_pa}</td>
                    <td className="px-4 py-2 border">{inscritos.tutor_academico_apellido_ma}</td>
                    <td className="px-4 py-2 border">{inscritos.tutor_academico_nombre}</td>
                    <td className="px-4 py-2 border">{inscritos.tutor_academico_ci}</td>
                    <td className="px-4 py-2 border">{inscritos.tutor_academico_correo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-center text-gray-600">No se encontraron resultados.</p>
      )}
  
      {resultadosFiltrados.length > 0 && (
        <div className="flex justify-end mt-6 gap-2 mb-4">
          <button
            onClick={descargarPDF}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Descargar PDF
          </button>
          <button
            onClick={descargarExcel}
            className="bg-green-500 text-white px-4 mr-9 py-2 rounded hover:bg-green-600"
          >
            Descargar Excel
          </button>
        </div>
      )}
    </div>
  );
  
}

export default DescargarListas;
