import { useState } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Incidencias from "./pages/Incidencias";
import Login from "./pages/Login";
import Reportes from "./pages/Reportes";

function Pagos() {
  return (
    <div className="card">
      <h2 className="section">Pagos</h2>
      <p>Próximamente: consulta de saldos y estatus de pago por vivienda.</p>
    </div>
  );
}

function Avisos() {
  return (
    <div className="card">
      <h2 className="section">Avisos</h2>
      <ul className="list">
        <li className="item">
          <h4>Mantenimiento de bombas</h4>
          <p>Lunes 10:00–12:00 — Podrían presentarse bajas de presión.</p>
          <div className="meta"><span className="badge warn">Aviso</span></div>
        </li>
      </ul>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Residencial Los Robles</h1>
        <p>Plataforma de Gestión Comunitaria</p>

        <nav className="nav">
          <NavLink to="/" className={({isActive})=> isActive ? "active" : undefined} end>Inicio</NavLink>
          <NavLink to="/incidencias" className={({isActive})=> isActive ? "active" : undefined}>Incidencias</NavLink>
          <NavLink to="/reportes" className={({isActive})=> isActive ? "active" : undefined}>Reportes</NavLink>
          <NavLink to="/pagos" className={({isActive})=> isActive ? "active" : undefined}>Pagos</NavLink>
          <NavLink to="/avisos" className={({isActive})=> isActive ? "active" : undefined}>Avisos</NavLink>
          <button onClick={handleLogout} className="btn" style={{background: 'var(--danger)', marginLeft: 'auto'}}>Cerrar Sesión</button>
        </nav>
      </header>

      <main style={{ marginTop: 16 }} className="grid">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/incidencias" element={<Incidencias />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/avisos" element={<Avisos />} />
          <Route path="/login" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer style={{ marginTop: 24, color: "var(--muted)", fontSize: 13 }}>
        © 2025 Residencial Los Robles · Sprint 1 Terminado
      </footer>
    </div>
  );
}