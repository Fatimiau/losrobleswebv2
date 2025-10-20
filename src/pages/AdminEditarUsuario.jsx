import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function AdminEditarUsuario() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { db, updateUser } = useApp();
  
  const userToEdit = db.users.find(u => u.id === userId);

  if (!userToEdit) {
    return <div className="card"><p>Usuario no encontrado.</p></div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      house: formData.get("house"),
    };
    updateUser(userId, data);
    navigate("/admin/usuarios"); // Regresa a la lista de usuarios
  };

  return (
    <div className="card" style={{maxWidth: 500, margin: '0 auto'}}>
      <h2 className="section">Editando Perfil de: {userToEdit.name}</h2>
      <form onSubmit={handleSubmit} className="row">
        <label>Nombre Completo</label>
        <input className="input" name="name" defaultValue={userToEdit.name} required />
        <label>Correo Electrónico</label>
        <input className="input" type="email" name="email" defaultValue={userToEdit.email} required />
        <label>Número de Casa</label>
        <input className="input" name="house" defaultValue={userToEdit.house} required />
        <div style={{display: 'flex', gap: 8}}>
          <button type="button" className="btn" style={{background: 'var(--muted)'}} onClick={() => navigate("/admin/usuarios")}>Cancelar</button>
          <button type="submit" className="btn">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}