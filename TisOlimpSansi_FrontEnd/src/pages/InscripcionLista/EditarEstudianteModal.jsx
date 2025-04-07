import React, { useState, useEffect } from "react";
import { FaTimes, FaUser, FaIdCard, FaEnvelope, FaCalendarAlt, FaSchool, FaBuilding, FaMapMarkedAlt, FaPhone } from "react-icons/fa";

// Constantes para evitar errores ortográficos
const SECCIONES = {
  TODOS: "todos",
  INVALIDOS: "invalidos"
};

const departamentos = {
  "La Paz": ["Murillo", "Pacajes", "Los Andes", "Larecaja", "Ingavi"],
  Cochabamba: ["Cercado", "Quillacollo", "Chapare", "Arani", "Ayopaya"],
  "Santa Cruz": ["Andrés Ibáñez", "Warnes", "Ichilo", "Sara", "Vallegrande"],
  Oruro: ["Cercado", "Sajama", "Sabaya", "Litoral", "Pantaleón Dalence"],
  Potosí: ["Tomás Frías", "Charcas", "Chayanta", "Nor Chichas", "Sur Chichas"],
  Chuquisaca: ["Oropeza", "Zudáñez", "Tomina", "Belisario Boeto", "Nor Cinti"],
  Tarija: ["Cercado", "Gran Chaco", "O'Connor", "Avilés", "Arce"],
  Beni: ["Cercado", "Moxos", "Vaca Díez", "Marbán", "Yacuma"],
  Pando: ["Madre de Dios", "Manuripi", "Nicolás Suárez", "Abuná", "Federico Román"],
};

const cursos = [
  "3ro de Primaria",
  "4to de Primaria",
  "5to de Primaria",
  "6to de Primaria",
  "1ro de Secundaria",
  "2do de Secundaria",
  "3ro de Secundaria",
  "4to de Secundaria",
  "5to de Secundaria",
  "6to de Secundaria",
];

const areas = [
  "Matemáticas",
  "Física",
  "Química",
  "Biología",
  "Informática",
  "Robótica",
  "Astronomía y Astrofísica"
];

const obtenerCategorias = (area, curso) => {
  if (area !== "Informática" && area !== "Robótica") {
    return [];
  }
  
  const esPrimaria = curso.includes("Primaria");
  const esSecundaria = curso.includes("Secundaria");
  const numero = parseInt(curso.match(/\d+/)?.[0] || "0");
  
  // Para Informática
  if (area === "Informática") {
    if (esPrimaria && (numero === 5 || numero === 6)) {
      return ["\"Guacamayo\" 5to a 6to Primaria"];
    } else if (esSecundaria && numero >= 1 && numero <= 3) {
      return [
        "\"Guanaco\" 1ro a 3ro Secundaria", 
        "\"Londra\" 1ro a 3ro Secundaria",
        "\"Bufeo\" 1ro a 3ro Secundaria"
      ];
    } else if (esSecundaria && numero >= 4 && numero <= 6) {
      return [
        "\"Jucumari\" 4to a 6to Secundaria",
        "\"Puma\" 4to a 6to Secundaria"
      ];
    }
  }
  
  // Para Robótica
  if (area === "Robótica") {
    if (esPrimaria && (numero === 5 || numero === 6)) {
      return [
        "\"Builders P\" 5to a 6to Primaria",
        "\"Lego P\" 5to a 6to Primaria"
      ];
    } else if (esSecundaria) {
      return [
        "\"Builders S\" 1ro a 6to Secundaria",
        "\"Lego S\" 1ro a 6to Secundaria"
      ];
    }
  }
  
  return ["Categoría no disponible para este curso"];
};

