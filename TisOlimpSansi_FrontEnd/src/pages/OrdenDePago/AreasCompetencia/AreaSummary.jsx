const AreaSummary = ({ 
  seleccionadas, 
  categoriasSeleccionadas, 
}) => {
  if (seleccionadas.length === 0) return null;

  return (
    <div className="mt-6 p-3 bg-blue-50 rounded-lg text-center">
      <p className="font-semibold mb-1">Áreas seleccionadas:</p>
      <ul className="list-disc list-inside text-sm">
        {seleccionadas.map((area, index) => {
          let categoriaInfo = "";
          if (categoriasSeleccionadas[area]) {
            categoriaInfo = ` - ${categoriasSeleccionadas[area]}`;
          } else {
            categoriaInfo = ` - (selecciona una categoría)`;
          }

          return (
            <li key={index}>
              {area}
              <span
                className={
                  categoriaInfo.includes("No disponible")
                    ? "text-red-500 font-medium"
                    : "font-medium"
                }
              >
                {categoriaInfo}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AreaSummary;