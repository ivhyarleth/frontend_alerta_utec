# Frontend - Sistema de Alertas UTEC 🏫🚨

Aplicación web frontend para la gestión de **reportes y alertas** dentro de la universidad.  
Permite a **estudiantes**, **trabajadores** y **administradores** interactuar con el sistema según su rol.

---

## 🧱 Tecnologías

- **React** (componentes funcionales + hooks)
- **JavaScript (ES6+)**
- **CSS** (estilos en `App.css`)
- Lógica de consumo de API centralizada en `src/services/api.js` (login, manejo de usuario, etc.)

---

## 📂 Estructura del proyecto

> La estructura exacta puede variar ligeramente, pero en general se organiza así:

```bash
src/
├─ App.jsx
├─ App.css
├─ components/
│   └─ Layout.jsx
├─ pages/
│   ├─ LoginPage.jsx
│   ├─ RegisterPage.jsx
│   ├─ EstudianteNuevoReporte.jsx
│   ├─ EstudianteMisReportes.jsx
│   ├─ EstudianteSeguimiento.jsx
│   ├─ TrabajadorAsignaciones.jsx
│   ├─ TrabajadorMisReportes.jsx
│   ├─ AdminDashboard.jsx
│   ├─ AdminReportes.jsx
│   ├─ AdminDetalle.jsx
│   └─ ReportePage.jsx
└─ services/
    └─ api.js
Componentes principales
App.jsx
Punto de entrada del frontend. Maneja:

Estado de sesión (isLoggedIn)

Rol del usuario (userRole)

Vista actual (currentView)

Conmutación entre Login, Registro y vistas internas según rol.

Layout.jsx
Layout general de la app (header, navegación lateral o menú, botón de logout, etc.).
Recibe:

onLogout

userName

userRole

currentView

setCurrentView

services/api.js
Funciones para interactuar con el backend, por ejemplo:

obtenerToken

obtenerUsuario

eliminarToken

eliminarUsuario

y otras llamadas HTTP según el backend.

ReportePage.jsx
Página para visualizar el detalle de un reporte específico (se puede reutilizar para estudiante, trabajador o admin).
Normalmente se usa cuando desde alguna lista de reportes se selecciona uno y se quiere ver toda la información asociada.

👥 Roles y vistas
La aplicación muestra vistas diferentes dependiendo del rol del usuario.

1. Estudiante (ESTUDIANTE)
Páginas asociadas:

EstudianteNuevoReporte.jsx
Crear un nuevo reporte/alerta.

EstudianteMisReportes.jsx
Listar y revisar los reportes creados por el estudiante.

EstudianteSeguimiento.jsx
Ver el seguimiento/estado de los reportes.

En App.jsx, se controla así:

jsx
Copiar código
if (userRole === 'ESTUDIANTE') {
  if (currentView === 'nuevo') return <EstudianteNuevoReporte />;
  if (currentView === 'mis-reportes') return <EstudianteMisReportes />;
  if (currentView === 'seguimiento') return <EstudianteSeguimiento />;
  return <EstudianteNuevoReporte />;
}
2. Trabajador (TRABAJADOR)
Páginas asociadas:

TrabajadorAsignaciones.jsx
Ver y gestionar asignaciones de reportes.

TrabajadorMisReportes.jsx
Listar los reportes gestionados por el trabajador.

En App.jsx:

jsx
Copiar código
if (userRole === 'TRABAJADOR') {
  if (currentView === 'asignaciones') return <TrabajadorAsignaciones />;
  if (currentView === 'mis-reportes') return <TrabajadorMisReportes />;
  return <TrabajadorAsignaciones />;
}
3. Administrador (ADMIN)
Páginas asociadas:

AdminDashboard.jsx
Vista general / métricas / resumen de reportes.

AdminReportes.jsx
Listado de reportes para administración.

AdminDetalle.jsx
Detalle de un reporte específico, con opciones de gestión.

En App.jsx:

jsx
Copiar código
if (userRole === 'ADMIN') {
  if (currentView === 'dashboard') return <AdminDashboard />;
  if (currentView === 'reportes') return <AdminReportes />;
  if (currentView === 'detalle') return <AdminDetalle />;
  return <AdminDashboard />;
}
Detalle de reportes: ReportePage.jsx
ReportePage.jsx se puede usar como una página compartida para mostrar detalles completos de un reporte:

Información general del reporte (tipo, descripción, fecha, ubicación, etc.).

Estado actual y/o historial de cambios.

Acciones disponibles según el rol (por ejemplo, actualizar estado, agregar comentarios, etc.).

La navegación hacia ReportePage puede hacerse:

Desde EstudianteMisReportes (ver un reporte del estudiante).

Desde TrabajadorMisReportes o TrabajadorAsignaciones.

Desde AdminReportes o AdminDetalle.

La integración exacta depende de cómo se manejen las rutas o el estado (currentView + algún id de reporte).

🔐 Autenticación y flujo de sesión
IMPORTANTE: Actualmente el proyecto está configurado para NO validar tokens al inicio, para facilitar las pruebas de las vistas.

En esta versión, en App.jsx:

No se usa useEffect para leer token/usuario al cargar.

Solo depende de handleLogin(role) que se ejecuta desde LoginPage.

Ejemplo simplificado:

jsx
Copiar código
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [userRole, setUserRole] = useState('');
const [currentView, setCurrentView] = useState('');

const handleLogin = (role) => {
  console.log('✅ Login con rol:', role);
  setIsLoggedIn(true);
  const rol = role.toUpperCase();
  setUserRole(rol);
  setShowRegister(false);

  if (rol === 'ESTUDIANTE') {
    setCurrentView('nuevo');
  } else if (rol === 'TRABAJADOR') {
    setCurrentView('asignaciones');
  } else if (rol === 'ADMIN') {
    setCurrentView('dashboard');
  }
};
Logout solo limpia el estado en memoria:

jsx
Copiar código
const handleLogout = () => {
  // eliminarToken();
  // eliminarUsuario();
  setIsLoggedIn(false);
  setUserRole('');
  setCurrentView('');
  setShowRegister(false);
};
Más adelante se puede reactivar la validación de tokens usando obtenerToken / obtenerUsuario si se quiere un flujo real con JWT.

🧪 Login y Registro
Si el usuario no está logueado, App.jsx muestra:

LoginPage por defecto.

RegisterPage si el usuario elige registrarse.

jsx
Copiar código
if (!isLoggedIn) {
  if (showRegister) {
    return (
      <RegisterPage
        onRegisterSuccess={handleRegisterSuccess}
        onBackToLogin={() => setShowRegister(false)}
      />
    );
  }

  return (
    <LoginPage
      onLogin={handleLogin}
      onShowRegister={() => setShowRegister(true)}
    />
  );
}
