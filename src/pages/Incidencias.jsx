import { useMemo, useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import EmojiPicker, { Theme } from "emoji-picker-react";
import { toast } from "react-hot-toast";

const categorias = ["Agua", "Electricidad", "Seguridad", "Áreas comunes", "Otros"];
const estados = ["Nueva", "En progreso", "Cerrada"];

const toBase64 = (file) => new Promise((resolve, reject) => {
  if (file.size > 1024 * 1024) { 
    reject(new Error("La imagen es muy grande. El límite es 1MB."));
  }
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

// --- Componente de Comentarios (Actualizado para Notificaciones) ---
function Comentarios({ incidenciaId, incidenciaAutorId, incidenciaTitulo }) {
  const { currentUser, db, addComentario, addNotificacion } = useApp();
  const [texto, setTexto] = useState("");
  const [imagen, setImagen] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const fileInputRef = useRef(null);

  const comentarios = useMemo(() => {
    return (db.comentarios || [])
      .filter(c => c.parentId === incidenciaId)
      .sort((a, b) => a.creado - b.creado);
  }, [db.comentarios, incidenciaId]);

  const findUserName = (userId) => db.users.find(u => u.id === userId)?.name || "Desconocido";

  const onEmojiClick = (emojiObject) => {
    setTexto(prev => prev + emojiObject.emoji);
    setShowPicker(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image")) return toast.error("Por favor, selecciona solo archivos de imagen.");
    try {
      const base64 = await toBase64(file);
      setImagen(base64);
    } catch (error) {
      toast.error(error.message);
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!texto.trim() && !imagen) return;

    addComentario({
      texto: texto.trim(),
      imagenBase64: imagen,
      parentId: incidenciaId,
      userId: currentUser.id,
    });
    
    // --- LÓGICA DE NOTIFICACIÓN DE COMENTARIO ---
    // Si el que comenta es admin, notificamos al autor de la incidencia
    if (currentUser.role === 'admin' && incidenciaAutorId !== currentUser.id) {
      addNotificacion({
        userId: incidenciaAutorId,
        texto: `La Mesa Directiva ha comentado en tu incidencia: "${incidenciaTitulo}"`,
        link: '/incidencias'
      });
    }
    // Si el que comenta es residente, notificamos al admin
    else if (currentUser.role === 'residente') {
      const admin = (db.users || []).find(u => u.role === 'admin');
      if (admin) {
        addNotificacion({
          userId: admin.id,
          texto: `${currentUser.name} (Casa ${currentUser.house}) comentó en: "${incidenciaTitulo}"`,
          link: '/incidencias'
        });
      }
    }
    
    setTexto("");
    setImagen(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12 }}>
      <h6>Comentarios ({comentarios.length})</h6>
      <div style={{display: 'grid', gap: 8, maxHeight: 150, overflowY: 'auto', marginBottom: 12}}>
        {comentarios.map(com => (
          <div key={com.id}>
            <p style={{fontSize: 13, margin: 0}}><strong>{findUserName(com.userId)}:</strong> {com.texto}</p>
            {com.imagenBase64 && (
              <img src={com.imagenBase64} alt="Adjunto" style={{ maxHeight: 100, borderRadius: 8, marginTop: 4 }} />
            )}
            <span style={{fontSize: 11, color: 'var(--muted)'}}>hace {formatDistanceToNow(new Date(com.creado), { locale: es })}</span>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
          <input className="input" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe un comentario..." />
          <button type="button" className="btn-icon" onClick={() => fileInputRef.current.click()}>📷</button>
          <button type="button" className="btn-icon" onClick={() => setShowPicker(val => !val)}>😊</button>
          <button className="btn" type="submit" style={{padding: '10px 12px'}}>Enviar</button>
          {showPicker && (
            <div style={{ position: 'absolute', bottom: '50px', right: 0, zIndex: 10 }}>
              <EmojiPicker onEmojiClick={onEmojiClick} theme={Theme.DARK} />
            </div>
          )}
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
        {imagen && (
          <div style={{ position: 'relative', marginTop: 8 }}>
            <img src={imagen} alt="Preview" style={{ maxHeight: 60, borderRadius: 8 }} />
            <button type="button" className="btn-icon-delete" onClick={() => { setImagen(null); fileInputRef.current.value = ""; }}>&times;</button>
          </div>
        )}
      </form>
    </div>
  );
}

// --- Componente Principal ---
export default function Incidencias() {
  const { currentUser, db, addIncidencia, updateIncidenciaState, deleteIncidencia, addNotificacion } = useApp();
  
  const [form, setForm] = useState({ titulo: "", categoria: "", detalle: "" });
  const [imagen, setImagen] = useState(null);
  const [filtro, setFiltro] = useState({ estado: "", categoria: "" });
  const fileInputRefIncidencia = useRef(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChangeIncidencia = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image")) return toast.error("Por favor, selecciona solo archivos de imagen.");
    try {
      const base64 = await toBase64(file);
      setImagen(base64);
    } catch (error) {
      toast.error(error.message);
      fileInputRefIncidencia.current.value = "";
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    
    const tituloIncidencia = form.titulo.trim();
    addIncidencia({
      titulo: tituloIncidencia,
      categoria: form.categoria || "Otros",
      detalle: form.detalle.trim(),
      imagenBase64: imagen,
      userId: currentUser.id,
      house: currentUser.house,
    });
    
    // --- LÓGICA DE NOTIFICACIÓN DE INCIDENCIA ---
    const admin = (db.users || []).find(u => u.role === 'admin');
    if (admin) {
      addNotificacion({
        userId: admin.id,
        texto: `Nueva incidencia de ${currentUser.name} (Casa ${currentUser.house}): "${tituloIncidencia}"`,
        link: '/incidencias'
      });
    }
    
    setForm({ titulo: "", categoria: "", detalle: "" });
    setImagen(null);
    if (fileInputRefIncidencia.current) fileInputRefIncidencia.current.value = "";
    toast.success("Incidencia registrada con éxito.");
  };

  const cambiarEstado = (id) => {
    updateIncidenciaState(id);
  };
  
  const handleDelete = (incidencia) => {
    if (window.confirm(`¿Seguro que quieres eliminar la incidencia "${incidencia.titulo}"? Esta acción no se puede deshacer y borrará todos sus comentarios.`)) {
      deleteIncidencia(incidencia.id);
    }
  };

  const filtrados = useMemo(() =>
      (db.incidencias || []).filter((it) =>
          (!filtro.estado || it.estado === filtro.estado) &&
          (!filtro.categoria || it.categoria === filtro.categoria)
      ).sort((a, b) => b.creado - a.creado),
    [db.incidencias, filtro]
  );
  
  const findUserName = (userId) => {
    const user = (db.users || []).find(u => u.id === userId);
    return user ? `${user.name} (Casa ${user.house})` : "Desconocido";
  }

  return (
    <div className="grid grid-2">
      {/* --- ESTE ES EL FORMULARIO QUE FALTABA --- */}
      <section className="card">
        <h2 className="section">Registrar Nueva Incidencia</h2>
        <form onSubmit={onSubmit} className="row">
          <input className="input" name="titulo" placeholder="Título (ej. Fuga de agua)" value={form.titulo} onChange={onChange} required />
          <select className="select" name="categoria" value={form.categoria} onChange={onChange} required>
            <option value="">Selecciona una categoría</option>
            {categorias.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
          <textarea name="detalle" rows={4} placeholder="Describe brevemente la incidencia…" value={form.detalle} onChange={onChange} />
          
          <label>Adjuntar Imagen (Opcional, max 1MB)</label>
          <input 
            type="file" 
            className="input" 
            ref={fileInputRefIncidencia} 
            onChange={handleFileChangeIncidencia}
            accept="image/*"
          />
          
          {imagen && (
            <div style={{ position: 'relative', marginTop: 0 }}>
              <img src={imagen} alt="Preview" style={{ maxHeight: 100, borderRadius: 8 }} />
              <button type="button" className="btn-icon-delete" onClick={() => { setImagen(null); fileInputRefIncidencia.current.value = ""; }}>&times;</button>
            </div>
          )}

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
                
                {it.imagenBase64 && (
                  <img src={it.imagenBase64} alt="Adjunto" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />
                )}

                {/* --- AQUÍ ESTÁN LOS BOTONES RESTAURADOS --- */}
                {currentUser.role === 'admin' && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button className="btn" onClick={() => cambiarEstado(it.id)}>
                      Cambiar estado
                    </button>
                    <button className="btn" onClick={() => handleDelete(it)} style={{background: 'var(--danger)'}}>
                      Eliminar
                    </button>
                  </div>
                )}
                
                {/* Pasamos los props necesarios a Comentarios */}
                <Comentarios 
                  incidenciaId={it.id} 
                  incidenciaAutorId={it.userId} 
                  incidenciaTitulo={it.titulo} 
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}