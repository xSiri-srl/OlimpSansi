import { FaSchool, FaBuilding, FaMapMarkedAlt } from "react-icons/fa";

const DatosColegio = ({ estudianteData }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-blue-700 border-b pb-1">
        DATOS DE LA UNIDAD EDUCATIVA
      </h4>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FaSchool /> Nombre de la Unidad Educativa
        </label>
        <input
          type="text"
          className={"mt-1 p-2 w-full border rounded-md bg-gray-100"}
          value={estudianteData.colegio?.nombre_colegio || ""}
          disabled={true}
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FaBuilding /> Curso
        </label>
        <input
          type="text"
          className={"mt-1 p-2 w-full border rounded-md bg-gray-100"}
          value={estudianteData.colegio?.curso || ""}
          disabled={true}
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FaMapMarkedAlt /> Departamento
        </label>
        <input
          type="text"
          className={"mt-1 p-2 w-full border rounded-md bg-gray-100"}
          value={estudianteData.colegio?.departamento || ""}
          disabled={true}
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FaMapMarkedAlt /> Distrito
        </label>
        <input
          type="text"
          className={"mt-1 p-2 w-full border rounded-md bg-gray-100"}
          value={estudianteData.colegio?.distrito || ""}
          disabled={true}
        />
      </div>
    </div>
  );
};

export default DatosColegio;
