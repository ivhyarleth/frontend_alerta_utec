// Configuración de la API
const API_BASE_URL = 'https://iufx6tx21g.execute-api.us-east-1.amazonaws.com/dev';
const WS_BASE_URL = 'wss://z7unrfb2ub.execute-api.us-east-1.amazonaws.com/dev';

// Helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
};

// ==================== REPORTES ====================

// Crear nuevo reporte
export const crearReporte = async (data) => {
  const response = await fetch(`${API_BASE_URL}/reportes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      usuario_id: data.usuario_id || 'estudiante-001',
      tipo: data.tipo,
      ubicacion: data.ubicacion,
      descripcion: data.descripcion,
      nivel_urgencia: data.nivel_urgencia,
      rol: data.rol || 'estudiante',
      imagenes: data.imagenes || [],
      videos: data.videos || []
    })
  });
  return handleResponse(response);
};

// Listar reportes (con filtros opcionales)
export const listarReportes = async (filtros = {}) => {
  const params = new URLSearchParams();
  
  if (filtros.usuario_id) params.append('usuario_id', filtros.usuario_id);
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.tipo) params.append('tipo', filtros.tipo);
  if (filtros.nivel_urgencia) params.append('nivel_urgencia', filtros.nivel_urgencia);
  if (filtros.limit) params.append('limit', filtros.limit);
  if (filtros.lastKey) params.append('lastKey', filtros.lastKey);
  
  const url = `${API_BASE_URL}/reportes${params.toString() ? '?' + params.toString() : ''}`;
  const response = await fetch(url);
  return handleResponse(response);
};

// Visualizar un reporte específico
export const visualizarReporte = async (reporte_id) => {
  const response = await fetch(`${API_BASE_URL}/reportes/${reporte_id}`);
  return handleResponse(response);
};

// Obtener reporte completo (con estados e historial)
export const obtenerReporteCompleto = async (reporte_id) => {
  const response = await fetch(`${API_BASE_URL}/reportes/${reporte_id}/completo`);
  return handleResponse(response);
};

// Actualizar reporte
export const actualizarReporte = async (reporte_id, data) => {
  const response = await fetch(`${API_BASE_URL}/reportes/${reporte_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

// Asignar trabajador a reporte
export const asignarReporte = async (reporte_id, trabajador_id) => {
  const response = await fetch(`${API_BASE_URL}/reportes/${reporte_id}/asignar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ trabajador_id })
  });
  return handleResponse(response);
};

// Cerrar reporte
export const cerrarReporte = async (reporte_id, comentarios = '') => {
  const response = await fetch(`${API_BASE_URL}/reportes/${reporte_id}/cerrar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comentarios })
  });
  return handleResponse(response);
};

// Obtener historial de un reporte
export const obtenerHistorial = async (reporte_id) => {
  const response = await fetch(`${API_BASE_URL}/reportes/${reporte_id}/historial`);
  return handleResponse(response);
};

// ==================== WEBSOCKET ====================

export class WebSocketManager {
  constructor(reporte_id = null, usuario_id = null) {
    this.reporte_id = reporte_id;
    this.usuario_id = usuario_id;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    
    // Callbacks
    this.onEstadoUpdate = null;
    this.onEstadosResponse = null;
    this.onConnect = null;
    this.onDisconnect = null;
    this.onError = null;
  }

  connect() {
    const params = new URLSearchParams();
    if (this.reporte_id) params.append('reporte_id', this.reporte_id);
    if (this.usuario_id) params.append('usuario_id', this.usuario_id);
    
    const url = `${WS_BASE_URL}${params.toString() ? '?' + params.toString() : ''}`;
    
    this.ws = new WebSocket(url);
    
    this.ws.onopen = () => {
      console.log('WebSocket conectado');
      this.reconnectAttempts = 0;
      if (this.onConnect) this.onConnect();
    };
    
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Mensaje WebSocket recibido:', data);
        
        if (data.tipo === 'actualizacion_estado' && this.onEstadoUpdate) {
          this.onEstadoUpdate(data);
        } else if (data.tipo === 'estados_response' && this.onEstadosResponse) {
          this.onEstadosResponse(data);
        }
      } catch (error) {
        console.error('Error procesando mensaje WebSocket:', error);
      }
    };
    
    this.ws.onerror = (error) => {
      console.error('Error WebSocket:', error);
      if (this.onError) this.onError(error);
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket desconectado');
      if (this.onDisconnect) this.onDisconnect();
      this.attemptReconnect();
    };
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reintentando conexión (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts);
    }
  }

  obtenerEstados(reporte_id) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        action: 'obtenerEstados',
        reporte_id: reporte_id
      }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// ==================== MAPEO DE DATOS ====================

// Mapear urgencia del frontend al backend
export const mapUrgenciaToBackend = (urgencia) => {
  const map = {
    'BAJA': 'baja',
    'MEDIA': 'media',
    'ALTA': 'alta',
    'CRÍTICA': 'critica'
  };
  return map[urgencia] || 'media';
};

// Mapear urgencia del backend al frontend
export const mapUrgenciaToFrontend = (urgencia) => {
  const map = {
    'baja': 'BAJA',
    'media': 'MEDIA',
    'alta': 'ALTA',
    'critica': 'CRÍTICA'
  };
  return map[urgencia] || 'MEDIA';
};

// Mapear tipo de incidente
export const mapTipoIncidente = (tipo) => {
  const map = {
    'INFRAESTRUCTUCTURA Y SERVICIOS': 'mantenimiento',
    'SEGURIDAD Y EMERGENCIAS': 'seguridad',
    'LIMPIEZA Y AMBIENTE': 'limpieza',
    'TECNOLOGIA Y AULAS': 'tecnologia',
    'CONVIVENCIA Y OTROS': 'otro'
  };
  return map[tipo] || 'otro';
};

// Mapear tipo del backend al frontend
export const mapTipoToFrontend = (tipo) => {
  const map = {
    'mantenimiento': 'INFRAESTRUCTUCTURA Y SERVICIOS',
    'seguridad': 'SEGURIDAD Y EMERGENCIAS',
    'limpieza': 'LIMPIEZA Y AMBIENTE',
    'tecnologia': 'TECNOLOGIA Y AULAS',
    'otro': 'CONVIVENCIA Y OTROS'
  };
  return map[tipo] || 'CONVIVENCIA Y OTROS';
};

export { API_BASE_URL, WS_BASE_URL };
