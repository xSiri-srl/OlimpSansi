import { FaCloudUploadAlt } from "react-icons/fa";

const SubirArchivoStep = ({ onFileChange, selectedFile, error }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2 text-gray-500">
          Sube tu comprobante de pago
        </h2>
        <label className="border-2 border-dashed border-gray-400 p-6 w-full flex flex-col items-center rounded-lg cursor-pointer hover:bg-gray-200">
          <input
            type="file"
            className="hidden"
            onChange={onFileChange}
          />
          <div className="flex flex-col items-center">
            <span className="text-gray-500 text-4xl">
              <FaCloudUploadAlt size={60} />
            </span>
            <p className="text-sm text-gray-500 mt-2">
              Seleccionar imagen
            </p>
          </div>
        </label>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        {selectedFile && (
          <p className="text-sm text-green-600 mt-2">
            {selectedFile.name}
          </p>
        )}
      </div>
      <div className="bg-gray-300 p-6 rounded-md flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Ejemplo:
        </h3>
        <div className="bg-gray-400 p-4 rounded-md flex items-center justify-center">
          <img
            src="/images/boleta.jpg"
            alt="Boleta"
            className="w-full max-w-xl h-auto rounded-md shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default SubirArchivoStep;