import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Inicio/Inicio";
import Navbar from "./components/Navbar";
import Login from "./components/login";
import { ThemeProvider } from "./ThemeContext";
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
import { FormProvider } from "./pages/InscripcionLista/form-context";
import PasosInscripcion from "./pages/InscripcionLista/PasosInscripcion";
import GenerarOrdenPago from "./pages/OrdenPago/GenerarOrdenPago";
import PanelDatos from "./pages/Administrador/PanelDatos";
import DescargarListas from "./pages/Administrador/Reportes/DescargarListas";
import PreInscritos from "./pages/Administrador/Reportes/PreInscritos";
import InscritosVerificados from "./pages/Administrador/Reportes/InscritosVerificados";
import OrdenesPago from "./pages/Administrador/Reportes/OrdenesPago";
import Propuesta from "./pages/OrdenDePago/Propuesta";
import ConvocatoriasPublicadas from "./pages/Administrador/Convocatorias/ConvocatoriasPublicadas";
import SubirConvocatoria from "./pages/Administrador/Convocatorias/SubirConvocatoria";
import ProbarEnd from "./pages/hacer pruebas endpoint/ProbarEnd";
import EditarConvocatoria from "./pages/Administrador/Convocatorias/EditarConvocatoria";
import CrearOlimpiadas from "./pages/Administrador/CrearOlimpiadas/CrearOlimpiadas";
import AsociarNivel from "./pages/Administrador/CrearOlimpiadas/AsociarNivel";
import AsociarCosto from "./pages/Administrador/CrearOlimpiadas/AsociarCosto";
import AsociarLimite from "./pages/Administrador/CrearOlimpiadas/AsociarLimiteAreas";
import RutaPrivada from "./components/RutasPrivadas";
import DesasignarAreaNivel from "./pages/Administrador/CrearOlimpiadas/DesasignarAreaNivel";
import CodigoPreInscripcion from "./pages/EditarInscripcion/CodigoPreInscripcion";
import { useState } from "react";
import { FormDataContext } from "./pages/OrdenDePago/form-data-context";

export default function App() {
  const [globalData, setGlobalData] = useState({});
  return (
    <ThemeProvider>
      <FormDataContext.Provider value={{ globalData, setGlobalData }}>
        <Navbar />
        <div className="pt-20">
          <FormProvider>
            {/* ORDEN DE PAGO */}
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/login" element={<Login />} />
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
              <Route 
                path="/inscripcion/propuesta" 
                element={<Propuesta />} 
              />
              <Route 
                path="/editar-preinscripcion" 
                element={<CodigoPreInscripcion/>} 
              />
              {/* ORDEN DE PAGO GENERADA */}
              <Route path="/orden-pago" element={<OrdenPago />} />
              <Route
                path="/generar-orden-pago"
                element={<GenerarOrdenPago />}
              />
              {/* COMPROBANTE */}
              <Route path="/SubirComprobante" element={<SubirComprobante />} />

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

              <Route element={<RutaPrivada />}>
                <Route
                  path="/admin/generar-reportes"
                  element={<PanelDatos />}
                />
                <Route
                  path="/admin/descargar_listas"
                  element={<DescargarListas />}
                />
                <Route path="/admin/preInscritos" element={<PreInscritos />} />
                <Route
                  path="/admin/inscritos_verificados"
                  element={<InscritosVerificados />}
                />
                <Route path="/admin/ordenes-pago" element={<OrdenesPago />} />
                <Route
                  path="/admin/convocatoria"
                  element={<ConvocatoriasPublicadas />}
                />
                <Route
                  path="/nueva-convocatoria"
                  element={<SubirConvocatoria />}
                />
                <Route
                  path="/editar-convocatoria/:id"
                  element={<EditarConvocatoria />}
                />
                <Route
                  path="/admin/crear-olimpiada"
                  element={<CrearOlimpiadas />}
                />
                <Route path="/admin/asociar-nivel" element={<AsociarNivel />} />
                <Route path="/admin/asociar-costo" element={<AsociarCosto />} />
                <Route
                  path="/admin/asociar-limite"
                  element={<AsociarLimite />}
                />
                <Route 
                path="/admin/des-asignar-costo" 
                element={<DesasignarAreaNivel />} 
                />
              </Route>
              
     
              <Route
                path="/probarback"
                element={<ProbarEnd/>}
              />
            </Routes>
          </FormProvider>
        </div>
      </FormDataContext.Provider>
    </ThemeProvider>
  );
}
