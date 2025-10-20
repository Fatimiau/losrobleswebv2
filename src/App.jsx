import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useApp } from "./context/AppContext";

// --- Page Components ---
import Home from "./pages/Home";
import Incidencias from "./pages/Incidencias";
import Login from "./pages/Login";
import Reportes from "./pages/Reportes";
import Pagos from "./pages/Pagos";
import Avisos from "./pages/Avisos";
import Votaciones from "./pages/Votaciones";
import MiCuenta from "./pages/MiCuenta";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminEditarUsuario from "./pages/AdminEditarUsuario";

// --- Admin Route Protection ---
function AdminRoute({ children }) {
  const { currentUser } = useApp();
  if (currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  const { currentUser, logout } = useApp();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Residencial Los Robles</h1>
        <p>Bienvenido, {currentUser.name} (Casa: {currentUser.house})</p>

        <nav className="nav">
          <NavLink to="/" className={({isActive})=> isActive ? "active" : undefined} end>Inicio</NavLink>
          <NavLink to="/incidencias" className={({isActive})=> isActive ? "active" : undefined}>Incidencias</NavLink>
          <NavLink to="/pagos" className={({isActive})=> isActive ? "active" : undefined}>Pagos</NavLink>
          <NavLink to="/avisos" className={({isActive})=> isActive ? "active" : undefined}>Avisos</NavLink>
          <NavLink to="/votaciones" className={({isActive})=> isActive ? "active" : undefined}>Votaciones</NavLink>
          
          {/* Admin-only navigation links */}
          {currentUser.role === 'admin' && (
            <>
              <NavLink to="/reportes" className={({isActive})=> isActive ? "active" : undefined}>Reportes</NavLink>
              <NavLink to="/admin/usuarios" className={({isActive})=> isActive ? "active" : undefined}>Usuarios</NavLink>
            </>
          )}

          {/* User-specific & Logout buttons */}
          <NavLink to="/mi-cuenta" className={({isActive})=> isActive ? "active" : undefined} style={{marginLeft: 'auto'}}>Mi Cuenta</NavLink>
          <button onClick={logout} className="btn" style={{background: 'var(--danger)'}}>Cerrar Sesión</button>
        </nav>
      </header>

      <main style={{ marginTop: 16 }} className="grid">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/incidencias" element={<Incidencias />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/avisos" element={<Avisos />} />
          <Route path="/votaciones" element={<Votaciones />} />
          <Route path="/mi-cuenta" element={<MiCuenta />} />
          
          {/* Admin-Only Routes */}
          <Route path="/reportes" element={<AdminRoute><Reportes /></AdminRoute>} />
          <Route path="/admin/usuarios" element={<AdminRoute><AdminUsuarios /></AdminRoute>} />
          <Route path="/admin/usuarios/:userId/editar" element={<AdminRoute><AdminEditarUsuario /></AdminRoute>} />
          
          {/* Redirect for login page if user is already authenticated */}
          <Route path="/login" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer style={{ marginTop: 24, color: "var(--muted)", fontSize: 13 }}>
        © 2025 Residencial Los Robles · Sprint 2 Terminado
      </footer>
    </div>
  );
}