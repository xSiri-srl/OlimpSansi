import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/borrar";
import Navbar from "./components/Navbar";
import InscripcionResponsable from "./pages/InscripcionResponsable";
import InscripcionEstudiante from "./pages/InscripcionEstudiante";
import InscripcionTutorLegal from "./pages/InscripcionTutorLegal";import SubirComprobante from "./components/SubirComprobante";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/inscripcion/responsable"
          element={<InscripcionResponsable />}
        />
        <Route
          path="/inscripcion/estudiante"
          element={<InscripcionEstudiante />}
        />
        <Route
          path="/inscripcion/tutorLegal"
          element={<InscripcionTutorLegal />}
        />
        <Route path="/SubirComprobante" element={<SubirComprobante />} />
      </Routes>
    </>
  );
}
