import { useState, useEffect } from 'react';
import { listarReportes, listarTrabajadores, mapTipoToFrontend, mapUrgenciaToFrontend } from '../services/api';
import './AdminReportes.css';

function AdminReportes({ currentUser, navigateToDetalle }) {
  const [reportes, setReportes] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarReportes();
    cargarTrabajadores();
  }, []);

  const cargarReportes = async () => {
    try {
      setLoading(true);
      setError(null);
      // Cargar reportes resueltos (cerrados)
      const data = await listarReportes({ 
        estado: 'resuelto',
        orderBy: 'fecha',
        limit: 100
      });
      setReportes(data.reportes || []);
    } catch (err) {
      console.error('Error cargando reportes:', err);
      setError('Error al cargar historial: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarTrabajadores = async () => {
    try {
      const data = await listarTrabajadores();
      setTrabajadores(data.trabajadores || []);
    } catch (err) {
      console.error('Error cargando trabajadores:', err);
    }
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

  const getTrabajadorNombre = (trabajadorId) => {
    if (!trabajadorId) return 'Sin asignar';
    const trabajador = trabajadores.find(t => t.usuario_id === trabajadorId);
    if (trabajador) {
      return trabajador.email.split('@')[0]; // Parte antes del @
    }
    return trabajadorId.substring(0, 12); // Fallback: mostrar ID corto
  };

  const handleRowClick = (reporteId) => {
    if (navigateToDetalle) {
      navigateToDetalle(reporteId);
    }
  };

  if (loading) {
    return (
      <div className="admin-reportes-content">
        <div className="admin-reportes-card">
          <p className="loading-message">Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-reportes-content">
        <div className="admin-reportes-card">
          <p className="error-message">{error}</p>
          <button onClick={cargarReportes} className="retry-button">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-reportes-content">
      <div className="admin-reportes-card">
        <h2 className="admin-reportes-title">
          <span className="title-historial">HISTORIAL</span> DE REPORTES DE INCIDENTES
        </h2>

        <div className="reportes-table-container">
          <table className="reportes-table">
            <thead>
              <tr>
                <th>ID REPORTES</th>
                <th>TIPO DE INCIDENTE</th>
                <th>UBICACIÓN</th>
                <th>NIVEL DE URGENCIA</th>
                <th>TRABAJADOR</th>
                <th>ESTATUS</th>
              </tr>
            </thead>
            <tbody>
              {reportes.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    No hay reportes en el historial
                  </td>
                </tr>
              ) : (
                reportes.map((reporte) => (
                  <tr 
                    key={reporte.reporte_id} 
                    onClick={() => handleRowClick(reporte.reporte_id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="reporte-id-cell">{reporte.reporte_id.substring(0, 8)}...</td>
                    <td>{mapTipoToFrontend(reporte.tipo)}</td>
                    <td>{reporte.ubicacion}</td>
                    <td>
                      <span className={`urgencia-badge ${getUrgenciaClass(reporte.nivel_urgencia)}`}>
                        {mapUrgenciaToFrontend(reporte.nivel_urgencia)}
                      </span>
                    </td>
                    <td>
                      <span className="trabajador-info">{getTrabajadorNombre(reporte.trabajador_asignado)}</span>
                    </td>
                    <td>
                      <span className="estatus-badge estatus-cerrado">Reporte Cerrado</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminReportes;
