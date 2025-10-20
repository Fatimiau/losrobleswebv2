import { useApp } from "../context/AppContext";

export default function MiCuenta() {
  const { currentUser, updateUser } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
    };
    if (formData.get("password")) {
      data.password = formData.get("password");
    }
    updateUser(currentUser.id, data);
  };

  return (
    <div className="card" style={{maxWidth: 500, margin: '0 auto'}}>
      <h2 className="section">Mi Perfil</h2>
      <form onSubmit={handleSubmit} className="row">
        <label>Nombre Completo</label>
        <input className="input" name="name" defaultValue={currentUser.name} required />

        <label>Correo Electrónico</label>
        <input className="input" type="email" name="email" defaultValue={currentUser.email} required />

        <label>Número de Casa</label>
        <input className="input" value={currentUser.house} disabled />
        
        <label>Nueva Contraseña (dejar en blanco para no cambiar)</label>
        <input className="input" type="password" name="password" placeholder="••••••••" />

        <button type="submit" className="btn">Actualizar Información</button>
      </form>
    </div>
  );
}