import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Inicio/Inicio";
import Navbar from "./components/Navbar";
import InscripcionResponsable from "./pages/OrdenDePago/InscripcionResponsable";
import InscripcionEstudiante from "./pages/OrdenDePago/inscripcionEstudiante";
import InscripcionTutorLegal from "./pages/OrdenDePago/InscripcionTutorLegal";
import SubirComprobante from "./pages/Comprobante/SubirComprobante";
import AreaCompetencia from "./pages/OrdenDePago/AreasCompetencia";
import InscripcionTutorAcademico from "./pages/OrdenDePago/IncripcionTutorAcademico";
import FormaInscripcion from "./pages/OrdenDePago/FormaInscripcion";
import OrdenPago from "./pages/OrdenDePago/OrdenDePago";
import Tutorial from "./pages/InscripcionLista/Tutorial";
import RegistroPorLista from "./pages/InscripcionLista/RegistroPorLista";
import SubirArchivo from "./pages/InscripcionLista/SubirArchivo";
import ListaCompetidores from "./pages/InscripcionLista/ListaCompetidores";

export default function App() {
  return (
    <>
      <Navbar />
      {/* ORDEN DE PAGO */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/inscripcion/forma-inscripcion"
          element={<FormaInscripcion />}
        />
        <Route
          path="/inscripcion/responsable"
          element={<InscripcionResponsable />}
        />
        <Route
          path="/inscripcion/estudiante"
          element={<InscripcionEstudiante />}
        />
        <Route 
          path="/inscripcion/areas-competencia" 
          element={<AreaCompetencia />}
        />
        <Route
          path="/inscripcion/tutor-legal"
          element={<InscripcionTutorLegal />}
        />
        <Route
          path="/inscripcion/tutor-academico"
          element={<InscripcionTutorAcademico />}
        />
        {/* ORDEN DE PAGO GENERADA */}
        <Route
          path="/ordenDePago"
          element={<OrdenPago />}
        />
      {/* COMPROBANTE */}
        <Route 
          path="/SubirComprobante" 
          element={<SubirComprobante />}
        />

        {/*Inscripcion Listas*/}

        <Route 
          path="/InscripcionLista/tutorial" 
          element={<Tutorial />}
        />
         <Route 
          path="/InscripcionLista/registroLista" 
          element={<RegistroPorLista />}
        />
          <Route 
          path="/InscripcionLista/subirArchivo" 
          element={<SubirArchivo />}
        />

          <Route 
          path="/InscripcionLista/listaCompetidores" 
          element={<ListaCompetidores />}
        />

      </Routes>
    </>
  );
}
