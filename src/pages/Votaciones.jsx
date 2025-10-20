import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";

export default function Votaciones() {
  const { currentUser, db, createVotacion, castVote } = useApp();
  const isAdmin = currentUser.role === 'admin';
  const [opciones, setOpciones] = useState(["", ""]);

  const misVotos = useMemo(() => {
    return new Set((db.votos || []).filter(v => v.userId === currentUser.id).map(v => v.votacionId));
  }, [db.votos, currentUser.id]);

  const handleAddOption = () => setOpciones([...opciones, ""]);
  const handleOptionChange = (index, value) => {
    const nuevasOpciones = [...opciones];
    nuevasOpciones[index] = value;
    setOpciones(nuevasOpciones);
  };

  const handleCreateVotacion = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pregunta = formData.get("pregunta").trim();
    const opcionesFiltradas = opciones.map(o => o.trim()).filter(Boolean);
    if (!pregunta || opcionesFiltradas.length < 2) {
      alert("La pregunta y al menos dos opciones son obligatorias.");
      return;
    }
    createVotacion({ pregunta, opciones: opcionesFiltradas.map(texto => ({texto})) });
    e.target.reset();
    setOpciones(["", ""]);
    alert("Votación creada con éxito.");
  };

  const getResultados = (votacionId) => {
    const resultados = {};
    (db.votos || []).filter(v => v.votacionId === votacionId).forEach(voto => {
      resultados[voto.optionId] = (resultados[voto.optionId] || 0) + 1;
    });
    return resultados;
  };

  // --- CRITICAL FIX IS HERE ---
  // We use `(db.votaciones || [])` to ensure we always have an array to filter,
  // even if the key doesn't exist in localStorage.
  const votacionesActivas = (db.votaciones || []).filter(v => v.activa);

  return (
    <div className={`grid ${isAdmin ? 'grid-2' : ''}`}>
      {isAdmin && (
        <section className="card">
          <h2 className="section">Crear Nueva Votación</h2>
          <form onSubmit={handleCreateVotacion} className="row">
            <input name="pregunta" className="input" placeholder="Pregunta de la votación..." required />
            <label>Opciones:</label>
            {opciones.map((opcion, index) => (
              <input key={index} className="input" value={opcion} onChange={(e) => handleOptionChange(index, e.target.value)} placeholder={`Opción ${index + 1}`} />
            ))}
            <button type="button" className="btn" style={{background: 'var(--muted)'}} onClick={handleAddOption}>Añadir Opción</button>
            <button type="submit" className="btn">Crear Votación</button>
          </form>
        </section>
      )}
      <section className="card">
        <h2 className="section">Votaciones Activas</h2>
        <ul className="list">
          {votacionesActivas.map(votacion => {
            const yaVoto = misVotos.has(votacion.id);
            const resultados = getResultados(votacion.id);
            return (
              <li key={votacion.id} className="item">
                <h4>{votacion.pregunta}</h4>
                {yaVoto ? (
                  <div>
                    <p><strong>Resultados:</strong></p>
                    {votacion.opciones.map(op => (
                      <p key={op.id} style={{fontSize: 14, margin: '4px 0'}}>
                        {op.texto}: {resultados[op.id] || 0} votos
                      </p>
                    ))}
                  </div>
                ) : (
                  <div style={{display: 'flex', gap: 8, marginTop: 12}}>
                    {votacion.opciones.map(op => (
                      <button key={op.id} className="btn" onClick={() => castVote(votacion.id, op.id)}>
                        {op.texto}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  );
}