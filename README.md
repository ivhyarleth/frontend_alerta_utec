# Frontend - Alertas UTEC🚨

Aplicación web frontend para la gestión de **reportes y alertas** dentro de la universidad.  
Permite a **estudiantes**, **trabajadores** y **administradores** interactuar con el sistema según su rol.

---

## 🌐 Demo en producción

El proyecto está desplegado en **AWS Amplify**:

👉 **Aplicación en línea:**  
<https://main.d2ymifgoi0u6ku.amplifyapp.com>

---

## 🧱 Tecnologías

- **React**  
- **JavaScript**  
- **CSS**  
- Consumo de API centralizado en `src/services/api.js`  
- Despliegue en **AWS Amplify**

---

## 📂 Estructura del proyecto

> La estructura exacta puede variar ligeramente, pero en general se organiza así:
```
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
```

### 🧩 Componentes principales

**App.jsx**  
Punto de entrada del frontend. Se encarga de:

- Manejar el estado de sesión: `isLoggedIn`  
- Guardar el rol del usuario: `userRole`  
- Definir la vista actual: `currentView`  
- Cambiar entre:  
  - Login (`LoginPage`)  
  - Registro (`RegisterPage`)  
  - Vistas internas para cada rol (estudiante, trabajador, admin)  

**Layout.jsx**  
Componente de diseño general de la aplicación:

- Encabezado (header)  
- Sección de navegación / menú  
- Contenido principal  
- Botón de cerrar sesión  

Recibe como props:  

- `onLogout`  
- `userName`  
- `userRole`  
- `currentView`  
- `setCurrentView`  

**services/api.js**  
Módulo donde se centraliza la lógica de comunicación con el backend (por ejemplo, vía fetch o axios). Algunas funciones típicas:

- `obtenerToken`  
- `obtenerUsuario`  
- `eliminarToken`  
- `eliminarUsuario`  
- Otras funciones para manejar reportes, usuarios, etc.  

En el entorno actual de pruebas, las funciones relacionadas con token pueden estar desactivadas en `App.jsx` para facilitar el testeo de las vistas.

**ReportePage.jsx**  
Página para visualizar el detalle de un reporte.  
Está pensada para reutilizarse con distintos roles:

- Estudiante: ver el detalle de un reporte que creó.  
- Trabajador: revisar un reporte asignado.  
- Administrador: ver el reporte con todas las acciones disponibles.  

Suele ser llamada desde:

- Listados de reportes (`EstudianteMisReportes`, `TrabajadorMisReportes`, `AdminReportes`)  
- Vistas de detalle específicas como `AdminDetalle`.  

---

## 👥 Roles y vistas

La aplicación muestra contenido diferente según el rol:

### 1. Estudiante (ESTUDIANTE)

Páginas:

- `EstudianteNuevoReporte.jsx`  
  Crear un nuevo reporte/alerta.  
- `EstudianteMisReportes.jsx`  
  Ver la lista de reportes creados por el estudiante.  
- `EstudianteSeguimiento.jsx`  
  Ver el seguimiento/estado de los reportes (por ejemplo, en revisión, atendido, etc.).

Fragmento de `App.jsx`:

```
if (userRole === 'ESTUDIANTE') {
  if (currentView === 'nuevo') return <EstudianteNuevoReporte />;
  if (currentView === 'mis-reportes') return <EstudianteMisReportes />;
  if (currentView === 'seguimiento') return <EstudianteSeguimiento />;
  return <EstudianteNuevoReporte />;
}
```

### 2. Trabajador (TRABAJADOR)

Páginas:

- `TrabajadorAsignaciones.jsx`  
  Ver y gestionar las asignaciones de reportes del trabajador.  
- `TrabajadorMisReportes.jsx`  
  Listar los reportes que el trabajador ha atendido o tiene asociados.

Fragmento de `App.jsx`:
```
if (userRole === 'TRABAJADOR') {
  if (currentView === 'asignaciones') return <TrabajadorAsignaciones />;
  if (currentView === 'mis-reportes') return <TrabajadorMisReportes />;
  return <TrabajadorAsignaciones />;
}

```

### 3. Administrador (ADMIN)

Páginas:

- `AdminDashboard.jsx`  
  Vista general del sistema: métricas, resúmenes, etc.  
- `AdminReportes.jsx`  
  Listado de todos los reportes, con filtros u opciones administrativas.  
- `AdminDetalle.jsx`  
  Vista detallada de un reporte concreto, con acciones administrativas (por ejemplo, reasignar, cambiar estado, etc.).

Fragmento de `App.jsx`:
```
if (userRole === 'ADMIN') {
  if (currentView === 'dashboard') return <AdminDashboard />;
  if (currentView === 'reportes') return <AdminReportes />;
  if (currentView === 'detalle') return <AdminDetalle />;
  return <AdminDashboard />;
}

```

---

## 🔐 Autenticación y flujo de sesión

Manejo básico en `App.jsx`:

```

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

const handleLogout = () => {
  // eliminarToken();
  // eliminarUsuario();
  setIsLoggedIn(false);
  setUserRole('');
  setCurrentView('');
  setShowRegister(false);
};
```

### Login y Registro
Si el usuario no está logueado, App.jsx muestra:

LoginPage por defecto.

RegisterPage si el usuario elige registrarse.
```
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
```
