// ==================== CONFIGURACIÓN DE LA API ====================

// ⚠️ NUEVAS URLs DESPUÉS DEL ÚLTIMO sls deploy
const API_BASE_URL = 'https://ovgixvti60.execute-api.us-east-1.amazonaws.com/dev';
const WS_BASE_URL  = 'wss://vwomh5is13.execute-api.us-east-1.amazonaws.com/dev';

// ==================== AUTENTICACIÓN ====================

// Gestión de tokens
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getUser = () => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const setAuthData = (token, usuario) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(usuario));
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

// Registrar usuario
export const registrarUsuario = async (email, password, rol) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, rol })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al registrar usuario');
  }
  
  return await response.json();
};

// Iniciar sesión
export const loginUsuario = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Credenciales inválidas');
  }
  
  const data = await response.json();
  
  // Guardar token y datos del usuario
  setAuthData(data.token, data.usuario);
  
  return data;
};

// Helper para hacer peticiones autenticadas
export const fetchAutenticado = async (url, options = {}) => {
  const token = getToken();
  if (!token) {
    throw new Error('No autenticado. Por favor inicia sesión.');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  // Manejar sesión expirada
  if (response.status === 401) {
    clearAuthData();
    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
  }
  
  return response;
};

// Helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || error.message || `HTTP ${response.status}`);
  }
  return response.json();
};

// ==================== REPORTES ====================

// Crear nuevo reporte (requiere autenticación)
export const crearReporte = async (data) => {
  const response = await fetchAutenticado(`${API_BASE_URL}/reportes`, {
    method: 'POST',
    body: JSON.stringify({
      tipo: data.tipo,
      ubicacion: data.ubicacion,
      descripcion: data.descripcion,
      nivel_urgencia: data.nivel_urgencia,
      imagenes: data.imagenes || [],
      videos: data.videos || []
    })
  });
  return handleResponse(response);
};

// Listar reportes (autenticación opcional)
export const listarReportes = async (filtros = {}) => {
  const params = new URLSearchParams();
  
  if (filtros.usuario_id) params.append('usuario_id', filtros.usuario_id);
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.tipo) params.append('tipo', filtros.tipo);
  if (filtros.nivel_urgencia) params.append('nivel_urgencia', filtros.nivel_urgencia);
  if (filtros.orderBy) params.append('orderBy', filtros.orderBy);
  if (filtros.limit) params.append('limit', filtros.limit);
  if (filtros.lastKey) params.append('lastKey', filtros.lastKey);
  
  const url = `${API_BASE_URL}/reportes${params.toString() ? '?' + params.toString() : ''}`;
  
  // Intentar con autenticación si hay token
  if (isAuthenticated()) {
    const response = await fetchAutenticado(url);
    return handleResponse(response);
  }
  
  // Sin autenticación (fallback)
  const response = await fetch(url);
  return handleResponse(response);
};

// Visualizar un reporte específico (requiere autenticación)
export const visualizarReporte = async (reporte_id) => {
  const response = await fetchAutenticado(`${API_BASE_URL}/reportes/${reporte_id}`);
  return handleResponse(response);
};

// Obtener reporte completo (requiere autenticación)
export const obtenerReporteCompleto = async (reporte_id) => {
  const response = await fetchAutenticado(`${API_BASE_URL}/reportes/${reporte_id}/completo`);
  return handleResponse(response);
};

// Actualizar reporte (requiere autenticación)
export const actualizarReporte = async (reporte_id, data) => {
  const response = await fetchAutenticado(`${API_BASE_URL}/reportes/${reporte_id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

// Asignar trabajador a reporte (requiere autenticación y rol administrativo)
export const asignarReporte = async (reporte_id, trabajador_id) => {
  const response = await fetchAutenticado(`${API_BASE_URL}/reportes/${reporte_id}/asignar`, {
    method: 'POST',
    body: JSON.stringify({ trabajador_id })
  });
  return handleResponse(response);
};

// Cerrar reporte (requiere autenticación y rol administrativo)
export const cerrarReporte = async (reporte_id, notes = '') => {
  const response = await fetchAutenticado(`${API_BASE_URL}/reportes/${reporte_id}/cerrar`, {
    method: 'POST',
    body: JSON.stringify({ notes })
  });
  return handleResponse(response);
};

// Obtener historial de un reporte (requiere autenticación)
export const obtenerHistorial = async (reporte_id) => {
  const response = await fetchAutenticado(`${API_BASE_URL}/reportes/${reporte_id}/historial`);
  return handleResponse(response);
};

// ==================== USUARIOS ====================

// Listar trabajadores (requiere autenticación y rol administrativo)
export const listarTrabajadores = async () => {
  const response = await fetchAutenticado(`${API_BASE_URL}/usuarios/trabajadores`);
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
    this.token = getToken();
    
    if (!this.token) {
      throw new Error('Token JWT requerido para conectar WebSocket');
    }
    
    // Callbacks
    this.onEstadoUpdate = null;
    this.onEstadosResponse = null;
    this.onConnect = null;
    this.onDisconnect = null;
    this.onError = null;
  }

  connect() {
    const params = new URLSearchParams();
    
    // Token es obligatorio
    params.append('token', this.token);
    
    if (this.reporte_id) params.append('reporte_id', this.reporte_id);
    
    const url = `${WS_BASE_URL}?${params.toString()}`;
    
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
        reporte_id: reporte_id,
        token: this.token
      }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Acciones de trabajador vía WebSocket
  enviarEnCamino(reporte_id, trabajador_id, task_token, ubicacion) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        action: 'enCamino',
        token: this.token,
        reporte_id,
        trabajador_id,
        task_token,
        ubicacion_trabajador: ubicacion
      }));
    }
  }

  enviarTrabajadorLlego(reporte_id, trabajador_id, task_token) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        action: 'trabajadorLlego',
        token: this.token,
        reporte_id,
        trabajador_id,
        task_token
      }));
    }
  }

  enviarTrabajoTerminado(reporte_id, trabajador_id, task_token, comentarios = '', imagenes_finales = []) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        action: 'trabajoTerminado',
        token: this.token,
        reporte_id,
        trabajador_id,
        task_token,
        comentarios,
        imagenes_finales
      }));
    }
  }
}

// ==================== MAPEO DE DATOS ====================

export const mapUrgenciaToBackend = (urgencia) => {
  const map = {
    'BAJA': 'baja',
    'MEDIA': 'media',
    'ALTA': 'alta',
    'CRÍTICA': 'critica'
  };
  return map[urgencia] || 'media';
};

export const mapUrgenciaToFrontend = (urgencia) => {
  const map = {
    'baja': 'BAJA',
    'media': 'MEDIA',
    'alta': 'ALTA',
    'critica': 'CRÍTICA'
  };
  return map[urgencia] || 'MEDIA';
};

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
