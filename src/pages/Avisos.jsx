import { useApp } from "../context/AppContext";
import { toast } from "react-hot-toast";

export default function Avisos() {
  const { currentUser, db, addAviso, addNotificacion } = useApp();
  const isAdmin = currentUser.role === 'admin';

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const titulo = formData.get("titulo").trim();
    const detalle = formData.get("detalle").trim();

    if (!titulo) return;

    // 1. Usamos la función correcta addAviso (antes fallaba con setDb)
    addAviso({
      titulo,
      detalle,
      userId: currentUser.id, // Guardamos quién lo creó
    });
    
    // 2. Feedback visual con Toast
    toast.success("¡Aviso publicado exitosamente!");

    // 3. Notificar a todos los residentes
    const residentes = (db.users || []).filter(u => u.role === 'residente');
    residentes.forEach(res => {
      addNotificacion({
        userId: res.id,
        texto: `Nuevo aviso de la administración: "${titulo}"`,
        link: '/avisos'
      });
    });

    e.target.reset(); // Limpia el formulario
  };

  return (
    <div className={`grid ${isAdmin ? 'grid-2' : ''}`}>
      {/* El formulario SOLO se muestra si es Admin */}
      {isAdmin && (
        <section className="card">
          <h2 className="section">Publicar Nuevo Aviso</h2>
          <form onSubmit={handleSubmit} className="row">
            <input
              className="input"
              name="titulo"
              placeholder="Título del aviso"
              required
            />
            <textarea
              name="detalle"
              rows={4}
              placeholder="Detalle del comunicado..."
            />
            <button className="btn" type="submit">
              Publicar Aviso
            </button>
          </form>
        </section>
      )}

      {/* La lista de avisos la ven todos */}
      <section className="card">
        <h2 className="section">Avisos Recientes</h2>
        {(db.avisos || []).length === 0 ? (
          <p style={{ color: "var(--muted)", marginTop: 12 }}>No hay avisos publicados.</p>
        ) : (
          <ul className="list">
            {(db.avisos || []).map((aviso) => (
              <li key={aviso.id} className="item">
                <h4>{aviso.titulo}</h4>
                <p>{aviso.detalle}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}