import { Routes, Route } from "react-router-dom";
import Home from "./pages/borrar";
import Navbar from "./components/Navbar";
import SubirComprobante from "./components/SubirComprobante";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SubirComprobante" element={<SubirComprobante />} />
      </Routes>
    </>
  );
}


