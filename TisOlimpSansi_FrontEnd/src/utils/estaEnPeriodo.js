export const estaEnPeriodo = (fechaIni, fechaFin) => {
  try {
    const ahoraUTC = new Date();
    const offsetBolivia = -4 * 60; 
    const ahoraBolivia = new Date(ahoraUTC.getTime() + (offsetBolivia * 60 * 1000));
    
    const inicio = new Date(fechaIni + 'T00:00:00-04:00');
    const fin = new Date(fechaFin + 'T23:59:59-04:00');
    
    const fechaActualBolivia = new Date(ahoraBolivia.getFullYear(), ahoraBolivia.getMonth(), ahoraBolivia.getDate());
    const fechaInicioBolivia = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
    const fechaFinBolivia = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate());
    
    return fechaActualBolivia >= fechaInicioBolivia && fechaActualBolivia <= fechaFinBolivia;
  } catch (error) {
    console.error('Error al validar período:', error);
    const ahora = new Date();
    const inicio = new Date(fechaIni);
    const fin = new Date(fechaFin);
    
    ahora.setHours(0, 0, 0, 0);
    inicio.setHours(0, 0, 0, 0);
    fin.setHours(23, 59, 59, 999); 
    
    return ahora >= inicio && ahora <= fin;
  }
};