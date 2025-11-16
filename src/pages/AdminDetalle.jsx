import { useState, useEffect } from 'react';
import { obtenerReporteCompleto, mapTipoToFrontend, mapUrgenciaToFrontend } from '../services/api';
import './AdminDetalle.css';

const TRABAJADORES = [
  { id: 'trabajador-001', nombre: 'Trabajador 1' },
  { id: 'trabajador-002', nombre: 'Trabajador 2' },
  { id: 'trabajador-003', nombre: 'Trabajador 3' }
];

function AdminDetalle({ currentUser, reporteId }) {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (reporteId) {
      cargarReporte();
    } else {
      setError('No se ha seleccionado ningún reporte');
      setLoading(false);
    }
  }, [reporteId]);

  const cargarReporte = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerReporteCompleto(reporteId);
      setReporte(data);
    } catch (err) {
      console.error('Error cargando reporte:', err);
      setError('Error al cargar el detalle del reporte: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fechaISO) => {
    if (!fechaISO) return 'N/A';
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = String(fecha.getFullYear()).slice(-2);
    return `${dia}-${mes}-${anio}`;
  };

  const getTrabajadorNombre = (trabajadorId) => {
    if (!trabajadorId) return 'Sin asignar';
    const trabajador = TRABAJADORES.find(t => t.id === trabajadorId);
    return trabajador ? trabajador.nombre : trabajadorId;
  };

  const getUrgenciaClass = (urgencia) => {
    const map = {
      'critica': 'urgencia-critica',
      'alta': 'urgencia-alta',
      'media': 'urgencia-media',
      'baja': 'urgencia-baja'
    };
    return map[urgencia] || 'urgencia-media';
  };

  if (loading) {
    return (
      <div className="admin-detalle-content">
        <div className="admin-detalle-card">
          <p className="loading-message">Cargando detalle del reporte...</p>
        </div>
      </div>
    );
  }

  if (error || !reporte) {
    return (
      <div className="admin-detalle-content">
        <div className="admin-detalle-card">
          <p className="error-message">{error || 'No se encontró el reporte'}</p>
          <button onClick={cargarReporte} className="retry-button">Reintentar</button>
        </div>
      </div>
    );
  }

  const reporteData = reporte.reporte || {};

  return (
    <div className="admin-detalle-content">
      <div className="admin-detalle-card">
        <h2 className="admin-detalle-title">
          <span className="title-detalle">DETALLE</span> POR INCIDENTE
        </h2>

        <div className="detalle-header">
          <div className="detalle-id-badge">{reporteData.reporte_id?.substring(0, 8)}...</div>
          <div className="detalle-nombre-incidente">
            {reporteData.descripcion || 'Sin descripción'}
          </div>
        </div>

        <div className="detalle-info-table">
          <div className="info-row">
            <div className="info-cell label-cell">
              <span className="info-label">Administrador:</span>
            </div>
            <div className="info-cell value-cell">
              <span className="info-value">Nombre del administrador</span>
            </div>
            <div className="info-cell label-cell">
              <span className="info-label">Fecha:</span>
            </div>
            <div className="info-cell value-cell">
              <span className="info-value">{formatFecha(reporteData.fecha_creacion)}</span>
            </div>
          </div>

          <div className="info-row">
            <div className="info-cell label-cell">
              <span className="info-label">Trabajador asignado:</span>
            </div>
            <div className="info-cell value-cell" colSpan="3">
              <span className="info-value">{getTrabajadorNombre(reporteData.trabajador_asignado)}</span>
            </div>
          </div>

          <div className="info-row">
            <div className="info-cell label-cell">
              <span className="info-label">Nivel de urgencia:</span>
            </div>
            <div className="info-cell value-cell" colSpan="3">
              <span className={`urgencia-badge ${getUrgenciaClass(reporteData.nivel_urgencia)}`}>
                {mapUrgenciaToFrontend(reporteData.nivel_urgencia)}
              </span>
            </div>
          </div>

          <div className="info-row">
            <div className="info-cell label-cell">
              <span className="info-label">Tipo de Incidente:</span>
            </div>
            <div className="info-cell value-cell" colSpan="3">
              <span className="info-value">{mapTipoToFrontend(reporteData.tipo)}</span>
            </div>
          </div>

          <div className="info-row">
            <div className="info-cell label-cell">
              <span className="info-label">Alumno que reportó:</span>
            </div>
            <div className="info-cell value-cell" colSpan="3">
              <span className="info-value">Nombre y Apellidos del Estudiante</span>
            </div>
          </div>

          <div className="info-row">
            <div className="info-cell label-cell">
              <span className="info-label">Ubicación:</span>
            </div>
            <div className="info-cell value-cell" colSpan="3">
              <span className="info-value">{reporteData.ubicacion || 'No especificada'}</span>
            </div>
          </div>

          {reporteData.descripcion && (
            <div className="info-row">
              <div className="info-cell label-cell">
                <span className="info-label">Descripción:</span>
              </div>
              <div className="info-cell value-cell" colSpan="3">
                <span className="info-value">{reporteData.descripcion}</span>
              </div>
            </div>
          )}
        </div>

        {reporte.historial_reciente && reporte.historial_reciente.length > 0 && (
          <div className="detalle-historial-section">
            <h3 className="historial-subtitle">Historial de Acciones</h3>
            <div className="historial-list">
              {reporte.historial_reciente.map((accion, index) => (
                <div key={index} className="historial-item">
                  <span className="historial-fecha">{formatFecha(accion.timestamp_accion)}</span>
                  <span className="historial-accion">{accion.accion}</span>
                  <span className="historial-notas">{accion.notas || ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDetalle;
