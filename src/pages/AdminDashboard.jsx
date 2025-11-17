import { useState, useEffect } from 'react';
import { listarReportes, listarTrabajadores, asignarReporte, WebSocketManager, mapTipoToFrontend, mapUrgenciaToFrontend } from '../services/api';
import './AdminDashboard.css';

function AdminDashboard({ currentUser, navigateToDetalle }) {
  const [reportes, setReportes] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [asignando, setAsignando] = useState({});
  const [wsManager, setWsManager] = useState(null);

  useEffect(() => {
    cargarReportes();
    cargarTrabajadores();
    
    // Conectar WebSocket para actualizaciones en tiempo real
    const ws = new WebSocketManager(null, currentUser.userId);
    ws.onEstadoUpdate = (data) => {
      console.log('Actualización de estado recibida:', data);
      // Recargar reportes cuando hay actualización
      cargarReportes();
    };
    ws.onConnect = () => {
      console.log('WebSocket conectado en AdminDashboard');
    };
    ws.connect();
    setWsManager(ws);

    return () => {
      if (ws) {
        ws.disconnect();
      }
    };
  }, [currentUser.userId]);

  const cargarReportes = async () => {
    try {
      setLoading(true);
      setError(null);
      // Cargar reportes pendientes y en atención, ordenados por urgencia
      const data = await listarReportes({ 
        orderBy: 'urgencia',
        limit: 50
      });
      setReportes(data.reportes || []);
    } catch (err) {
      console.error('Error cargando reportes:', err);
      setError('Error al cargar reportes: ' + err.message);
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
      // No mostramos error crítico, solo log
      // El admin puede seguir viendo reportes aunque falle la carga de trabajadores
    }
  };

  const handleAsignarTrabajador = async (reporteId, trabajadorId, fechaCreacion) => {
    if (!trabajadorId || trabajadorId === 'sin-asignar') {
      return;
    }

    try {
      setAsignando({ ...asignando, [reporteId]: true });
      await asignarReporte(reporteId, trabajadorId, currentUser.userId, currentUser.role);
      // Recargar reportes después de asignar
      await cargarReportes();
      alert('Trabajador asignado exitosamente');
    } catch (err) {
      console.error('Error asignando trabajador:', err);
      alert('Error al asignar trabajador: ' + err.message);
    } finally {
      setAsignando({ ...asignando, [reporteId]: false });
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

  const getEstatusClass = (estado) => {
    const map = {
      'pendiente': 'estatus-pendiente',
      'en_atencion': 'estatus-en-atencion',
      'en_camino': 'estatus-en-camino',
      'trabajador_llego': 'estatus-trabajador-llego',
      'trabajo_terminado': 'estatus-terminado',
      'resuelto': 'estatus-cerrado'
    };
    return map[estado] || 'estatus-pendiente';
  };

  const getEstatusTexto = (estado, estadoTrabajo) => {
    // Si hay estado de trabajo, usar ese
    if (estadoTrabajo) {
      const map = {
        'en_camino': 'En camino',
        'llego': 'Trabajador llegó',
        'terminado': 'Trabajo Terminado'
      };
      return map[estadoTrabajo] || 'En atención';
    }
    
    // Si no, usar estado general
    const map = {
      'pendiente': 'Pendiente',
      'en_atencion': 'En atención',
      'resuelto': 'Reporte Cerrado'
    };
    return map[estado] || 'Pendiente';
  };

  const getTrabajadorNombre = (trabajadorId) => {
    if (!trabajadorId) return 'Sin asignar';
    const trabajador = trabajadores.find(t => t.usuario_id === trabajadorId);
    if (trabajador) {
      // Mostrar email o usuario_id corto
      return trabajador.email.split('@')[0]; // Parte antes del @
    }
    return trabajadorId.substring(0, 12); // Fallback: mostrar ID corto
  };

  if (loading) {
    return (
      <div className="admin-dashboard-content">
        <div className="admin-dashboard-card">
          <p className="loading-message">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-content">
        <div className="admin-dashboard-card">
          <p className="error-message">{error}</p>
          <button onClick={cargarReportes} className="retry-button">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-content">
      <div className="admin-dashboard-card">
        <h2 className="admin-dashboard-title">
          <span className="title-dashboard">DASHBOARD</span> DE REPORTES DE INCIDENTES
        </h2>

        <div className="dashboard-table-container">
          <table className="dashboard-table">
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
                    No hay reportes para mostrar
                  </td>
                </tr>
              ) : (
                reportes.map((reporte) => (
                  <tr key={reporte.reporte_id} onClick={() => navigateToDetalle && navigateToDetalle(reporte.reporte_id)} style={{ cursor: 'pointer' }}>
                    <td className="reporte-id-cell">{reporte.reporte_id.substring(0, 8)}...</td>
                    <td>{mapTipoToFrontend(reporte.tipo)}</td>
                    <td>{reporte.ubicacion}</td>
                    <td>
                      <span className={`urgencia-badge ${getUrgenciaClass(reporte.nivel_urgencia)}`}>
                        {mapUrgenciaToFrontend(reporte.nivel_urgencia)}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {reporte.trabajador_asignado ? (
                        <span className="trabajador-asignado">
                          {getTrabajadorNombre(reporte.trabajador_asignado)}
                        </span>
                      ) : (
                        <select
                          className="trabajador-select"
                          defaultValue="sin-asignar"
                          onChange={(e) => handleAsignarTrabajador(reporte.reporte_id, e.target.value, reporte.fecha_creacion)}
                          disabled={asignando[reporte.reporte_id] || trabajadores.length === 0}
                        >
                          <option value="sin-asignar">
                            {trabajadores.length === 0 ? 'Cargando...' : 'Sin asignar ▼'}
                          </option>
                          {trabajadores.map(trabajador => (
                            <option key={trabajador.usuario_id} value={trabajador.usuario_id}>
                              {trabajador.email}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td>
                      <span className={`estatus-badge ${getEstatusClass(reporte.estado)}`}>
                        {getEstatusTexto(reporte.estado, reporte.estado_trabajo)}
                      </span>
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

export default AdminDashboard;
