import { useState } from 'react';
import { loginUsuario } from '../services/api';
import './LoginPage.css';

function LoginPage({ onLogin, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Intentar login con el backend
      const data = await loginUsuario(email, password);
      
      // Mapear rol del backend a rol del frontend
      const roleMap = {
        'estudiante': 'ESTUDIANTE',
        'trabajador': 'TRABAJADOR',
        'administrativo': 'ADMIN'
      };
      
      const frontendRole = roleMap[data.usuario.rol] || 'ESTUDIANTE';
      
      // Llamar al callback con el rol mapeado
      onLogin(frontendRole);
    } catch (err) {
      console.error('Error en login:', err);
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo-section">
          <img 
            src="/logo_alerta_utec.png" 
            alt="Alerta UTEC Logo" 
            className="main-logo"
          />
        </div>
      </div>

      <div className="login-right">
        <img 
          src="/semi_circulos.png" 
          alt="Decoración" 
          className="decorative-semicircles"
        />

        <div className="login-form-container">
          <h2 className="welcome-text">¡Bienvenido de nuevo!</h2>
          
          {error && (
            <div className="error-message" style={{ 
              background: '#fee', 
              color: '#c33', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  disabled={loading}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'INGRESANDO...' : 'INGRESAR'}
            </button>
          </form>
          
          <div className="register-link">
            ¿Aún no tienes cuenta? <button onClick={onRegister} className="link-button">Regístrate aquí</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
