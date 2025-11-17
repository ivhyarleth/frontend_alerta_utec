import { useState } from 'react';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('ESTUDIANTE');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(role);
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
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="role-label">ROL:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="role"
                    value="ESTUDIANTE"
                    checked={role === 'ESTUDIANTE'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="radio-text">ESTUDIANTE</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="role"
                    value="TRABAJADOR"
                    checked={role === 'TRABAJADOR'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="radio-text">TRABAJADOR</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="role"
                    value="ADMIN"
                    checked={role === 'ADMIN'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="radio-text">ADMIN</span>
                </label>
              </div>
            </div>

            <button type="submit" className="submit-button">
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
