import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const categorias = ["Agua", "Electricidad", "Seguridad", "Áreas comunes", "Otros"];
const estados = ["Nueva", "En progreso", "Cerrada"];

// --- Componente de Comentarios ---
function Comentarios({ incidenciaId }) {
  const { currentUser, db, setDb } = useApp();
  const [texto, setTexto] = useState("");

  const comentarios = useMemo(() => {
    return db.comentarios
      .filter(c => c.parentId === incidenciaId)
      .sort((a, b) => a.creado - b.creado);
  }, [db.comentarios, incidenciaId]);

  const findUserName = (userId) => db.users.find(u => u.id === userId)?.name || "Desconocido";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    const nuevoComentario = {
      id: crypto.randomUUID(),
      texto: texto.trim(),
      parentId: incidenciaId,
      userId: currentUser.id,
      creado: Date.now(),
    };
    setDb(prev => ({ ...prev, comentarios: [...prev.comentarios, nuevoComentario] }));
    setTexto("");
  };

  return (
    <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12 }}>
      <h6>Comentarios ({comentarios.length})</h6>
      <div style={{display: 'grid', gap: 8, maxHeight: 150, overflowY: 'auto', marginBottom: 12}}>
        {comentarios.map(com => (
          <div key={com.id}>
            <p style={{fontSize: 13, margin: 0}}><strong>{findUserName(com.userId)}:</strong> {com.texto}</p>
            <span style={{fontSize: 11, color: 'var(--muted)'}}>hace {formatDistanceToNow(new Date(com.creado), { locale: es })}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{display: 'flex', gap: 8}}>
        <input className="input" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe un comentario..." />
        <button className="btn" type="submit">Enviar</button>
      </form>
    </div>
  );
}

// --- Componente Principal ---
export default function Incidencias() {
  const { currentUser, db, setDb } = useApp();
  const [form, setForm] = useState({ titulo: "", categoria: "", detalle: "" });
  const [filtro, setFiltro] = useState({ estado: "", categoria: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    const nuevo = {
      id: crypto.randomUUID(),
      titulo: form.titulo.trim(),
      categoria: form.categoria || "Otros",
      detalle: form.detalle.trim(),
      estado: "Nueva",
      creado: Date.now(),
      userId: currentUser.id,
      house: currentUser.house,
    };
    setDb((prevDb) => ({
      ...prevDb,
      incidencias: [nuevo, ...prevDb.incidencias],
    }));
    setForm({ titulo: "", categoria: "", detalle: "" });
  };

  const cambiarEstado = (id) => {
    setDb((prevDb) => ({
      ...prevDb,
      incidencias: prevDb.incidencias.map((it) =>
        it.id === id ? { ...it, estado: it.estado === "Nueva" ? "En progreso" : it.estado === "En progreso" ? "Cerrada" : "Nueva" } : it
      ),
    }));
  };

  const filtrados = useMemo(() =>
      db.incidencias.filter((it) =>
          (!filtro.estado || it.estado === filtro.estado) &&
          (!filtro.categoria || it.categoria === filtro.categoria)
      ).sort((a, b) => b.creado - a.creado), // Ordenar por más reciente
    [db.incidencias, filtro]
  );
  
  const findUserName = (userId) => {
    const user = db.users.find(u => u.id === userId);
    return user ? `${user.name} (Casa ${user.house})` : "Desconocido";
  }

  return (
    <div className="grid grid-2">
      <section className="card">
        <h2 className="section">Registrar Nueva Incidencia</h2>
        <form onSubmit={onSubmit} className="row">
          <input className="input" name="titulo" placeholder="Título (ej. Fuga de agua)" value={form.titulo} onChange={onChange} required />
          <select className="select" name="categoria" value={form.categoria} onChange={onChange} required>
            <option value="">Selecciona una categoría</option>
            {categorias.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
          <textarea name="detalle" rows={4} placeholder="Describe brevemente la incidencia…" value={form.detalle} onChange={onChange} />
          <button className="btn" type="submit">Guardar Incidencia</button>
        </form>
      </section>

      <section className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <h2 className="section" style={{ margin: 0 }}>Incidencias Registradas</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <select className="select" value={filtro.estado} onChange={(e) => setFiltro({ ...filtro, estado: e.target.value })}>
              <option value="">Estado: Todos</option>
              {estados.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
        </div>

        {filtrados.length === 0 ? (
          <p style={{ color: "var(--muted)", marginTop: 12 }}>No hay incidencias registradas.</p>
        ) : (
          <ul className="list">
            {filtrados.map((it) => (
              <li key={it.id} className="item">
                <h4>{it.titulo}</h4>
                <div className="meta">
                  <span className="badge" style={{background: 'var(--brand-2)'}}>
                    Reporta: {findUserName(it.userId)}
                  </span>
                </div>
                <div className="meta">
                  <span className="badge">{it.categoria}</span>
                  <span className={`badge ${it.estado === "Nueva" ? "warn" : it.estado === "Cerrada" ? "ok" : ""}`}>{it.estado}</span>
                  <span>hace {formatDistanceToNow(new Date(it.creado), { locale: es })}</span>
                </div>
                {it.detalle && <p style={{ marginTop: 8 }}>{it.detalle}</p>}
                {currentUser.role === 'admin' && (
                  <div style={{ marginTop: 10 }}>
                    <button className="btn" onClick={() => cambiarEstado(it.id)}>Cambiar estado</button>
                  </div>
                )}
                <Comentarios incidenciaId={it.id} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}