import { Routes, Route } from "react-router-dom";
import Home from "./pages/borrar";
import Navbar from "./components/Navbar";
import InscripcionResponsable from "./pages/InscripcionResponsable";
import IndcripcionEstudiante from "./pages/InscripcionEstudiante";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inscripcion" element={<InscripcionResponsable />} />
        <Route
          path="/inscripcion/estudiante"
          element={<IndcripcionEstudiante />}
        />
      </Routes>
    </>
  );
}
