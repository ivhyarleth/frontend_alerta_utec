import './TrabajadorMisReportes.css';

function TrabajadorMisReportes() {
  const reportes = [
    { id: 'ID-REPORTE', tipo: 'Tipo de incidente', nombre: 'Nombre del Incidente', ubicacion: 'Ubicación del incidente', estado: 'trabajador-llego', estadoTexto: 'Trabajador llegó', color: 'naranja' },
    { id: 'ID-REPORTE', tipo: 'Tipo de incidente', nombre: 'Nombre del Incidente', ubicacion: 'Ubicación del incidente', estado: 'trabajo-terminado', estadoTexto: 'Trabajo Terminado', color: 'verde' },
    { id: 'ID-REPORTE', tipo: 'Tipo de incidente', nombre: 'Nombre del Incidente', ubicacion: 'Ubicación del incidente', estado: 'reporte-cerrado', estadoTexto: 'Reporte Cerrado', color: 'azul' },
    { id: 'ID-REPORTE', tipo: 'Tipo de incidente', nombre: 'Nombre del Incidente', ubicacion: 'Ubicación del incidente', estado: 'reporte-cerrado', estadoTexto: 'Reporte Cerrado', color: 'azul' },
    { id: 'ID-REPORTE', tipo: 'Tipo de incidente', nombre: 'Nombre del Incidente', ubicacion: 'Ubicación del incidente', estado: 'trabajo-terminado', estadoTexto: 'Trabajo Terminado', color: 'verde' }
  ];

  return (
    <div className="trabajador-mis-reportes-content">
      <div className="trabajador-mis-reportes-card">
        <h2 className="trabajador-mis-reportes-title">
          <span className="title-mis">MIS</span> REPORTES
        </h2>

        <div className="trabajador-reportes-list">
          {reportes.map((reporte, index) => (
            <div key={index} className="trabajador-reporte-item">
              <div className={`trabajador-estado-badge estado-${reporte.color}`}>
                {reporte.estadoTexto}
              </div>
              <div className={`trabajador-reporte-id id-${reporte.color}`}>{reporte.id}</div>
              <div className="trabajador-reporte-details">
                <div className="trabajador-info">
                  <span className="info-label">{reporte.tipo}</span>
                </div>
                <div className="trabajador-info">
                  <span className="info-value">{reporte.nombre}</span>
                </div>
                <div className="trabajador-info">
                  <span className="info-label">{reporte.ubicacion}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrabajadorMisReportes;
