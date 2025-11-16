import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import EstudianteNuevoReporte from './pages/EstudianteNuevoReporte';
import EstudianteMisReportes from './pages/EstudianteMisReportes';
import EstudianteSeguimiento from './pages/EstudianteSeguimiento';
import TrabajadorAsignaciones from './pages/TrabajadorAsignaciones';
import TrabajadorMisReportes from './pages/TrabajadorMisReportes';
import AdminDashboard from './pages/AdminDashboard';
import AdminReportes from './pages/AdminReportes';
import AdminDetalle from './pages/AdminDetalle';
import Layout from './components/Layout';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [currentView, setCurrentView] = useState('');

  const handleLogin = (role) => {
    console.log('Login con rol:', role);
    setIsLoggedIn(true);
    setUserRole(role);
    
    // Vista inicial por rol
    if (role === 'ESTUDIANTE') {
      setCurrentView('nuevo');
    } else if (role === 'TRABAJADOR') {
      setCurrentView('asignaciones');
    } else if (role === 'ADMIN') {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setCurrentView('');
  };

  useEffect(() => {
    console.log('Estado actual:', { isLoggedIn, userRole, currentView });
  }, [isLoggedIn, userRole, currentView]);

  const renderContent = () => {
    if (userRole === 'ESTUDIANTE') {
      switch (currentView) {
        case 'nuevo': 
          return <EstudianteNuevoReporte />;
        case 'mis-reportes': 
          return <EstudianteMisReportes />;
        case 'seguimiento': 
          return <EstudianteSeguimiento />;
        default: 
          return <EstudianteNuevoReporte />;
      }
    } else if (userRole === 'TRABAJADOR') {
      switch (currentView) {
        case 'asignaciones':
          return <TrabajadorAsignaciones />;
        case 'mis-reportes':
          return <TrabajadorMisReportes />;
        default:
          return <TrabajadorAsignaciones />;
      }
    } else if (userRole === 'ADMIN') {
      switch (currentView) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'reportes':
          return <AdminReportes />;
        case 'detalle':
          return <AdminDetalle />;
        default:
          return <AdminDashboard />;
      }
    }
    return <div>Selecciona una vista</div>;
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout 
      onLogout={handleLogout} 
      userName="USUARIO" 
      userRole={userRole} 
      currentView={currentView} 
      setCurrentView={setCurrentView}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
