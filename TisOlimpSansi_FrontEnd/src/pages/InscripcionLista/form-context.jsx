"use client"

import { createContext, useContext, useState } from "react"

// Crear el contexto
const FormContext = createContext({
  globalData: {},
  setGlobalData: () => {},
  estudiantes: [],
  setEstudiantes: () => {},
})

// Proveedor del contexto
export const FormProvider = ({ children }) => {
  const [globalData, setGlobalData] = useState({})
  const [estudiantes, setEstudiantes] = useState([])

  return (
    <FormContext.Provider value={{ globalData, setGlobalData, estudiantes, setEstudiantes }}>
      {children}
    </FormContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export const useFormData = () => useContext(FormContext)