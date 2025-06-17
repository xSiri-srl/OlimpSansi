import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Inicio/Inicio";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import { ThemeProvider } from "./ThemeContext";
import InscripcionResponsable from "./pages/Usuario/InscripcionIndividual/InscripcionResponsable";
import InscripcionEstudiante from "./pages/Usuario/InscripcionIndividual/InscripcionEstudiante";
import InscripcionTutorLegal from "./pages/Usuario/InscripcionIndividual/InscripcionTutorLegal";
import SubirComprobante from "./pages/Usuario/Comprobante/SubirComprobante";
import AreaCompetencia from "./pages/Usuario/InscripcionIndividual/AreasCompetencia";
import InscripcionTutorAcademico from "./pages/Usuario/InscripcionIndividual/InscripcionTutorAcademico";
import FormaInscripcion from "./pages/Usuario/InscripcionIndividual/FormaInscripcion";
import OrdenPago from "./pages/Usuario/InscripcionIndividual/OrdenDePago";
import Tutorial from "./pages/Usuario/InscripcionLista/Tutorial";
import RegistroPorLista from "./pages/Usuario/InscripcionLista/RegistroPorLista";
import SubirArchivo from "./pages/Usuario/InscripcionLista/SubirArchivo";
import ListaCompetidores from "./pages/Usuario/InscripcionLista/ListaCompetidores";
import { FormProvider } from "./pages/Usuario/InscripcionLista/form-context";
import GenerarOrdenPago from "./pages/Usuario/OrdenPago/index";
import PanelDatos from "./pages/Administrador/PanelDatos";
import DescargarListas from "./pages/Administrador/Reportes/DescargarListas";
import PreInscritos from "./pages/Administrador/Reportes/PreInscritos";
import InscritosVerificados from "./pages/Administrador/Reportes/InscritosVerificados";
import OrdenesPago from "./pages/Administrador/Reportes/OrdenesPago";
import ConvocatoriasPublicadas from "./pages/Administrador/Convocatorias/ConvocatoriasPublicadas";
import SubirConvocatoria from "./pages/Administrador/Convocatorias/SubirConvocatoria";

import EditarConvocatoria from "./pages/Administrador/Convocatorias/EditarConvocatoria";
import CrearOlimpiadas from "./pages/Administrador/CrearOlimpiadas/CrearOlimpiadas";

import RutaPrivada from "./components/RutasPrivadas";
import DesasignarAreaNivel from "./pages/Administrador/DesasignarAreaNivel/index";
import CodigoPreInscripcion from "./pages/Usuario/EditarInscripcion";
import { useState } from "react";
import { FormDataProvider } from "./pages/Usuario/InscripcionIndividual/form-data-context";

import AsignarLimiteAreas from "./pages/Administrador/AsignarLimiteAreas/AsignarLimiteAreas";
import AsignarCosto from "./pages/Administrador/AsignarCosto/index";
import AsociarAreaNivel from "./pages/Administrador/AsignarAreaNivel/index";

export default function App() {
  return (
    <ThemeProvider>
      <FormDataProvider>
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
                path="/editar-preinscripcion"
                element={<CodigoPreInscripcion />}
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
                <Route
                  path="/admin/asignar-area-nivel"
                  element={<AsociarAreaNivel />}
                />

                <Route path="/admin/asignar-costo" 
                element={<AsignarCosto />}
                 />

                <Route
                  path="/admin/asignar-limite"
                  element={<AsignarLimiteAreas />}
                />
                <Route
                  path="/admin/desasignar-area-nivel"
                  element={<DesasignarAreaNivel />}
                />
              </Route>
            </Routes>
          </FormProvider>
        </div>
      </FormDataProvider>
    </ThemeProvider>
  );
}
