import { useNavigate } from "react-router-dom";
import { 
  FaUserAlt, 
  FaUsers } from "react-icons/fa"

export default function FormularioEstudiante() {
  const navigate = useNavigate()

  const handleSeleccion = () => {
    navigate(`/inscripcion/responsable`)
  }

  const handleSeleccionLista = () => {
    navigate(`/InscripcionLista/tutorial`)
  }
  return (
    <div className="p-6">
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-center mb-10">Seleccione su forma de inscripción</h1>

        <div className="flex justify-center gap-16">
          
          <div className="flex flex-col items-center cursor-pointer" onClick={() => handleSeleccion("individual")}>
            <div className="bg-gray-200 p-8 rounded-lg mb-4 w-100 h-100 flex items-center justify-center">
              <FaUserAlt size={140} className="text-black" />
            </div>
            <span className="text-2xl font-medium">Individual</span>
          </div>

          {
          <div className="flex flex-col items-center cursor-pointer" onClick={() => handleSeleccionLista("lista")}>
            <div className="bg-gray-200 p-8 rounded-lg mb-4 w-100 h-100 flex items-center justify-center">
              <FaUsers size={140} className="text-black" />
            </div>
            <span className="text-2xl font-medium">Con Lista</span>
          </div>
          }
        </div>
      </div>
    </div>
  );
}