const EditarEstudianteModal = ({ estudiante, onClose, onSave }) => {
  const [seccionActiva, setSeccionActiva] = useState(SECCIONES.TODOS);
  const [estudianteData, setEstudianteData] = useState(null);
  const [errores, setErrores] = useState({});
  
  // Inicializa los datos del estudiante cuando se abre el modal
  useEffect(() => {
    if (estudiante?.originalData) {
      setEstudianteData({...estudiante.originalData});
    }
  }, [estudiante]);

  if (!estudianteData) return null;

  // Función para actualizar cualquier campo del estudiante
  const handleChange = (section, field, value) => {
    setEstudianteData(prev => {
      const newData = {...prev};
      
      if (section === 'estudiante') {
        newData.estudiante = {...newData.estudiante, [field]: value};
      } else if (section === 'colegio') {
        newData.colegio = {...newData.colegio, [field]: value};
      } else if (section === 'tutor_legal') {
        newData.tutor_legal = {...newData.tutor_legal, [field]: value};
      } else if (section.startsWith('tutor_academico_')) {
        const index = parseInt(section.split('_')[2]);
        if (!newData.tutores_academicos) newData.tutores_academicos = [];
        if (!newData.tutores_academicos[index]) {
          newData.tutores_academicos[index] = {
            nombre_area: newData.areas_competencia?.[index]?.nombre_area || '',
            tutor: {}
          };
        }
        newData.tutores_academicos[index].tutor = {
          ...newData.tutores_academicos[index].tutor,
          [field]: value
        };
      } else if (section.startsWith('area_')) {
        const index = parseInt(section.split('_')[1]);
        if (!newData.areas_competencia) newData.areas_competencia = [];
        if (!newData.areas_competencia[index]) {
          newData.areas_competencia[index] = { nombre_area: '', categoria: '' };
        }
        
        if (field === 'nombre_area') {
          // Al cambiar el área, actualizar también el área del tutor académico
          if (newData.tutores_academicos && newData.tutores_academicos[index]) {
            newData.tutores_academicos[index].nombre_area = value;
          }
          newData.areas_competencia[index].nombre_area = value;
          // Resetear la categoría si cambia el área
          newData.areas_competencia[index].categoria = '';
        } else {
          newData.areas_competencia[index][field] = value;
        }
      }
      
      return newData;
    });
  };

  // Validar todos los campos requeridos
  const validarDatos = () => {
    const nuevoErrores = {};
    
    // Validar datos del estudiante
    if (!estudianteData.estudiante?.nombre) 
      nuevoErrores.nombre = "El nombre es obligatorio";
    if (!estudianteData.estudiante?.apellido_pa) 
      nuevoErrores.apellido_pa = "El apellido paterno es obligatorio";
    if (!estudianteData.estudiante?.ci) 
      nuevoErrores.ci = "El CI es obligatorio";
    
    // Validar datos del colegio
    if (!estudianteData.colegio?.nombre_colegio) 
      nuevoErrores.nombre_colegio = "El nombre del colegio es obligatorio";
    if (!estudianteData.colegio?.curso) 
      nuevoErrores.curso = "El curso es obligatorio";
    
    // Validar áreas de competencia
    if (!estudianteData.areas_competencia || estudianteData.areas_competencia.length === 0 ||
        !estudianteData.areas_competencia[0]?.nombre_area) {
      nuevoErrores.areas = "Debe seleccionar al menos un área de competencia";
    }
    
    // Validar categorías para informática y robótica
    estudianteData.areas_competencia?.forEach((area, index) => {
      if ((area.nombre_area === "Informática" || area.nombre_area === "Robótica") && !area.categoria) {
        nuevoErrores[`categoria_${index}`] = `Debe seleccionar una categoría para ${area.nombre_area}`;
      }
    });
    
    setErrores(nuevoErrores);
    return Object.keys(nuevoErrores).length === 0;
  };

  // Guardar cambios
  const handleSave = () => {
    if (validarDatos()) {
      onSave(estudianteData);
    }
  };

  // Función para cambiar el departamento y resetear provincia
  const handleDepartamentoChange = (value) => {
    setEstudianteData(prev => ({
      ...prev,
      colegio: {
        ...prev.colegio,
        departamento: value,
        provincia: '' // Resetear provincia
      }
    }));
  };

  // Verificar si el campo tiene error
  const tieneError = (campo) => Boolean(errores[campo]);

  // Función para mostrar u ocultar campos según la sección activa
  const mostrarCampo = (campo) => {
    if (seccionActiva === SECCIONES.TODOS) return true;
    return tieneError(campo);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-5 w-full max-w-4xl shadow-xl my-4 mx-2 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
          <h3 className="text-xl font-semibold">Editar información del competidor</h3>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Mostrar:</label>
              <select 
                className="border rounded px-2 py-1 text-sm"
                value={seccionActiva}
                onChange={(e) => setSeccionActiva(e.target.value)}
              >
                <option value={SECCIONES.TODOS}>Todos los campos</option>
                <option value={SECCIONES.INVALIDOS}>Solo campos inválidos</option>
              </select>
            </div>
            
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SECCIÓN 1: DATOS DEL ESTUDIANTE */}
          <div className="space-y-4">
            <h4 className="font-medium text-blue-700 border-b pb-1">DATOS DEL COMPETIDOR</h4>
            
            {mostrarCampo('apellido_pa') && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaUser /> Apellido Paterno *
                </label>
                <input
                  type="text"
                  className={`mt-1 p-2 w-full border rounded-md ${tieneError('apellido_pa') ? 'border-red-500' : ''}`}
                  value={estudianteData.estudiante?.apellido_pa || ''}
                  onChange={(e) => handleChange('estudiante', 'apellido_pa', e.target.value.toUpperCase())}
                />
                {tieneError('apellido_pa') && <p className="text-red-500 text-xs mt-1">{errores.apellido_pa}</p>}
              </div>
            )}
            
            {mostrarCampo('apellido_ma') && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaUser /> Apellido Materno
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={estudianteData.estudiante?.apellido_ma || ''}
                  onChange={(e) => handleChange('estudiante', 'apellido_ma', e.target.value.toUpperCase())}
                />
              </div>
            )}
            
            {mostrarCampo('nombre') && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaUser /> Nombres *
                </label>
                <input
                  type="text"
                  className={`mt-1 p-2 w-full border rounded-md ${tieneError('nombre') ? 'border-red-500' : ''}`}
                  value={estudianteData.estudiante?.nombre || ''}
                  onChange={(e) => handleChange('estudiante', 'nombre', e.target.value.toUpperCase())}
                />
                {tieneError('nombre') && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
              </div>
            )}
            
            {mostrarCampo('ci') && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaIdCard /> Carnet de Identidad *
                </label>
                <input
                  type="text"
                  className={`mt-1 p-2 w-full border rounded-md ${tieneError('ci') ? 'border-red-500' : ''}`}
                  value={estudianteData.estudiante?.ci || ''}
                  onChange={(e) => handleChange('estudiante', 'ci', e.target.value)}
                  maxLength="8"
                />
                {tieneError('ci') && <p className="text-red-500 text-xs mt-1">{errores.ci}</p>}
              </div>
            )}
            
            {mostrarCampo('fecha_nacimiento') && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaCalendarAlt /> Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={estudianteData.estudiante?.fecha_nacimiento || ''}
                  onChange={(e) => handleChange('estudiante', 'fecha_nacimiento', e.target.value)}
                />
              </div>
            )}
            
            {mostrarCampo('correo') && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaEnvelope /> Correo Electrónico
                </label>
                <input
                  type="email"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={estudianteData.estudiante?.correo || ''}
                  onChange={(e) => handleChange('estudiante', 'correo', e.target.value)}
                />
              </div>
            )}
            
            {mostrarCampo('propietario_correo') && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  El correo electrónico pertenece a:
                </label>
                <div className="flex flex-row space-x-4 mt-1">
                  {["Estudiante", "Padre/Madre", "Profesor"].map((rol) => (
                    <label key={rol} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="propietario_correo"
                        value={rol}
                        checked={estudianteData.estudiante?.propietario_correo === rol}
                        onChange={() => handleChange('estudiante', 'propietario_correo', rol)}
                        className="mr-1"
                      />
                      <span className="text-sm">{rol}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            <h4 className="font-medium text-blue-700 border-b pb-1 mt-6">DATOS DEL COLEGIO</h4>
            
            {mostrarCampo('nombre_colegio') && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaSchool /> Nombre del Colegio *
                </label>
                <input
                  type="text"
                  className={`mt-1 p-2 w-full border rounded-md ${tieneError('nombre_colegio') ? 'border-red-500' : ''}`}
                  value={estudianteData.colegio?.nombre_colegio || ''}
                  onChange={(e) => handleChange('colegio', 'nombre_colegio', e.target.value.toUpperCase())}
                />
                {tieneError('nombre_colegio') && <p className="text-red-500 text-xs mt-1">{errores.nombre_colegio}</p>}
              </div>
            )}
            
            {mostrarCampo('curso') && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaBuilding /> Curso *
                </label>
                <select
                  className={`mt-1 p-2 w-full border rounded-md ${tieneError('curso') ? 'border-red-500' : ''}`}
                  value={estudianteData.colegio?.curso || ''}
                  onChange={(e) => handleChange('colegio', 'curso', e.target.value)}
                >
                  <option value="">Seleccione un Curso</option>
                  {cursos.map((curso) => (
                    <option key={curso} value={curso}>{curso}</option>
                  ))}
                </select>
                {tieneError('curso') && <p className="text-red-500 text-xs mt-1">{errores.curso}</p>}
              </div>
            )}
            
            {mostrarCampo('departamento') && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaMapMarkedAlt /> Departamento
                </label>
                <select
                  className="mt-1 p-2 w-full border rounded-md"
                  value={estudianteData.colegio?.departamento || ''}
                  onChange={(e) => handleDepartamentoChange(e.target.value)}
                >
                  <option value="">Seleccione un Departamento</option>
                  {Object.keys(departamentos).map((dep) => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>
            )}
            
            {mostrarCampo('provincia') && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaMapMarkedAlt /> Provincia
                </label>
                <select
                  className="mt-1 p-2 w-full border rounded-md"
                  value={estudianteData.colegio?.provincia || ''}
                  onChange={(e) => handleChange('colegio', 'provincia', e.target.value)}
                  disabled={!estudianteData.colegio?.departamento}
                >
                  <option value="">Seleccione una Provincia</option>
                  {(departamentos[estudianteData.colegio?.departamento] || []).map((provincia) => (
                    <option key={provincia} value={provincia}>{provincia}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {/* SECCIÓN 2: ÁREAS, TUTOR LEGAL Y ACADÉMICO */}
          <div className="space-y-4">
            <h4 className="font-medium text-blue-700 border-b pb-1">ÁREAS DE COMPETENCIA</h4>
            
            {mostrarCampo('areas') && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Área de competencia 1 *
                  </label>
                  <div className="flex gap-2">
                    <select
                      className={`mt-1 p-2 w-full border rounded-md ${tieneError('areas') ? 'border-red-500' : ''}`}
                      value={estudianteData.areas_competencia?.[0]?.nombre_area || ''}
                      onChange={(e) => handleChange('area_0', 'nombre_area', e.target.value)}
                    >
                      <option value="">Seleccione un área</option>
                      {areas.map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                  {tieneError('areas') && <p className="text-red-500 text-xs mt-1">{errores.areas}</p>}
                </div>
                
                {(estudianteData.areas_competencia?.[0]?.nombre_area === "Informática" || 
                 estudianteData.areas_competencia?.[0]?.nombre_area === "Robótica") && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Categoría para {estudianteData.areas_competencia[0].nombre_area} *
                    </label>
                    <select
                      className={`mt-1 p-2 w-full border rounded-md ${tieneError('categoria_0') ? 'border-red-500' : ''}`}
                      value={estudianteData.areas_competencia[0].categoria || ''}
                      onChange={(e) => handleChange('area_0', 'categoria', e.target.value)}
                    >
                      <option value="">Seleccione una categoría</option>
                      {obtenerCategorias(estudianteData.areas_competencia[0].nombre_area, estudianteData.colegio?.curso || '').map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {tieneError('categoria_0') && <p className="text-red-500 text-xs mt-1">{errores.categoria_0}</p>}
                  </div>
                )}
                
                {/* Segunda área (opcional) */}
                <div className="mt-2">
                  <label className="text-sm font-medium text-gray-700">
                    Área de competencia 2 (opcional)
                  </label>
                  <select
                    className="mt-1 p-2 w-full border rounded-md"
                    value={estudianteData.areas_competencia?.[1]?.nombre_area || ''}
                    onChange={(e) => handleChange('area_1', 'nombre_area', e.target.value)}
                  >
                    <option value="">Seleccione un área (opcional)</option>
                    {areas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                
                {(estudianteData.areas_competencia?.[1]?.nombre_area === "Informática" || 
                 estudianteData.areas_competencia?.[1]?.nombre_area === "Robótica") && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Categoría para {estudianteData.areas_competencia[1].nombre_area} *
                    </label>
                    <select
                      className={`mt-1 p-2 w-full border rounded-md ${tieneError('categoria_1') ? 'border-red-500' : ''}`}
                      value={estudianteData.areas_competencia[1].categoria || ''}
                      onChange={(e) => handleChange('area_1', 'categoria', e.target.value)}
                    >
                      <option value="">Seleccione una categoría</option>
                      {obtenerCategorias(estudianteData.areas_competencia[1].nombre_area, estudianteData.colegio?.curso || '').map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {tieneError('categoria_1') && <p className="text-red-500 text-xs mt-1">{errores.categoria_1}</p>}
                  </div>
                )}
              </div>
            )}
            
            <h4 className="font-medium text-blue-700 border-b pb-1 mt-6">DATOS DEL TUTOR LEGAL</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaUser /> Apellido Paterno
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={estudianteData.tutor_legal?.apellido_pa || ''}
                  onChange={(e) => handleChange('tutor_legal', 'apellido_pa', e.target.value.toUpperCase())}
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaUser /> Apellido Materno
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={estudianteData.tutor_legal?.apellido_ma || ''}
                  onChange={(e) => handleChange('tutor_legal', 'apellido_ma', e.target.value.toUpperCase())}
                />
              </div>
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaUser /> Nombres
              </label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
                value={estudianteData.tutor_legal?.nombre || ''}
                onChange={(e) => handleChange('tutor_legal', 'nombre', e.target.value.toUpperCase())}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaIdCard /> Carnet de Identidad
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={estudianteData.tutor_legal?.ci || ''}
                  onChange={(e) => handleChange('tutor_legal', 'ci', e.target.value)}
                  maxLength="8"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaPhone /> Teléfono
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={estudianteData.tutor_legal?.numero_celular || ''}
                  onChange={(e) => handleChange('tutor_legal', 'numero_celular', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaEnvelope /> Correo Electrónico
              </label>
              <input
                type="email"
                className="mt-1 p-2 w-full border rounded-md"
                value={estudianteData.tutor_legal?.correo || ''}
                onChange={(e) => handleChange('tutor_legal', 'correo', e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Rol:</label>
              <div className="flex flex-row space-x-4 mt-1">
                {["Padre", "Madre", "Tutor Legal"].map((rol) => (
                  <label key={rol} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="tipo_tutor"
                      value={rol}
                      checked={estudianteData.tutor_legal?.tipo === rol}
                      onChange={() => handleChange('tutor_legal', 'tipo', rol)}
                      className="mr-1"
                    />
                    <span className="text-sm">{rol}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Tutores académicos (solo mostrar si hay áreas seleccionadas) */}
            {estudianteData.areas_competencia?.length > 0 && estudianteData.areas_competencia[0]?.nombre_area && (
              <>
                <h4 className="font-medium text-blue-700 border-b pb-1 mt-6">
                  TUTOR ACADÉMICO PARA {estudianteData.areas_competencia[0].nombre_area}
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FaUser /> Apellido Paterno
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 w-full border rounded-md"
                      value={estudianteData.tutores_academicos?.[0]?.tutor?.apellido_pa || ''}
                      onChange={(e) => handleChange('tutor_academico_0', 'apellido_pa', e.target.value.toUpperCase())}
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FaUser /> Apellido Materno
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 w-full border rounded-md"
                      value={estudianteData.tutores_academicos?.[0]?.tutor?.apellido_ma || ''}
                      onChange={(e) => handleChange('tutor_academico_0', 'apellido_ma', e.target.value.toUpperCase())}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaUser /> Nombres
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 w-full border rounded-md"
                    value={estudianteData.tutores_academicos?.[0]?.tutor?.nombre || ''}
                    onChange={(e) => handleChange('tutor_academico_0', 'nombre', e.target.value.toUpperCase())}
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaIdCard /> Carnet de Identidad
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 w-full border rounded-md"
                    value={estudianteData.tutores_academicos?.[0]?.tutor?.ci || ''}
                    onChange={(e) => handleChange('tutor_academico_0', 'ci', e.target.value)}
                    maxLength="8"
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaEnvelope /> Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="mt-1 p-2 w-full border rounded-md"
                    value={estudianteData.tutores_academicos?.[0]?.tutor?.correo || ''}
                    onChange={(e) => handleChange('tutor_academico_0', 'correo', e.target.value)}
                  />
                </div>
              </>
            )}
            
            {/* Segundo tutor académico (solo si hay segunda área) */}
            {estudianteData.areas_competencia?.length > 1 && estudianteData.areas_competencia[1]?.nombre_area && (
              <>
                <h4 className="font-medium text-blue-700 border-b pb-1 mt-6">
                  TUTOR ACADÉMICO PARA {estudianteData.areas_competencia[1].nombre_area}
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FaUser /> Apellido Paterno
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 w-full border rounded-md"
                      value={estudianteData.tutores_academicos?.[1]?.tutor?.apellido_pa || ''}
                      onChange={(e) => handleChange('tutor_academico_1', 'apellido_pa', e.target.value.toUpperCase())}
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FaUser /> Apellido Materno
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 w-full border rounded-md"
                      value={estudianteData.tutores_academicos?.[1]?.tutor?.apellido_ma || ''}
                      onChange={(e) => handleChange('tutor_academico_1', 'apellido_ma', e.target.value.toUpperCase())}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaUser /> Nombres
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 w-full border rounded-md"
                    value={estudianteData.tutores_academicos?.[1]?.tutor?.nombre || ''}
                    onChange={(e) => handleChange('tutor_academico_1', 'nombre', e.target.value.toUpperCase())}
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaIdCard /> Carnet de Identidad
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 w-full border rounded-md"
                    value={estudianteData.tutores_academicos?.[1]?.tutor?.ci || ''}
                    onChange={(e) => handleChange('tutor_academico_1', 'ci', e.target.value)}
                    maxLength="8"
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaEnvelope /> Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="mt-1 p-2 w-full border rounded-md"
                    value={estudianteData.tutores_academicos?.[1]?.tutor?.correo || ''}
                    onChange={(e) => handleChange('tutor_academico_1', 'correo', e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex justify-end border-t pt-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-3"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarEstudianteModal;