import './AdminDetalle.css';

function AdminDetalle() {
  return (
    <div className="admin-detalle-content">
      <div className="admin-detalle-card">
        <h2 className="admin-detalle-title">
          <span className="title-reporte">REPORTE</span> DETALLE
        </h2>

        <div className="detalle-header">
          <div className="detalle-id">ID-REPORTE</div>
          <div className="detalle-nombre">Nombre del Incidente</div>
        </div>

        <div className="detalle-grid">
          <div className="detalle-row">
            <div className="detalle-field">
              <span className="field-label">CResponsable:</span>
              <span className="field-value">Nombre del admin</span>
            </div>
            <div className="detalle-field">
              <span className="field-label">Ciclo:</span>
              <span className="field-value">Según el curso</span>
            </div>
            <div className="detalle-field">
              <span className="field-label">Semestre:</span>
              <span className="field-value">semestre actual</span>
            </div>
          </div>

          <div className="detalle-row">
            <div className="detalle-field">
              <span className="field-label">Actividad:</span>
              <span className="field-value">Completar con nombre de la actividad</span>
            </div>
            <div className="detalle-field">
              <span className="field-label">Semana:</span>
              <span className="field-value">SX</span>
            </div>
            <div className="detalle-field">
              <span className="field-label">Fecha:</span>
              <span className="field-value">DD-MM-AA</span>
            </div>
          </div>

          <div className="detalle-row">
            <div className="detalle-field full-width">
              <span className="field-label">Competencia:</span>
              <span className="field-value">Buscar entre las 3 o 4 competencias ▶</span>
            </div>
            <div className="detalle-field">
              <span className="field-value">Seleccionar uno de sus criterios de desempeño ▶</span>
            </div>
          </div>

          <div className="detalle-row">
            <div className="detalle-field">
              <span className="field-label">Alumno:</span>
              <span className="field-value">-------- ▶</span>
            </div>
            <div className="detalle-field">
              <span className="field-label">Profesor:</span>
              <span className="field-value">Nombre del profesor</span>
            </div>
          </div>

          <div className="detalle-row">
            <div className="detalle-field full-width">
              <span className="field-label">Tipo de Incidente:</span>
              <span className="field-value">Nombre del incidnete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDetalle;
