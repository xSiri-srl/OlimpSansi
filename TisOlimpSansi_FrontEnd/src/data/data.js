export const navbarLinksByRole = {
  responsable: [
    { id: 1, title: "Inicio", link: "/" },
    { id: 2, title: "Registrar Competidor", link: "/inscripcion/forma-inscripcion" },
    { id: 3, title: "Generar Orden de Pago", link: "/generar-orden-pago" },
    { id: 4, title: "Subir Comprobante", link: "/subirComprobante" },
    { id: 5, title: "Editar Pre-inscripcion", link: "/editar-preinscripcion" },
  ],
  admin2: [
    { id: 1, title: "Generar Reportes", link: "/admin/generar-reportes" },
    //{ id: 2, title: "Crear Olimpiada", link: "/admin/crear-olimpiada" },
    //{ id: 3, title: "Asignar Áreas", link: "/admin/asociar-nivel" },
    //{ id: 4, title: "Asignar Costos", link: "/admin/asociar-costo" },
    //{ id: 2, title: "Subir Convocatoria", link: "/admin/convocatoria" },
  ],
  admin: [
    { id: 1, title: "Inicio", link: "/" },
   { id: 2, title: "Generar Reportes", link: "/admin/generar-reportes" },
    { id: 3, title: "Crear Olimpiada", link: "/admin/crear-olimpiada" },
    { id: 4, title: "Asignar Áreas", link: "/admin/asociar-nivel" },
    { id: 5, title: "Asignar Costos", link: "/admin/asociar-costo" },
    { id: 6, title: "Limitar Inscripciones", link: "/admin/asociar-limite" },
    { id: 7, title: "Desasignar Áreas", link: "/admin/des-asignar-costo" },
  //  { id: 8, title: "Convocatorias", link: "/admin/convocatoria" },
  ],
};