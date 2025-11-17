import { useState, useEffect } from 'react';
import { getUser, clearAuthData } from './services/api';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
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
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    userId: '',
    role: '',
    trabajadorId: '',
    nombre: ''
  });

  // Verificar sesión existente al cargar
  useEffect(() => {
    const user = getUser();
    if (user) {
      // Mapear rol del backend al frontend
      const roleMap = {
        'estudiante': 'ESTUDIANTE',
        'trabajador': 'TRABAJADOR',
        'administrativo': 'ADMIN'
      };
      const frontendRole = roleMap[user.rol] || 'ESTUDIANTE';
      handleLogin(frontendRole, user);
    }
  }, []);

  const handleLogin = (role, userData = null) => {
    console.log('Login con rol:', role);
    setIsLoggedIn(true);
    setUserRole(role);
    
    // Obtener datos del usuario desde localStorage si no se pasan
    const user = userData || getUser();
    
    // Configurar usuario según rol y datos del backend
    if (role === 'ESTUDIANTE') {
      setCurrentUser({
        userId: user?.usuario_id || 'estudiante-001',
        role: user?.rol || 'estudiante',
        trabajadorId: '',
        nombre: user?.email || 'ESTUDIANTE'
      });
      setCurrentView('nuevo');
    } else if (role === 'TRABAJADOR') {
      setCurrentUser({
        userId: user?.usuario_id || 'trabajador-001',
        role: user?.rol || 'trabajador',
        trabajadorId: user?.usuario_id || 'trabajador-001',
        nombre: user?.email || 'COLABORADOR'
      });
      setCurrentView('asignaciones');
    } else if (role === 'ADMIN') {
      setCurrentUser({
        userId: user?.usuario_id || 'admin-001',
        role: user?.rol || 'administrativo',
        trabajadorId: '',
        nombre: user?.email || 'ADMIN'
      });
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    // Limpiar datos de autenticación
    clearAuthData();
    
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
    if (showRegister) {
      return (
        <RegisterPage 
          onRegister={handleLogin}
          onBackToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <LoginPage 
        onLogin={handleLogin} 
        onRegister={() => setShowRegister(true)}
      />
    );
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
