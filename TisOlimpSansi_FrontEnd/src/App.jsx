import { Routes, Route } from "react-router-dom";
import Home from "./pages/borrar";
import Navbar from "./components/Navbar";
import InscripcionResponsable from "./pages/InscripcionResponsable";
import IndcripcionEstudiante from "./pages/InscripcionEstudiante";
import InscripcionTutorLegal from "./pages/InscripcionTutorLegal";
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
          element={<IndcripcionEstudiante />}
        />
        <Route
          path="/inscripcion/tutorLegal"
          element={<InscripcionTutorLegal />}
        />
      </Routes>
    </>
  );
}
