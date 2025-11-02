import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';

// Estilos para el menú. Los ponemos aquí para no tener que pedirte el index.css
const menuStyles = {
  position: 'absolute',
  top: '60px', // Justo debajo del header
  right: '0',
  width: '380px',
  maxWidth: '90vw',
  maxHeight: '400px',
  overflowY: 'auto',
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
  zIndex: 1001,
};

const itemStyles = {
  padding: '12px 16px',
  borderBottom: '1px solid var(--border)',
  textDecoration: 'none',
  display: 'block',
  color: 'var(--text)',
};

const itemUnreadStyles = {
  background: 'rgba(59, 130, 246, 0.1)',
};

export default function NotificacionesMenu({ onClose }) {
  const { currentUser, db, markNotificacionesAsLeidas } = useApp();

  // Obtenemos solo las notificaciones del usuario actual y las ordenamos
  const notificaciones = useMemo(() => {
    return (db.notificaciones || [])
      .filter(n => n.userId === currentUser.id)
      .sort((a, b) => b.creado - a.creado); // Más reciente primero
  }, [db.notificaciones, currentUser.id]);

  const handleMarkAsRead = () => {
    markNotificacionesAsLeidas(currentUser.id);
  };

  return (
    <div style={menuStyles}>
      <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>Notificaciones</h3>
        <button 
          className="btn" 
          style={{ fontSize: 12, padding: '4px 8px', boxShadow: 'none' }}
          onClick={handleMarkAsRead}
        >
          Marcar todo como leído
        </button>
      </div>
      {notificaciones.length === 0 ? (
        <p style={{ padding: '16px', color: 'var(--muted)', margin: 0, textAlign: 'center' }}>
          No tienes notificaciones nuevas.
        </p>
      ) : (
        <div>
          {notificaciones.map(n => (
            <Link 
              key={n.id} 
              to={n.link || "/"}
              style={{...itemStyles, ...(n.leida ? {} : itemUnreadStyles)}}
              onClick={onClose} // Cierra el menú al hacer clic
            >
              <p style={{ margin: 0, fontSize: 14 }}>{n.texto}</p>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                hace {formatDistanceToNow(new Date(n.creado), { locale: es })}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}