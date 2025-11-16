import { useState, useEffect } from 'react';
import { listarReportes, WebSocketManager } from '../services/api';
import './EstudianteSeguimiento.css';

function EstudianteSeguimiento() {
  const [reportes, setReportes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsManager, setWsManager] = useState(null);

  useEffect(() => {
    cargarReportes();
    conectarWebSocket();

    return () => {
      if (wsManager) {
        wsManager.disconnect();
      }
    };
  }, []);

  const cargarReportes = async () => {
    setIsLoading(true);
    
    try {
      const resultado = await listarReportes({
        // usuario_id: 'estudiante-actual', // Descomentar en producción
        estado: 'en_atencion', // Solo reportes en atención
        limit: 50
      });
      
      setReportes(resultado.reportes || []);
    } catch (err) {
      console.error('Error al cargar reportes:', err);
      // Datos de ejemplo
      setReportes([
        { 
          reporte_id: 'REP-001', 
          tipo: 'limpieza', 
          descripcion: 'Nombre del Incidente',
          ubicacion: 'Ubicación del incidente',
          estado: 'en_camino'
        },
        { 
          reporte_id: 'REP-002', 
          tipo: 'seguridad', 
          descripcion: 'Nombre del Incidente',
          ubicacion: 'Ubicación del incidente',
          estado: 'trabajador_llego'
        },
        { 
          reporte_id: 'REP-003', 
          tipo: 'mantenimiento', 
          descripcion: 'Nombre del Incidente',
          ubicacion: 'Ubicación del incidente',
          estado: 'trabajo_terminado'
        },
        { 
          reporte_id: 'REP-004', 
          tipo: 'tecnologia', 
          descripcion: 'Nombre del Incidente',
          ubicacion: 'Ubicación del incidente',
          estado: 'cerrado'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const conectarWebSocket = () => {
    const ws = new WebSocketManager(null, 'estudiante-001');
    
    ws.onConnect = () => {
      console.log('WebSocket conectado');
      setWsConnected(true);
    };
    
    ws.onDisconnect = () => {
      console.log('WebSocket desconectado');
      setWsConnected(false);
    };
    
    ws.onEstadoUpdate = (data) => {
      console.log('Actualización de estado recibida:', data);
      // Actualizar el reporte en la lista
      setReportes(prev => prev.map(r => 
        r.reporte_id === data.reporte_id 
          ? { ...r, estado: data.estado }
          : r
      ));
    };
    
    ws.connect();
    setWsManager(ws);
  };

  const getEstadoInfo = (estado) => {
    const estados = {
      'en_camino': { texto: 'En camino', clase: 'cyan' },
      'trabajador_llego': { texto: 'Trabajador llegó', clase: 'naranja' },
      'trabajo_terminado': { texto: 'Trabajo Terminado', clase: 'verde' },
      'cerrado': { texto: 'Reporte Cerrado', clase: 'azul' }
    };
    return estados[estado] || { texto: 'En proceso', clase: 'cyan' };
  };

  if (isLoading) {
    return (
      <div className="estudiante-seguimiento-content">
        <div className="estudiante-seguimiento-card">
          <div className="loading">Cargando seguimiento...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="estudiante-seguimiento-content">
      <div className="estudiante-seguimiento-card">
        <div className="header-with-status">
          <h2 className="estudiante-seguimiento-title">
            <span className="title-seguimiento">SEGUIMIENTO</span> DE REPORTES
          </h2>
          <div className={`ws-status ${wsConnected ? 'connected' : 'disconnected'}`}>
            {wsConnected ? '🟢 Tiempo real activo' : '🔴 Desconectado'}
          </div>
        </div>

        {reportes.length === 0 ? (
          <div className="no-reportes">
            No hay reportes en seguimiento
          </div>
        ) : (
          <div className="seguimiento-list">
            {reportes.map((reporte, index) => {
              const estadoInfo = getEstadoInfo(reporte.estado);
              return (
                <div key={reporte.reporte_id || index} className="seguimiento-item">
                  <div className={`estado-badge estado-${estadoInfo.clase}`}>
                    {estadoInfo.texto}
                  </div>
                  <div className="seguimiento-details">
                    <div className="seguimiento-id">{reporte.reporte_id}</div>
                    <div className="seguimiento-info-group">
                      <div className="seguimiento-info">
                        <span className="info-label">{reporte.tipo}</span>
                      </div>
                      <div className="seguimiento-info">
                        <span className="info-value">{reporte.descripcion}</span>
                      </div>
                      <div className="seguimiento-info">
                        <span className="info-label">{reporte.ubicacion}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default EstudianteSeguimiento;
