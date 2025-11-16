import './TrabajadorAsignaciones.css';

function TrabajadorAsignaciones() {
  const reportes = [
    {
      id: 'ID-REPORTE',
      tipo: 'Tipo de incidente',
      nombre: 'Nombre del Incidente',
      ubicacion: 'Ubicación del incidente',
      estados: ['en-camino', 'trabajador-llego', 'trabajo-terminado', 'reporte-cerrado']
    },
    {
      id: 'ID-REPORTE',
      tipo: 'Tipo de incidente',
      nombre: 'Nombre del Incidente',
      ubicacion: 'Ubicación del incidente',
      estados: ['en-camino', 'trabajador-llego', 'trabajo-terminado', 'reporte-cerrado']
    }
  ];

  return (
    <div className="trabajador-asignaciones-content">
      <div className="trabajador-asignaciones-card">
        <h2 className="trabajador-asignaciones-title">
          <span className="title-reportes">REPORTES</span> ASIGNADOS
        </h2>

        <div className="asignaciones-list">
          {reportes.map((reporte, index) => (
            <div key={index} className="asignacion-item">
              <div className="asignacion-header">
                <div className="asignacion-id">{reporte.id}</div>
                <div className="asignacion-info">
                  <div className="info-row">
                    <span className="info-label">{reporte.tipo}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-value">{reporte.nombre}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">{reporte.ubicacion}</span>
                  </div>
                </div>
              </div>
              <div className="asignacion-estados">
                <button className="estado-btn estado-cyan">En camino</button>
                <button className="estado-btn estado-naranja">Trabajador llegó</button>
                <button className="estado-btn estado-verde">Trabajo Terminado</button>
                <button className="estado-btn estado-azul">Reporte Cerrado</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrabajadorAsignaciones;
