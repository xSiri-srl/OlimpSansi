import { createContext, useContext, useState, useEffect } from "react";

const FormDataContextValue = createContext({
  globalData: {},
  setGlobalData: () => {},
});

// Clave para el sessionStorage
const STORAGE_KEY = 'olimpiada_form_data';

// Función para cargar datos del sessionStorage
const loadFromStorage = () => {
  try {
    const savedData = sessionStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : {};
  } catch (error) {
    console.error('Error al cargar datos del sessionStorage:', error);
    return {};
  }
};

// Función para guardar datos en sessionStorage
const saveToStorage = (data) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error al guardar datos en sessionStorage:', error);
  }
};

// Componente proveedor
export const FormDataContext = ({ children }) => {
  const [globalData, setGlobalDataState] = useState(() => loadFromStorage());

  // Función personalizada para setGlobalData que también persiste
  const setGlobalData = (newData) => {
    // Si newData es una función, la ejecutamos con el estado actual
    const updatedData = typeof newData === 'function' ? newData(globalData) : newData;
    
    setGlobalDataState(updatedData);
    saveToStorage(updatedData);
  };

  // Efecto para cargar datos cuando el componente se monta
  useEffect(() => {
    const savedData = loadFromStorage();
    if (Object.keys(savedData).length > 0) {
      setGlobalDataState(savedData);
    }
  }, []);

  return (
    <FormDataContextValue.Provider value={{ globalData, setGlobalData }}>
      {children}
    </FormDataContextValue.Provider>
  );
};

export const FormDataProvider = FormDataContext;

export const useFormData = () => {
  const context = useContext(FormDataContextValue);
  if (!context) {
    throw new Error('useFormData debe ser usado dentro de FormDataContext');
  }
  return {
    globalData: context.globalData,
    setGlobalData: context.setGlobalData
  };
};

// Función de utilidad para limpiar los datos almacenados (opcional)
export const clearFormData = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
  }
};