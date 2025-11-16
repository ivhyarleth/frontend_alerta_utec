import { useState, useEffect } from 'react';
import { listarReportes, mapTipoToFrontend } from '../services/api';
import './TrabajadorMisReportes.css';

function TrabajadorMisReportes({ currentUser }) {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarReportes();
  }, [currentUser.trabajadorId]);

  const cargarReportes = async () => {
    try {
      setLoading(true);
      setError(null);
      // Cargar reportes del trabajador (todos los estados)
      const data = await listarReportes({ 
        orderBy: 'fecha',
        limit: 100
      });
      // Filtrar reportes del trabajador
      const misReportes = (data.reportes || []).filter(
        r => r.trabajador_asignado === currentUser.trabajadorId
      );
      setReportes(misReportes);
    } catch (err) {
      console.error('Error cargando reportes:', err);
      setError('Error al cargar historial: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoInfo = (reporte) => {
    // Determinar el estado y color para mostrar
    if (reporte.estado === 'resuelto') {
      return { texto: 'Reporte Cerrado', color: 'azul' };
    }
    if (reporte.estado_trabajo === 'terminado') {
      return { texto: 'Trabajo Terminado', color: 'verde' };
    }
    if (reporte.estado_trabajo === 'llego') {
      return { texto: 'Trabajador llegó', color: 'naranja' };
    }
    if (reporte.estado_trabajo === 'en_camino') {
      return { texto: 'En camino', color: 'cyan' };
    }
    if (reporte.estado === 'en_atencion') {
      return { texto: 'En atención', color: 'amarillo' };
    }
    return { texto: 'Pendiente', color: 'gris' };
  };

  if (loading) {
    return (
      <div className="trabajador-mis-reportes-content">
        <div className="trabajador-mis-reportes-card">
          <p className="loading-message">Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trabajador-mis-reportes-content">
        <div className="trabajador-mis-reportes-card">
          <p className="error-message">{error}</p>
          <button onClick={cargarReportes} className="retry-button">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="trabajador-mis-reportes-content">
      <div className="trabajador-mis-reportes-card">
        <h2 className="trabajador-mis-reportes-title">
          <span className="title-historial">HISTORIAL</span> DE INCIDENTES
        </h2>

        <div className="trabajador-reportes-list">
          {reportes.length === 0 ? (
            <div className="no-reportes-message">
              <p>No tienes incidentes en tu historial</p>
            </div>
          ) : (
            reportes.map((reporte) => {
              const estadoInfo = getEstadoInfo(reporte);
              return (
                <div key={reporte.reporte_id} className="trabajador-reporte-item">
                  <div className={`trabajador-estado-badge estado-${estadoInfo.color}`}>
                    {estadoInfo.texto}
                  </div>
                  <div className={`trabajador-reporte-id id-${estadoInfo.color}`}>
                    {reporte.reporte_id.substring(0, 8)}...
                  </div>
                  <div className="trabajador-reporte-details">
                    <div className="trabajador-info">
                      <span className="info-label">{mapTipoToFrontend(reporte.tipo)}</span>
                    </div>
                    <div className="trabajador-info">
                      <span className="info-value">{reporte.descripcion || 'Sin descripción'}</span>
                    </div>
                    <div className="trabajador-info">
                      <span className="info-label">{reporte.ubicacion}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default TrabajadorMisReportes;
