import { useState, useMemo } from "react"; // 1. Importar useState y useMemo
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";

export default function AdminUsuarios() {
  const { db, deleteUser } = useApp();
  // 2. Nuevo estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (userId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar a este usuario? Esta acción no se puede deshacer.")) {
      deleteUser(userId);
    }
  };

  // 3. Lógica de filtrado
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return db.users; // Si no hay búsqueda, muestra todos

    return (db.users || []).filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.house.toLowerCase().includes(term)
    );
  }, [db.users, searchTerm]);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
        <h2 className="section" style={{ margin: 0 }}>Administración de Usuarios</h2>
        
        {/* 4. Barra de búsqueda */}
        <input 
          type="text"
          className="input"
          placeholder="Buscar por nombre, email o casa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 300 }}
        />
      </div>

      <ul className="list">
        {/* 5. Mapeamos sobre los usuarios filtrados */}
        {filteredUsers.length > 0 ? filteredUsers.map(user => (
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
        )) : (
          <p style={{ color: "var(--muted)" }}>No se encontraron usuarios que coincidan con la búsqueda.</p>
        )}
      </ul>
    </div>
  );
}