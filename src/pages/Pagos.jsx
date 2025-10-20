import { useMemo } from "react";
import { useApp } from "../context/AppContext";

export default function Pagos() {
  const { currentUser, db, createPago, payPago } = useApp();
  const isAdmin = currentUser.role === 'admin';

  const pagosVisibles = useMemo(() => {
    const pagosOrdenados = db.pagos.sort((a,b) => a.mes.localeCompare(b.mes));
    if (isAdmin) return pagosOrdenados;
    return pagosOrdenados.filter(pago => pago.house === currentUser.house);
  }, [db.pagos, currentUser, isAdmin]);

  const handleRegisterPayment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      mes: formData.get("mes").trim(),
      house: formData.get("casa").trim(),
    };
    if (!data.mes || !data.house) return;
    createPago(data);
    e.target.reset();
    alert(`Cuota para la casa ${data.house} creada exitosamente.`);
  };

  return (
    <div className={`grid ${isAdmin ? 'grid-2' : ''}`}>
      {isAdmin && (
        <section className="card">
          <h2 className="section">Crear Nueva Cuota de Pago</h2>
          <form onSubmit={handleRegisterPayment} className="row">
            <input className="input" name="casa" placeholder="Número de Casa (ej. 123)" required />
            <input className="input" name="mes" placeholder="Mes a Cobrar (ej. Noviembre)" required />
            <button className="btn" type="submit">Crear Cuota</button>
          </form>
        </section>
      )}
      <section className="card">
        <h2 className="section">{isAdmin ? "Historial de Pagos General" : "Mi Estado de Cuenta"}</h2>
        <ul className="list">
          {pagosVisibles.length > 0 ? pagosVisibles.map((pago) => (
            <li key={pago.id} className="item">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <h4>Mantenimiento {pago.mes} {isAdmin && `(Casa ${pago.house})`}</h4>
                  <div className="meta">
                    <span className={`badge ${pago.estado === 'Pagado' ? 'ok' : 'warn'}`}>{pago.estado}</span>
                    <span>${pago.monto.toFixed(2)}</span>
                  </div>
                </div>
                {!isAdmin && pago.estado === 'Pendiente' && (
                  <button className="btn" onClick={() => payPago(pago.id)} style={{background: 'var(--ok)'}}>Pagar</button>
                )}
              </div>
            </li>
          )) : <p style={{color: 'var(--muted)'}}>No hay pagos para mostrar.</p>}
        </ul>
      </section>
    </div>
  );
}