import { createContext, useContext, useState } from "react";

const FormContext = createContext({
  globalData: {},
  setGlobalData: () => {},
  estudiantes: [],
  setEstudiantes: () => {},
});

export const FormProvider = ({ children }) => {
  const [globalData, setGlobalData] = useState({});
  const [estudiantes, setEstudiantes] = useState([]);

  return (
    <FormContext.Provider
      value={{ globalData, setGlobalData, estudiantes, setEstudiantes }}
    >
      {children}
    </FormContext.Provider>
  );
};
export const useFormData = () => useContext(FormContext);

export const useFormData = () => useContext(FormContext);
