import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Inicio/Inicio";
import Navbar from "./components/Navbar";
import InscripcionResponsable from "./pages/OrdenDePago/InscripcionResponsable";
import InscripcionEstudiante from "./pages/OrdenDePago/InscripcionEstudiante";
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
import { FormProvider } from "./pages/InscripcionLista/form-context"
import PasosInscripcion from "./pages/InscripcionLista/PasosInscripcion";
import GenerarOrdenPago from "./pages/OrdenPago/GenerarOrdenPago";
import PanelDatos from "./pages/Administrador/PanelDatos";
import DescargarListas from "./pages/Administrador/DescargarListas";

export default function App() {
  return (
    <>
    <FormProvider>
    <Navbar />
      {/* ORDEN DE PAGO */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home-admin" element={<PanelDatos />} />
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
         <Route
          path="/generar-orden-pago"
          element={<GenerarOrdenPago />}
        />
      {/* COMPROBANTE */}
        <Route 
          path="/SubirComprobante" 
          element={<SubirComprobante />}
        />

        {/*Inscripcion Listas*/}

        <Route 
          path="/inscripcion-lista/tutorial" 
          element={<Tutorial />}
        />
         <Route 
          path="/inscripcion-lista/registro-lista" 
          element={<RegistroPorLista />}
        />
          <Route 
          path="/inscripcion-lista/subir-archivo" 
          element={<SubirArchivo />}
        />
       

          <Route 
          path="/inscripcion-lista/lista-competidores" 
          element={<ListaCompetidores />}
        />


        <Route 
          path="/admin/descargar_listas" 
          element={<DescargarListas/>}
        />
      </Routes> 
    </FormProvider>
      
    </>
  );
}
