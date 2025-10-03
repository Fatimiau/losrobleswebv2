import { useEffect, useState } from "react";

const STORAGE_KEY = "lr_incidencias";

function loadIncidencias() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function Reportes() {
  const [incidencias, setIncidencias] = useState([]);

  useEffect(() => {
    setIncidencias(loadIncidencias());
  }, []);

  return (
    <div className="card">
      <h2 className="section">Reporte de Incidencias para Mesa Directiva</h2>
      {incidencias.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>
          No hay incidencias registradas para mostrar en el reporte.
        </p>
      ) : (
        <ul className="list">
          {incidencias.map((it) => (
            <li key={it.id} className="item">
              <h4>{it.titulo}</h4>
              <div className="meta">
                <span className="badge">{it.categoria}</span>
                <span
                  className={`badge ${
                    it.estado === "Nueva"
                      ? "warn"
                      : it.estado === "Cerrada"
                      ? "ok"
                      : ""
                  }`}
                >
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