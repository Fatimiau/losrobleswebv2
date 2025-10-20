import { useApp } from "../context/AppContext"; // <-- CAMBIO

export default function Reportes() {
  const { db } = useApp(); // <-- CAMBIO: Obtenemos la db del contexto

  // --- CAMBIO: Función para encontrar el nombre del autor ---
  const findUserName = (userId) => {
    const user = db.users.find(u => u.id === userId);
    return user ? `${user.name} (Casa ${user.house})` : "Desconocido";
  }

  return (
    <div className="card">
      <h2 className="section">Reporte de Incidencias para Mesa Directiva</h2>
      {db.incidencias.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>
          No hay incidencias registradas para mostrar en el reporte.
        </p>
      ) : (
        <ul className="list">
          {db.incidencias.map((it) => (
            <li key={it.id} className="item">
              <h4>{it.titulo}</h4>
               {/* --- CAMBIO: Mostramos el autor de la incidencia --- */}
              <div className="meta">
                <span className="badge" style={{background: 'var(--brand-2)'}}>
                  Reporta: {findUserName(it.userId)}
                </span>
              </div>
              <div className="meta">
                <span className="badge">{it.categoria}</span>
                <span className={`badge ${ it.estado === "Nueva" ? "warn" : it.estado === "Cerrada" ? "ok" : "" }`}>
                  {it.estado}
                </span>
                <span>{new Date(it.creado).toLocaleString()}</span>
              </div>
              {it.detalle && <p style={{ marginTop: 8 }}>{it.detalle}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}