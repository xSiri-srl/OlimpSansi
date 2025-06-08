const ResumenPreinscripcion = ({
  resumen,
  costosLoading,
  tieneCostoUnico,
  costoUnico,
  costosPorArea,
  obtenerDesglosePorArea,
  calcularTotal,
}) => {
  if (!resumen) return null;

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-4 text-gray-500">
        Resumen de Preinscripción
      </h2>
      <div className="mt-4 bg-white rounded-lg shadow-md p-6 text-left max-w-3xl mx-auto">
        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold text-blue-600">
            Responsable de Inscripción
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-gray-500">Nombre Completo</p>
              <p className="font-medium">
                {`${resumen.responsable.nombre || ""} 
                  ${resumen.responsable.apellido_pa || ""} 
                  ${resumen.responsable.apellido_ma || ""}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Carnet de Identidad</p>
              <p className="font-medium">{resumen.responsable.ci || ""}</p>
            </div>
          </div>
        </div>
        <div
          className={`mt-6 ${
            resumen.inscritos.length > 25 ? "max-h-96 overflow-y-auto pr-2" : ""
          }`}
        >
          <div className="mb-6 border-b pb-4">
            <h3 className="text-lg font-semibold text-blue-600">
              Resumen de Competidores
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-2 border">#</th>
                    <th className="px-4 py-2 border">Nombre</th>
                    <th className="px-4 py-2 border">Categoría</th>
                    <th className="px-4 py-2 border">Área</th>
                    <th className="px-4 py-2 border">Curso</th>
                  </tr>
                </thead>
                <tbody>
                  {resumen.inscritos.map((inscrito, index) => (
                    <tr key={index} className="text-gray-800">
                      <td className="px-4 py-2 border">{index + 1}</td>
                      <td className="px-4 py-2 border">
                        {inscrito.nombre_estudiante}
                      </td>
                      <td className="px-4 py-2 border">{inscrito.categoria}</td>
                      <td className="px-4 py-2 border">{inscrito.area}</td>
                      <td className="px-4 py-2 border">{inscrito.grado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold text-blue-600 mb-3">Importe</h3>

          {costosLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-600">Cargando información de costos...</p>
            </div>
          ) : (
            <>
              {tieneCostoUnico && costoUnico !== null ? (
                <>
                  <div className="flex justify-between border-b py-2">
                    <span className="text-gray-600 font-medium">
                      Costo por participante
                    </span>
                    <span className="font-semibold">{costoUnico} Bs.</span>
                  </div>
                  <div className="flex justify-between border-b py-2">
                    <span className="text-gray-600 font-medium">
                      Total de participantes
                    </span>
                    <span className="font-semibold">
                      {resumen.inscritos.length}
                    </span>
                  </div>
                </>
              ) : costosPorArea.length > 0 ? (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Desglose por área:
                    </p>
                    {obtenerDesglosePorArea().map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b py-2"
                      >
                        <div className="flex-1">
                          <span className="text-gray-600 font-medium">
                            {item.area}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({item.cantidad} × {item.costo} Bs.)
                          </span>
                        </div>
                        <span className="font-semibold">
                          {item.subtotal} Bs.
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between border-b py-2">
                    <span className="text-gray-600 font-medium">
                      Costo por participante (temporal)
                    </span>
                    <span className="font-semibold">20 Bs.</span>
                  </div>
                  <div className="flex justify-between border-b py-2">
                    <span className="text-gray-600 font-medium">
                      Total de participantes
                    </span>
                    <span className="font-semibold">
                      {resumen.inscritos.length}
                    </span>
                  </div>
                </>
              )}

              <div className="flex justify-between py-2 text-blue-700 font-bold text-lg">
                <span>Total a pagar</span>
                <span>{calcularTotal()} Bs</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumenPreinscripcion;
