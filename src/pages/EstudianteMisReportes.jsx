import { useState, useEffect } from 'react';
import { listarReportes, mapUrgenciaToFrontend, mapTipoToFrontend } from '../services/api';
import './EstudianteMisReportes.css';

function EstudianteMisReportes() {
  const [reportes, setReportes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Filtrar por usuario_id en producción
      const resultado = await listarReportes({
        // usuario_id: 'estudiante-actual', // Descomentar en producción
        limit: 50
      });
      
      setReportes(resultado.reportes || []);
    } catch (err) {
      console.error('Error al cargar reportes:', err);
      setError('Error al cargar los reportes');
      
      // Datos de ejemplo si falla la API
      setReportes([
        { 
          reporte_id: 'EJEMPLO-001', 
          tipo: 'limpieza', 
          descripcion: 'Nombre del Incidente de ejemplo',
          ubicacion: 'Ubicación del incidente',
          nivel_urgencia: 'alta'
        },
        { 
          reporte_id: 'EJEMPLO-002', 
          tipo: 'seguridad', 
          descripcion: 'Nombre del Incidente de ejemplo',
          ubicacion: 'Ubicación del incidente',
          nivel_urgencia: 'media'
        },
        { 
          reporte_id: 'EJEMPLO-003', 
          tipo: 'mantenimiento', 
          descripcion: 'Nombre del Incidente de ejemplo',
          ubicacion: 'Ubicación del incidente',
          nivel_urgencia: 'baja'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getColorPorUrgencia = (urgencia) => {
    const colores = {
      'baja': 'verde',
      'media': 'amarillo',
      'alta': 'rojo',
      'critica': 'morado'
    };
    return colores[urgencia] || 'verde';
  };

  if (isLoading) {
    return (
      <div className="estudiante-mis-reportes-content">
        <div className="estudiante-mis-reportes-card">
          <div className="loading">Cargando reportes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="estudiante-mis-reportes-content">
      <div className="estudiante-mis-reportes-card">
        <h2 className="estudiante-mis-reportes-title">
          <span className="title-historial">HISTORIAL</span> REPORTES
        </h2>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={cargarReportes} className="retry-button">
              Reintentar
            </button>
          </div>
        )}

        {reportes.length === 0 ? (
          <div className="no-reportes">
            No tienes reportes aún. ¡Crea tu primer reporte!
          </div>
        ) : (
          <div className="reportes-list">
            {reportes.map((reporte, index) => (
              <div key={reporte.reporte_id || index} className="reporte-item">
                <div className={`reporte-id ${getColorPorUrgencia(reporte.nivel_urgencia)}`}>
                  {reporte.reporte_id || 'ID-REPORTE'}
                </div>
                <div className="reporte-details">
                  <div className="reporte-info">
                    <span className="info-label">
                      {mapTipoToFrontend(reporte.tipo)}
                    </span>
                  </div>
                  <div className="reporte-info">
                    <span className="info-value">
                      {reporte.descripcion?.substring(0, 50) || 'Nombre del Incidente'}
                    </span>
                  </div>
                  <div className="reporte-info">
                    <span className="info-label">
                      {reporte.ubicacion || 'Ubicación del incidente'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EstudianteMisReportes;
