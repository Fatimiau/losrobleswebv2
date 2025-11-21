import { useState, useMemo } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useApp } from "./context/AppContext";

// Componentes de página
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
import NotificacionesMenu from "./components/NotificacionesMenu";
import Documentos from "./pages/Documentos";
import AdminDocumentos from "./pages/AdminDocumentos";

// Componente para proteger rutas de admin
function AdminRoute({ children }) {
  const { currentUser } = useApp();
  if (currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Estilos para el contador
const badgeNotificacionStyles = {
  position: 'absolute',
  top: '-5px',
  right: '-5px',
  background: 'var(--danger)',
  color: 'white',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  fontSize: '12px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid var(--card)'
};

export default function App() {
  const { currentUser, logout, db, markNotificacionesAsLeidas } = useApp();
  const [showNotificaciones, setShowNotificaciones] = useState(false);

  const notificacionesNoLeidas = useMemo(() => {
    if (!currentUser) return 0;
    return (db.notificaciones || []).filter(n => n.userId === currentUser.id && !n.leida).length;
  }, [db.notificaciones, currentUser]);

  if (!currentUser) {
    return <Login />;
  }

  const handleBellClick = () => {
    setShowNotificaciones(prev => !prev);
    if (notificacionesNoLeidas > 0) {
      setTimeout(() => {
        markNotificacionesAsLeidas(currentUser.id);
      }, 2000);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Bloque de Título */}
          <div>
            <h1>Residencial Los Robles</h1>
            <p>
              Bienvenido, {currentUser.name} 
              {currentUser.house && ` (Casa: ${currentUser.house})`}
            </p>
          </div>

          {/* Bloque de Botones */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <button className="btn-icon" onClick={handleBellClick} style={{ fontSize: 24, width: 44, height: 44, background: 'transparent', boxShadow: 'none' }}>
                🔔
                {notificacionesNoLeidas > 0 && (
                  <span style={badgeNotificacionStyles}>{notificacionesNoLeidas}</span>
                )}
              </button>
              {showNotificaciones && <NotificacionesMenu onClose={() => setShowNotificaciones(false)} />}
            </div>
            
            <NavLink to="/mi-cuenta" className="btn" style={{ textDecoration: 'none', background: 'var(--muted)', boxShadow: 'none' }}>Mi Cuenta</NavLink>
            <button onClick={logout} className="btn" style={{background: 'var(--danger)'}}>Cerrar Sesión</button>
          </div>
          
        </div>

        <nav className="nav">
          <NavLink to="/" className={({isActive})=> isActive ? "active" : undefined} end>Inicio</NavLink>
          <NavLink to="/incidencias" className={({isActive})=> isActive ? "active" : undefined}>Incidencias</NavLink>
          <NavLink to="/pagos" className={({isActive})=> isActive ? "active" : undefined}>Pagos</NavLink>
          <NavLink to="/avisos" className={({isActive})=> isActive ? "active" : undefined}>Avisos</NavLink>
          <NavLink to="/votaciones" className={({isActive})=> isActive ? "active" : undefined}>Votaciones</NavLink>
          
          <NavLink to="/documentos" className={({isActive})=> isActive ? "active" : undefined}>Documentos</NavLink>
          
          {currentUser.role === 'admin' && (
            <>
              <NavLink to="/reportes" className={({isActive})=> isActive ? "active" : undefined}>Reportes</NavLink>
              <NavLink to="/admin/usuarios" className={({isActive})=> isActive ? "active" : undefined}>Usuarios</NavLink>
              <NavLink to="/admin/documentos" className={({isActive})=> isActive ? "active" : undefined}>Gestión Docs</NavLink>
            </>
          )}
        </nav>
      </header>

      <main style={{ marginTop: 16 }} className="grid">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/incidencias" element={<Incidencias />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/avisos" element={<Avisos />} />
          <Route path="/votaciones" element={<Votaciones />} />
          <Route path="/mi-cuenta" element={<MiCuenta />} />
          
          <Route path="/documentos" element={<Documentos />} />
          <Route path="/admin/documentos" element={<AdminRoute><AdminDocumentos /></AdminRoute>} />
          
          <Route path="/reportes" element={<AdminRoute><Reportes /></AdminRoute>} />
          <Route path="/admin/usuarios" element={<AdminRoute><AdminUsuarios /></AdminRoute>} />
          <Route path="/admin/usuarios/:userId/editar" element={<AdminRoute><AdminEditarUsuario /></AdminRoute>} />
          
          <Route path="/login" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* --- CAMBIO MOD-03: Footer Actualizado --- */}
      <footer style={{ marginTop: 24, color: "var(--muted)", fontSize: 13 }}>
        © 2025 Residencial Los Robles · Versión vPRO1.0
      </footer>
    </div>
  );
}