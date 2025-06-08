import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../utils/api";

export const useOrdenPago = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [codigoGenerado, setCodigoGenerado] = useState("");
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [ordenYaGenerada, setOrdenYaGenerada] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [mostrarPrevisualizacion, setMostrarPrevisualizacion] = useState(false);
  const [idOlimpiada, setIdOlimpiada] = useState("");
  const [costoUnico, setCostoUnico] = useState(null);
  const [costosPorArea, setCostosPorArea] = useState([]);
  const [tieneCostoUnico, setTieneCostoUnico] = useState(false);
  const [costosLoading, setCostosLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (cargando || descargando) {
      setProgreso(0);
      timer = setInterval(() => {
        setProgreso((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
    return () => clearInterval(timer);
  }, [cargando, descargando]);

  useEffect(() => {
    if (idOlimpiada) {
      obtenerCostos();
    }
  }, [idOlimpiada]);

  const obtenerPdf = async () => {
    try {
      const pdfResponse = await axios.get(
        `${API_URL}/api/orden-pago/${codigoGenerado}`,
        { responseType: "blob" }
      );
      const pdfBlob = new Blob([pdfResponse.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setMostrarPrevisualizacion(true);
    } catch (error) {
      setError("Error al obtener el PDF para previsualización");
    }
  };

  const verificarCodigo = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_URL}/api/obtener-orden-pago/${codigoGenerado}`
      );
      if (response.status === 200) {
        await obtenerResumen(codigoGenerado);
        await obtenerOlimpiada();
        const existeResponse = await axios.get(
          `${API_URL}/api/orden-pago-existe/${codigoGenerado}`
        );
        setOrdenYaGenerada(existeResponse.data.existe);
        if (existeResponse.data.existe) {
          await obtenerPdf();
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("No existe una orden de pago asociada a ese código.");
      } else {
        setError("Error al verificar el código.");
      }
    } finally {
      setLoading(false);
    }
  };

  const obtenerResumen = async (codigo) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/resumen-orden-pago/${codigo}`
      );
      setResumen(response.data.resumen);
    } catch (error) {
      setError("Error al obtener el resumen");
    }
  };

  const obtenerOlimpiada = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/obtener-olimpiada/${codigoGenerado}`
      );
      const idOlimpiada = response.data.id_olimpiada;
      setIdOlimpiada(idOlimpiada);
    } catch (error) {
      setError("Error al obtener la olimpiada asociada a la orden de pago");
    }
  };

  const obtenerCostos = async () => {
    if (!idOlimpiada) {
      setError("ID de olimpiada no disponible");
      return;
    }

    setCostosLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_URL}/obtener-costos-olimpiada/${idOlimpiada}`
      );

      if (response.data.status === 200) {
        const data = response.data.data;

        if (data.costo_unico) {
          setCostoUnico(data.costo);
          setCostosPorArea([]);
          setTieneCostoUnico(true);
        } else {
          setCostoUnico(null);
          setCostosPorArea(data.costos_por_area);
          setTieneCostoUnico(false);
        }
      } else {
        setError(response.data.message || "Error desconocido");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setError("Olimpiada no encontrada o sin áreas disponibles");
      } else {
        setError("Error al obtener los costos de la olimpiada");
      }
    } finally {
      setCostosLoading(false);
    }
  };
  const calcularTotal = () => {
    if (!resumen || !resumen.inscritos || resumen.inscritos.length === 0)
      return 0;

    if (tieneCostoUnico && costoUnico !== null) {
      return resumen.inscritos.length * costoUnico;
    } else if (!tieneCostoUnico && costosPorArea.length > 0) {
      const areasCounts = {};
      resumen.inscritos.forEach((inscrito) => {
        const area = inscrito.area;
        areasCounts[area] = (areasCounts[area] || 0) + 1;
      });

      let total = 0;
      Object.entries(areasCounts).forEach(([area, cantidad]) => {
        const costoArea = costosPorArea.find((c) => c.nombre_area === area);
        if (costoArea) {
          total += cantidad * parseInt(costoArea.costo);
        }
      });
      return total;
    }

    return 0;
  };

  const obtenerDesglosePorArea = () => {
    if (!resumen || !resumen.inscritos) return [];

    const areasCounts = {};
    resumen.inscritos.forEach((inscrito) => {
      const area = inscrito.area;
      areasCounts[area] = (areasCounts[area] || 0) + 1;
    });

    return Object.entries(areasCounts).map(([area, cantidad]) => {
      let costo = 0;
      if (tieneCostoUnico && costoUnico !== null) {
        costo = parseInt(costoUnico);
      } else if (!tieneCostoUnico && costosPorArea.length > 0) {
        const costoArea = costosPorArea.find((c) => c.nombre_area === area);
        if (costoArea) {
          costo = parseInt(costoArea.costo);
        }
      }
      return { area, cantidad, costo, subtotal: cantidad * costo };
    });
  };

  const confirmarGenerarOrden = async () => {
    setMostrarModal(false);
    setCargando(true);
    setProgreso(0);

    try {
      const response = await axios.get(
        `${API_URL}/api/orden-pago-existe/${codigoGenerado}`
      );
      if (response.data.existe) {
        setOrdenYaGenerada(true);
        setCargando(false);
        await obtenerPdf();
        return;
      }

      await axios.post(
        `${API_URL}/api/orden-pago/pdf`,
        { codigo_generado: codigoGenerado },
        { responseType: "blob" }
      );
      setOrdenYaGenerada(true);
      await obtenerPdf();
    } catch (error) {
      setError("Error generando la orden de pago.");
    } finally {
      setTimeout(() => {
        setCargando(false);
        setProgreso(0);
      }, 1000);
    }
  };

  const handleDownload = async () => {
    setDescargando(true);
    setProgreso(0);

    try {
      if (pdfUrl) {
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute("download", `orden_pago_${codigoGenerado}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        await obtenerPdf();
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute("download", `orden_pago_${codigoGenerado}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      setError("Error al descargar la orden de pago");
    } finally {
      setTimeout(() => {
        setDescargando(false);
        setProgreso(0);
      }, 1000);
    }
  };

  const togglePrevisualizacion = () => {
    setMostrarPrevisualizacion(!mostrarPrevisualizacion);
  };

  const handleCodigoChange = (codigo) => {
    setCodigoGenerado(codigo);
    setResumen(null);
    setError("");
    setOrdenYaGenerada(false);
    setPdfUrl(null);
    setMostrarPrevisualizacion(false);
    setIdOlimpiada("");
    setCostoUnico(null);
    setCostosPorArea([]);
    setTieneCostoUnico(false);
  };

  return {
    error,
    loading,
    codigoGenerado,
    resumen,
    cargando,
    descargando,
    mostrarModal,
    ordenYaGenerada,
    progreso,
    pdfUrl,
    mostrarPrevisualizacion,
    costoUnico,
    costosPorArea,
    tieneCostoUnico,
    costosLoading,
    setMostrarModal,
    verificarCodigo,
    calcularTotal,
    obtenerDesglosePorArea,
    confirmarGenerarOrden,
    handleDownload,
    togglePrevisualizacion,
    handleCodigoChange,
  };
};
