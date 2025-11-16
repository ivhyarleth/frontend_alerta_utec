import { useState } from 'react';
import { crearReporte, mapUrgenciaToBackend, mapTipoIncidente } from '../services/api';
import './EstudianteNuevoReporte.css';

function EstudianteNuevoReporte() {
  const [tipoIncidente, setTipoIncidente] = useState('');
  const [nombreIncidente, setNombreIncidente] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [urgencia, setUrgencia] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!urgencia) {
      setMensaje({ tipo: 'error', texto: 'Por favor selecciona un nivel de urgencia' });
      return;
    }

    setIsSubmitting(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      const data = {
        tipo: mapTipoIncidente(tipoIncidente),
        ubicacion: ubicacion,
        descripcion: `${nombreIncidente}. ${descripcion}`,
        nivel_urgencia: mapUrgenciaToBackend(urgencia),
        rol: 'estudiante',
        usuario_id: 'estudiante-' + Date.now() // Temporal - reemplazar con ID real del usuario
      };

      const resultado = await crearReporte(data);
      
      setMensaje({ 
        tipo: 'success', 
        texto: `¡Reporte creado exitosamente! ID: ${resultado.reporte_id}` 
      });

      // Limpiar formulario
      setTipoIncidente('');
      setNombreIncidente('');
      setUbicacion('');
      setDescripcion('');
      setUrgencia('');

    } catch (error) {
      console.error('Error al crear reporte:', error);
      setMensaje({ 
        tipo: 'error', 
        texto: 'Error al crear el reporte: ' + error.message 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="estudiante-reporte-content">
      <div className="estudiante-reporte-card">
        <h2 className="estudiante-reporte-title">
          <span className="title-nuevo">NUEVO</span> REPORTE DE INCIDENTE
        </h2>

        {mensaje.texto && (
          <div className={`mensaje ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="estudiante-reporte-form">
          <div className="form-section">
            <label className="section-label">Tipo de Incidente</label>
            <div className="radio-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="tipo"
                  value="INFRAESTRUCTUCTURA Y SERVICIOS"
                  checked={tipoIncidente === 'INFRAESTRUCTUCTURA Y SERVICIOS'}
                  onChange={(e) => setTipoIncidente(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <span>INFRAESTRUCTUCTURA Y SERVICIOS</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="tipo"
                  value="SEGURIDAD Y EMERGENCIAS"
                  checked={tipoIncidente === 'SEGURIDAD Y EMERGENCIAS'}
                  onChange={(e) => setTipoIncidente(e.target.value)}
                  disabled={isSubmitting}
                />
                <span>SEGURIDAD Y EMERGENCIAS</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="tipo"
                  value="LIMPIEZA Y AMBIENTE"
                  checked={tipoIncidente === 'LIMPIEZA Y AMBIENTE'}
                  onChange={(e) => setTipoIncidente(e.target.value)}
                  disabled={isSubmitting}
                />
                <span>LIMPIEZA Y AMBIENTE</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="tipo"
                  value="TECNOLOGIA Y AULAS"
                  checked={tipoIncidente === 'TECNOLOGIA Y AULAS'}
                  onChange={(e) => setTipoIncidente(e.target.value)}
                  disabled={isSubmitting}
                />
                <span>TECNOLOGIA Y AULAS</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="tipo"
                  value="CONVIVENCIA Y OTROS"
                  checked={tipoIncidente === 'CONVIVENCIA Y OTROS'}
                  onChange={(e) => setTipoIncidente(e.target.value)}
                  disabled={isSubmitting}
                />
                <span>CONVIVENCIA Y OTROS</span>
              </label>
            </div>
          </div>

          <div className="form-section">
            <label className="section-label">Nombre del Incidente</label>
            <input
              type="text"
              placeholder="Incendio, Emergencia médica, etc."
              value={nombreIncidente}
              onChange={(e) => setNombreIncidente(e.target.value)}
              className="text-input"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-section">
            <label className="section-label">Ubicación</label>
            <select
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className="select-input"
              required
              disabled={isSubmitting}
            >
              <option value="">Selector de edificio/piso</option>
              <option value="Edificio A - Piso 1">Edificio A - Piso 1</option>
              <option value="Edificio A - Piso 2">Edificio A - Piso 2</option>
              <option value="Edificio A - Piso 3">Edificio A - Piso 3</option>
              <option value="Edificio B - Piso 1">Edificio B - Piso 1</option>
              <option value="Edificio B - Piso 2">Edificio B - Piso 2</option>
              <option value="Edificio C - Piso 1">Edificio C - Piso 1</option>
            </select>
          </div>

          <div className="form-section">
            <label className="section-label">Descripción</label>
            <textarea
              placeholder="Detalles del incidente"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="textarea-input"
              rows="4"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-section">
            <label className="section-label">Nivel de Urgencia</label>
            <div className="urgencia-buttons">
              <button
                type="button"
                className={`urgencia-btn urgencia-baja ${urgencia === 'BAJA' ? 'active' : ''}`}
                onClick={() => setUrgencia('BAJA')}
                disabled={isSubmitting}
              >
                BAJA
              </button>
              <button
                type="button"
                className={`urgencia-btn urgencia-media ${urgencia === 'MEDIA' ? 'active' : ''}`}
                onClick={() => setUrgencia('MEDIA')}
                disabled={isSubmitting}
              >
                MEDIA
              </button>
              <button
                type="button"
                className={`urgencia-btn urgencia-alta ${urgencia === 'ALTA' ? 'active' : ''}`}
                onClick={() => setUrgencia('ALTA')}
                disabled={isSubmitting}
              >
                ALTA
              </button>
              <button
                type="button"
                className={`urgencia-btn urgencia-critica ${urgencia === 'CRÍTICA' ? 'active' : ''}`}
                onClick={() => setUrgencia('CRÍTICA')}
                disabled={isSubmitting}
              >
                CRÍTICA
              </button>
            </div>
          </div>

          <button type="submit" className="enviar-button" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EstudianteNuevoReporte;
