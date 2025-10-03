export default function Home() {
  return (
    <div className="card">
      <h2 className="section">Bienvenido</h2>
      <p>
        Esta es la plataforma de gestión para{" "}
        <strong>Residencial Los Robles</strong>. Desde aquí podrás registrar
        incidencias, consultar pagos y revisar avisos.
      </p>
      <div className="meta" style={{ marginTop: 12 }}>
        <span className="badge ok">Sprint 1 Terminado</span>
        <span className="badge">MVP</span>
      </div>
    </div>
  );
}