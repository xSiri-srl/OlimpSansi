"use client"

import { createContext, useContext } from "react"

export const FormDataContext = createContext(null)

export const useFormData = () => useContext(FormDataContext)

