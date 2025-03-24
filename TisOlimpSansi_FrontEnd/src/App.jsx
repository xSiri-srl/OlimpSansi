import { Routes, Route } from "react-router-dom";
import Home from "./pages/borrar";
import Navbar from "./components/Navbar";
import InscripcionResponsable from "./pages/InscripcionResponsable";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inscripcion" element={<InscripcionResponsable />} />
      </Routes>
    </>
  );
}
