import { useApp } from "../context/AppContext";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// --- Panel de Estadísticas para Administradores ---
function AdminDashboard() {
  const { db } = useApp();

  const stats = useMemo(() => {
    const incidenciasNuevas = (db.incidencias || []).filter(i => i.estado === 'Nueva').length;
    const pagosVencidos = (db.pagos || []).filter(p => {
      const now = new Date();
      const fechaVencimiento = p.fechaVencimiento ? new Date(p.fechaVencimiento) : null;
      return p.estado === 'Pendiente' && fechaVencimiento && fechaVencimiento < now;
    }).length;
    const votacionesActivas = (db.votaciones || []).filter(v => v.activa).length;
    const totalResidentes = (db.users || []).filter(u => u.role === 'residente').length;

    return { incidenciasNuevas, pagosVencidos, votacionesActivas, totalResidentes };
  }, [db]);

  return (
    <div>
      <h2 className="section">Panel de Administrador</h2>
      <div className="dashboard-grid">
        <StatCard 
          valor={stats.incidenciasNuevas}
          titulo="Incidencias Nuevas"
          link="/incidencias"
          color="warn"
        />
        <StatCard 
          valor={stats.pagosVencidos}
          titulo="Pagos Vencidos"
          link="/pagos"
          color="vencido"
        />
        <StatCard 
          valor={stats.votacionesActivas}
          titulo="Votaciones Activas"
          link="/votaciones"
          color="brand"
        />
        <StatCard 
          valor={stats.totalResidentes}
          titulo="Residentes Registrados"
          link="/admin/usuarios"
          color="muted"
        />
      </div>
    </div>
  );
}

// --- Panel Personal para Residentes ---
function ResidenteDashboard() {
  const { currentUser, db } = useApp();

  const myStats = useMemo(() => {
    const misIncidencias = (db.incidencias || []).filter(i => i.userId === currentUser.id && i.estado !== 'Cerrada');
    
    const misPagosVencidos = (db.pagos || []).filter(p => {
      const now = new Date();
      const fechaVencimiento = p.fechaVencimiento ? new Date(p.fechaVencimiento) : null;
      return p.house === currentUser.house && p.estado === 'Pendiente' && fechaVencimiento && fechaVencimiento < now;
    }).length;

    const ultimoAviso = (db.avisos || []).sort((a, b) => b.creado - a.creado)[0];

    return { misIncidencias, misPagosVencidos, ultimoAviso };
  }, [db, currentUser]);

  return (
    <div>
      <h2 className="section">Mi Resumen</h2>
      
      {/* Aviso de Pagos Vencidos */}
      {myStats.misPagosVencidos > 0 && (
        <div className="card-alerta vencido">
          <p>⚠️ Tienes **{myStats.misPagosVencidos}** pago(s) de mantenimiento vencido(s).</p>
          <Link to="/pagos" className="btn" style={{background: 'var(--danger)', boxShadow: 'none'}}>Pagar Ahora</Link>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Atajo a Último Aviso */}
        {myStats.ultimoAviso && (
          <div className="card-alerta brand">
            <p><strong>Último Aviso:</strong> {myStats.ultimoAviso.titulo}</p>
            <Link to="/avisos" className="btn" style={{background: 'var(--brand-2)', boxShadow: 'none'}}>Ver Avisos</Link>
          </div>
        )}

        {/* Resumen de Incidencias */}
        <div className="card">
          <h3 className="section">Mis Incidencias Abiertas ({myStats.misIncidencias.length})</h3>
          <ul className="list-simple">
            {myStats.misIncidencias.length > 0 ? (
              myStats.misIncidencias.map(incidencia => (
                <li key={incidencia.id}>
                  <Link to="/incidencias">
                    <span>{incidencia.titulo}</span>
                    <span className={`badge ${incidencia.estado === 'Nueva' ? 'warn' : ''}`}>{incidencia.estado}</span>
                  </Link>
                </li>
              ))
            ) : (
              <p style={{color: 'var(--muted)', fontSize: 14}}>No tienes incidencias abiertas.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

// --- Componente Reutilizable para Tarjetas de Estadísticas (Admin) ---
function StatCard({ valor, titulo, link, color = 'ok' }) {
  return (
    <Link to={link} className={`stat-card ${color}`}>
      <div className="stat-valor">{valor}</div>
      <div className="stat-titulo">{titulo}</div>
    </Link>
  );
}


// --- Componente Principal ---
export default function Home() {
  const { currentUser } = useApp();
  
  // Renderiza un dashboard u otro basado en el rol
  return currentUser.role === 'admin' ? <AdminDashboard /> : <ResidenteDashboard />;
}