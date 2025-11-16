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
  const [selectedReporteId, setSelectedReporteId] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    userId: '',
    role: '',
    trabajadorId: '',
    nombre: ''
  });

  const handleLogin = (role) => {
    console.log('Login con rol:', role);
    setIsLoggedIn(true);
    setUserRole(role);
    
    // Configurar usuario según rol
    if (role === 'ESTUDIANTE') {
      setCurrentUser({
        userId: 'estudiante-001',
        role: 'estudiante',
        trabajadorId: '',
        nombre: 'ESTUDIANTE'
      });
      setCurrentView('nuevo');
    } else if (role === 'TRABAJADOR') {
      setCurrentUser({
        userId: 'trabajador-001',
        role: 'trabajador',
        trabajadorId: 'trabajador-001',
        nombre: 'COLABORADOR'
      });
      setCurrentView('asignaciones');
    } else if (role === 'ADMIN') {
      setCurrentUser({
        userId: 'admin-001',
        role: 'administrativo',
        trabajadorId: '',
        nombre: 'ADMIN'
      });
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setCurrentView('');
    setSelectedReporteId(null);
    setCurrentUser({
      userId: '',
      role: '',
      trabajadorId: '',
      nombre: ''
    });
  };

  const navigateToDetalle = (reporteId) => {
    setSelectedReporteId(reporteId);
    setCurrentView('detalle');
  };

  useEffect(() => {
    console.log('Estado actual:', { isLoggedIn, userRole, currentView });
  }, [isLoggedIn, userRole, currentView]);

  const renderContent = () => {
    if (userRole === 'ESTUDIANTE') {
      switch (currentView) {
        case 'nuevo': 
          return <EstudianteNuevoReporte currentUser={currentUser} />;
        case 'mis-reportes': 
          return <EstudianteMisReportes currentUser={currentUser} />;
        case 'seguimiento': 
          return <EstudianteSeguimiento currentUser={currentUser} />;
        default: 
          return <EstudianteNuevoReporte currentUser={currentUser} />;
      }
    } else if (userRole === 'TRABAJADOR') {
      switch (currentView) {
        case 'asignaciones':
          return <TrabajadorAsignaciones currentUser={currentUser} />;
        case 'mis-reportes':
          return <TrabajadorMisReportes currentUser={currentUser} />;
        default:
          return <TrabajadorAsignaciones currentUser={currentUser} />;
      }
    } else if (userRole === 'ADMIN') {
      switch (currentView) {
        case 'dashboard':
          return <AdminDashboard currentUser={currentUser} navigateToDetalle={navigateToDetalle} />;
        case 'reportes':
          return <AdminReportes currentUser={currentUser} navigateToDetalle={navigateToDetalle} />;
        case 'detalle':
          return <AdminDetalle currentUser={currentUser} reporteId={selectedReporteId} />;
        default:
          return <AdminDashboard currentUser={currentUser} navigateToDetalle={navigateToDetalle} />;
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
