import React from "react";

// Componente para campos de texto con validación
export const TextField = ({
  label,
  icon,
  name,
  placeholder,
  value,
  onChange,
  error,
  maxLength,
  type = "text",
  regex,
  transform,
}) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue.startsWith(" ")) return;
    
    // Si hay una transformación (como toUpperCase), aplicarla
    const transformedValue = transform ? transform(newValue) : newValue;
    
    // Si hay una expresión regular para validar, verificar
    if (regex && !(regex.test(transformedValue) || transformedValue === "")) {
      return;
    }
    
    onChange(transformedValue);
  };

  return (
    <div>
      <label className="flex items-center gap-2">
        {icon} {label}
      </label>
      <input
        type={type}
        name={name}
        className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder={placeholder}
        value={value || ""}
        onChange={handleChange}
        maxLength={maxLength}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// Componente para campos de selección (dropdown)
export const SelectField = ({
  label,
  icon,
  name,
  value,
  onChange,
  options,
  error,
  disabled = false,
  placeholder = "Seleccione una opción",
}) => {
  return (
    <div>
      <label className="flex items-center gap-2">
        {icon} {label}
      </label>
      <select
        name={name}
        className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// Componente para grupos de radio buttons
export const RadioGroupField = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
}) => {
  return (
    <div>
      <p className="text-sm text-gray-600 mt-2">{label}</p>
      <div className="flex flex-row space-x-5 mt-2">
        {options.map((option) => (
          <label key={option.value || option} className="inline-flex items-center">
            <input
              type="radio"
              name={name}
              value={option.value || option}
              checked={value === (option.value || option)}
              onChange={() => onChange(option.value || option)}
              className="mr-2"
            />
            {option.label || option}
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// Componente para campos de fecha
export const DateField = ({
  label,
  icon,
  name,
  value,
  onChange,
  error,
  min,
  max,
}) => {
  return (
    <div>
      <label className="flex items-center gap-2">
        {icon} {label}
      </label>
      <input
        type="date"
        name={name}
        className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        value={value || ""}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};