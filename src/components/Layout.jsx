import './Layout.css';

function Layout({ children, onLogout, userName, userRole, currentView, setCurrentView }) {
  const getMenuItems = () => {
    if (userRole === 'ESTUDIANTE') {
      return [
        { id: 'nuevo', label: 'Nuevo reporte' },
        { id: 'mis-reportes', label: 'Mis Reportes' },
        { id: 'seguimiento', label: 'Seguimiento' }
      ];
    } else if (userRole === 'TRABAJADOR') {
      return [
        { id: 'asignaciones', label: 'Asignaciones' },
        { id: 'mis-reportes', label: 'Mis Reportes' }
      ];
    } else if (userRole === 'ADMIN') {
      return [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'reportes', label: 'Reportes' },
        { id: 'detalle', label: 'Detalle por Reporte' }
      ];
    }
    return [];
  };

  const getRoleName = () => {
    if (userRole === 'ESTUDIANTE') return 'ESTUDIANTE';
    if (userRole === 'TRABAJADOR') return 'COLABORADOR';
    if (userRole === 'ADMIN') return 'ADMIN';
    return 'USUARIO';
  };

  const getContentBg = () => {
    if (userRole === 'ESTUDIANTE') return '#E3F2FD';
    if (userRole === 'TRABAJADOR') return '#E8F5E9';
    if (userRole === 'ADMIN') return '#FFF9E6';
    return '#E3F2FD';
  };

  const handleMenuClick = (viewId) => {
    setCurrentView(viewId);
  };

  return (
    <div className="layout-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img
            src="/logo_alerta_utec.png"
            alt="Alerta UTEC"
            className="sidebar-logo"
          />
        </div>

        <div className="sidebar-user">
          <h3 className="user-greeting">
            Hola <span className="user-name">{getRoleName()}</span>
          </h3>
          {/* Si luego quieres el nombre real:
          {userName && <p className="user-real-name">{userName}</p>} */}
        </div>

        <nav className="sidebar-nav">
          {getMenuItems().map((item) => (
            <button
              key={item.id}
              className={`nav-link ${currentView === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button className="logout-button" onClick={onLogout}>
          <span className="logout-text">Cerrar sesión</span>
          <span className="logout-icon">⟶</span>
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content" style={{ background: getContentBg() }}>
        {(userRole === 'ESTUDIANTE' ||
          userRole === 'TRABAJADOR' ||
          userRole === 'ADMIN')}
        {children}
      </main>
    </div>
  );
}

export default Layout;
