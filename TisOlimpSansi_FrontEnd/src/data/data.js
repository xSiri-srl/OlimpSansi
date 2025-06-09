
export const navbarLinksByRole = {
  0: [ // Responsable
    { id: 1, title: "Inicio", link: "/" },
    { id: 2, title: "Registrar Competidor", link: "/inscripcion/forma-inscripcion" },
    { id: 3, title: "Generar Orden de Pago", link: "/generar-orden-pago" },
    { id: 4, title: "Subir Comprobante", link: "/subirComprobante" },
    { id: 5, title: "Editar Pre-inscripcion", link: "/editar-preinscripcion" },
  ],
  1: [ // Reportes
    { id: 1, title: "Inicio", link: "/" },
    { id: 2, title: "Generar Reportes", link: "/admin/generar-reportes" },
    { id: 3, title: "Subir Convocatoria", link: "/admin/convocatoria" },
  ],
  2: [ // CreadorOlimpiada
    { id: 1, title: "Inicio", link: "/" },
    { id: 3, title: "Crear Olimpiada", link: "/admin/crear-olimpiada" },
    { id: 4, title: "Asignar Áreas", link: "/admin/asignar-area-nivel" },
    { id: 5, title: "Asignar Costos", link: "/admin/asignar-costo" },
    { id: 6, title: "Limitar Inscripciones", link: "/admin/asignar-limite" },
    { id: 7, title: "Desasignar Áreas", link: "/admin/desasignar-area-nivel" },
  ],
};
