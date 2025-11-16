import { useState, useEffect } from 'react';
import { listarReportes, WebSocketManager, mapTipoToFrontend } from '../services/api';
import './TrabajadorAsignaciones.css';

function TrabajadorAsignaciones({ currentUser }) {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wsManager, setWsManager] = useState(null);
  const [actualizando, setActualizando] = useState({});
  const [taskTokens, setTaskTokens] = useState({});

  useEffect(() => {
    cargarReportes();
    
    // Conectar WebSocket para actualizaciones en tiempo real
    const ws = new WebSocketManager(null, currentUser.trabajadorId);
    ws.onEstadoUpdate = (data) => {
      console.log('Actualización de estado recibida:', data);
      // Recargar reportes cuando hay actualización
      cargarReportes();
    };
    ws.onConnect = () => {
      console.log('WebSocket conectado en TrabajadorAsignaciones');
    };
    ws.connect();
    setWsManager(ws);

    return () => {
      if (ws) {
        ws.disconnect();
      }
    };
  }, [currentUser.trabajadorId]);

  const cargarReportes = async () => {
    try {
      setLoading(true);
      setError(null);
      // Cargar reportes asignados al trabajador que no estén resueltos
      const data = await listarReportes({ 
        limit: 50
      });
      // Filtrar reportes asignados a este trabajador
      const reportesAsignados = (data.reportes || []).filter(
        r => r.trabajador_asignado === currentUser.trabajadorId && r.estado !== 'resuelto'
      );
      setReportes(reportesAsignados);
    } catch (err) {
      console.error('Error cargando reportes:', err);
      setError('Error al cargar asignaciones: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnCamino = async (reporte) => {
    if (!wsManager) {
      alert('WebSocket no conectado');
      return;
    }

    try {
      setActualizando({ ...actualizando, [reporte.reporte_id]: 'en_camino' });
      
      // Simular obtención de ubicación (en producción usar navigator.geolocation)
      const ubicacion = {
        latitud: -12.0464,
        longitud: -77.0428
      };

      // El task_token debería venir del reporte cuando se asignó
      // Por ahora lo simulamos
      const taskToken = taskTokens[reporte.reporte_id] || 'task-token-' + reporte.reporte_id;
      
      wsManager.enviarEnCamino(
        reporte.reporte_id,
        currentUser.trabajadorId,
        taskToken,
        ubicacion
      );

      // Esperar un momento y recargar
      setTimeout(() => {
        cargarReportes();
        setActualizando({ ...actualizando, [reporte.reporte_id]: null });
      }, 1000);
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert('Error al actualizar estado: ' + err.message);
      setActualizando({ ...actualizando, [reporte.reporte_id]: null });
    }
  };

  const handleTrabajadorLlego = async (reporte) => {
    if (!wsManager) {
      alert('WebSocket no conectado');
      return;
    }

    try {
      setActualizando({ ...actualizando, [reporte.reporte_id]: 'llego' });
      
      const taskToken = taskTokens[reporte.reporte_id] || 'task-token-' + reporte.reporte_id;
      
      wsManager.enviarTrabajadorLlego(
        reporte.reporte_id,
        currentUser.trabajadorId,
        taskToken
      );

      setTimeout(() => {
        cargarReportes();
        setActualizando({ ...actualizando, [reporte.reporte_id]: null });
      }, 1000);
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert('Error al actualizar estado: ' + err.message);
      setActualizando({ ...actualizando, [reporte.reporte_id]: null });
    }
  };

  const handleTrabajoTerminado = async (reporte) => {
    if (!wsManager) {
      alert('WebSocket no conectado');
      return;
    }

    const comentarios = prompt('Ingrese comentarios sobre el trabajo realizado (opcional):');
    if (comentarios === null) return; // Usuario canceló

    try {
      setActualizando({ ...actualizando, [reporte.reporte_id]: 'terminado' });
      
      const taskToken = taskTokens[reporte.reporte_id] || 'task-token-' + reporte.reporte_id;
      
      wsManager.enviarTrabajoTerminado(
        reporte.reporte_id,
        currentUser.trabajadorId,
        taskToken,
        comentarios,
        []
      );

      setTimeout(() => {
        cargarReportes();
        setActualizando({ ...actualizando, [reporte.reporte_id]: null });
      }, 1000);
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert('Error al actualizar estado: ' + err.message);
      setActualizando({ ...actualizando, [reporte.reporte_id]: null });
    }
  };

  const getEstadoActual = (reporte) => {
    // Determinar el estado actual del reporte
    if (reporte.estado === 'resuelto') return 'cerrado';
    if (reporte.estado_trabajo === 'terminado') return 'terminado';
    if (reporte.estado_trabajo === 'llego') return 'llego';
    if (reporte.estado_trabajo === 'en_camino') return 'en_camino';
    if (reporte.estado === 'en_atencion') return 'asignado';
    return 'pendiente';
  };

  const isEstadoCompletado = (reporte, estado) => {
    const estadoActual = getEstadoActual(reporte);
    const orden = ['pendiente', 'asignado', 'en_camino', 'llego', 'terminado', 'cerrado'];
    const indexActual = orden.indexOf(estadoActual);
    const indexEstado = orden.indexOf(estado);
    return indexActual >= indexEstado;
  };

  const isEstadoActivo = (reporte, estado) => {
    return getEstadoActual(reporte) === estado;
  };

  if (loading) {
    return (
      <div className="trabajador-asignaciones-content">
        <div className="trabajador-asignaciones-card">
          <p className="loading-message">Cargando asignaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trabajador-asignaciones-content">
        <div className="trabajador-asignaciones-card">
          <p className="error-message">{error}</p>
          <button onClick={cargarReportes} className="retry-button">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="trabajador-asignaciones-content">
      <div className="trabajador-asignaciones-card">
        <h2 className="trabajador-asignaciones-title">
          <span className="title-incidentes">INCIDENTES</span> ASIGNADOS
        </h2>

        <div className="asignaciones-list">
          {reportes.length === 0 ? (
            <div className="no-reportes-message">
              <p>No tienes incidentes asignados en este momento</p>
            </div>
          ) : (
            reportes.map((reporte) => (
              <div key={reporte.reporte_id} className="asignacion-item">
                <div className="asignacion-header">
                  <div className="asignacion-id">{reporte.reporte_id.substring(0, 8)}...</div>
                  <div className="asignacion-info">
                    <div className="info-row">
                      <span className="info-label">{mapTipoToFrontend(reporte.tipo)}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-value">{reporte.descripcion || 'Sin descripción'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">{reporte.ubicacion}</span>
                    </div>
                  </div>
                </div>
                <div className="asignacion-estados">
                  <button 
                    className={`estado-btn estado-cyan ${isEstadoActivo(reporte, 'en_camino') ? 'activo' : ''} ${isEstadoCompletado(reporte, 'en_camino') ? 'completado' : ''}`}
                    onClick={() => handleEnCamino(reporte)}
                    disabled={isEstadoCompletado(reporte, 'en_camino') || actualizando[reporte.reporte_id]}
                  >
                    {actualizando[reporte.reporte_id] === 'en_camino' ? 'Actualizando...' : 'En camino'}
                  </button>
                  <button 
                    className={`estado-btn estado-naranja ${isEstadoActivo(reporte, 'llego') ? 'activo' : ''} ${isEstadoCompletado(reporte, 'llego') ? 'completado' : ''}`}
                    onClick={() => handleTrabajadorLlego(reporte)}
                    disabled={!isEstadoCompletado(reporte, 'en_camino') || isEstadoCompletado(reporte, 'llego') || actualizando[reporte.reporte_id]}
                  >
                    {actualizando[reporte.reporte_id] === 'llego' ? 'Actualizando...' : 'Trabajador llegó'}
                  </button>
                  <button 
                    className={`estado-btn estado-verde ${isEstadoActivo(reporte, 'terminado') ? 'activo' : ''} ${isEstadoCompletado(reporte, 'terminado') ? 'completado' : ''}`}
                    onClick={() => handleTrabajoTerminado(reporte)}
                    disabled={!isEstadoCompletado(reporte, 'llego') || isEstadoCompletado(reporte, 'terminado') || actualizando[reporte.reporte_id]}
                  >
                    {actualizando[reporte.reporte_id] === 'terminado' ? 'Actualizando...' : 'Trabajo Terminado'}
                  </button>
                  <button 
                    className={`estado-btn estado-azul ${isEstadoCompletado(reporte, 'cerrado') ? 'completado' : ''}`}
                    disabled={true}
                  >
                    Reporte Cerrado
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TrabajadorAsignaciones;
