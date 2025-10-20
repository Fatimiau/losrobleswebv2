import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";

export default function AdminUsuarios() {
  const { db, deleteUser } = useApp();

  const handleDelete = (userId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar a este usuario? Esta acción no se puede deshacer.")) {
      deleteUser(userId);
    }
  };

  return (
    <div className="card">
      <h2 className="section">Administración de Usuarios</h2>
      <ul className="list">
        {db.users.map(user => (
          <li key={user.id} className="item">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
              <div>
                <h4>
                  {user.name} 
                  {user.role === 'admin' && <span className="badge ok" style={{marginLeft: 8}}>Admin</span>}
                </h4>
                <div className="meta">
                  <span>{user.email}</span>
                  <span>Casa: {user.house}</span>
                </div>
              </div>

              {/* Action buttons only appear for non-admin users */}
              {user.role !== 'admin' && (
                <div style={{display: 'flex', gap: 8}}>
                  <Link to={`/admin/usuarios/${user.id}/editar`} className="btn" style={{background: 'var(--warn)', textDecoration: 'none', color: '#fff'}}>
                    Editar
                  </Link>
                  <button className="btn" style={{background: 'var(--danger)'}} onClick={() => handleDelete(user.id)}>
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}