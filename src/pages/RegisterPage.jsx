import { useState } from 'react';
import { registrarUsuario } from '../services/api';
import './RegisterPage.css';

function RegisterPage({ onRegister, onBackToLogin }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rol, setRol] = useState('estudiante');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Registrar usuario en el backend
      await registrarUsuario(email, password, rol);
      
      // Mensaje de éxito y redirigir al login
      alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
      onBackToLogin();
    } catch (err) {
      console.error('Error en registro:', err);
      setError(err.message || 'Error al crear la cuenta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="logo-section">
          <img 
            src="/logo_alerta_utec.png" 
            alt="Alerta UTEC Logo" 
            className="main-logo"
          />
        </div>
      </div>

      <div className="register-right">
        <img 
          src="/semi_circulos.png" 
          alt="Decoración" 
          className="decorative-semicircles"
        />

        <div className="register-form-container">
          <h2 className="welcome-text">¡Crea tu cuenta!</h2>
          <p className="subtitle-text">Únete a Alerta UTEC</p>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Tu apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder="test@gmail.com"
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
                  placeholder="• • •"
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

            <div className="form-group">
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  disabled={loading}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="role-label">Rol</label>
              <div className="role-buttons">
                <button
                  type="button"
                  className={`role-btn ${rol === 'estudiante' ? 'active' : ''}`}
                  onClick={() => setRol('estudiante')}
                  disabled={loading}
                >
                  ESTUDIANTE
                </button>
                <button
                  type="button"
                  className={`role-btn ${rol === 'trabajador' ? 'active' : ''}`}
                  onClick={() => setRol('trabajador')}
                  disabled={loading}
                >
                  TRABAJADOR
                </button>
                <button
                  type="button"
                  className={`role-btn ${rol === 'administrativo' ? 'active' : ''}`}
                  onClick={() => setRol('administrativo')}
                  disabled={loading}
                >
                  ADMIN
                </button>
              </div>
            </div>

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? 'CREANDO CUENTA...' : 'Crear cuenta'}
            </button>
          </form>
          
          <div className="login-link">
            ¿Ya tienes cuenta? <button onClick={onBackToLogin} className="link-button">Inicia sesión aquí</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

