import { useMemo, useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import PaymentModal from "../components/PaymentModal";

// --- Helpers de Fecha y Estado ---
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "dd MMMM yyyy", { locale: es });
};
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  return format(new Date(dateString), "yyyy-MM-dd");
};
const getPaymentStatus = (pago) => {
  const now = new Date();
  const fechaVencimiento = pago.fechaVencimiento ? new Date(pago.fechaVencimiento) : null;

  if (pago.estado === "Pagado") return ["Pagado", "ok"];
  if (pago.estado === "Pagado con retraso") return ["Pagado con retraso", "retraso"];
  if (pago.estado === "Pendiente" && fechaVencimiento && fechaVencimiento < now) {
    return ["Vencido", "vencido"];
  }
  return ["Pendiente", "pendiente"];
};
const initialState = { casa: "", mes: "", monto: 500, fechaVencimiento: "" };

// --- Componente Principal ---
export default function Pagos() {
  const { currentUser, db, createPago, payPago, updatePago, deletePago, addNotificacion } = useApp();
  const isAdmin = currentUser.role === 'admin';

  // --- Estados del Componente ---
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null); // Para el modal del residente
  const [formState, setFormState] = useState(initialState);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ // Para los filtros de admin
    status: "todos",
    house: ""
  });

  // Efecto para llenar el formulario de admin al editar
  useEffect(() => {
    if (editingId) {
      const pagoAEditar = db.pagos.find(p => p.id === editingId);
      if (pagoAEditar) {
        setFormState({
          casa: pagoAEditar.house,
          mes: pagoAEditar.mes,
          monto: pagoAEditar.monto,
          fechaVencimiento: formatDateForInput(pagoAEditar.fechaVencimiento)
        });
      }
    } else {
      setFormState(initialState);
    }
  }, [editingId, db.pagos]);

  // --- Handlers de Formularios y Filtros ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: name === 'monto' ? parseFloat(value) : value
    });
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- Lógica de Pagos (Visibles) ---
  const pagosVisibles = useMemo(() => {
    const pagosOrdenados = (db.pagos || []).sort((a, b) => 
      new Date(b.fechaVencimiento) - new Date(a.fechaVencimiento)
    );
    
    if (!isAdmin) {
      return pagosOrdenados.filter(pago => pago.house === currentUser.house);
    }
    
    const houseTerm = filters.house.toLowerCase();
    return pagosOrdenados.filter(pago => {
      const [statusText] = getPaymentStatus(pago);
      const matchHouse = !houseTerm || pago.house.toLowerCase().includes(houseTerm);
      let matchStatus = true;
      if (filters.status === 'pendientes') matchStatus = statusText === 'Pendiente';
      else if (filters.status === 'vencidos') matchStatus = statusText === 'Vencido';
      else if (filters.status === 'pagados') matchStatus = statusText === 'Pagado' || statusText === 'Pagado con retraso';
      return matchHouse && matchStatus;
    });
  }, [db.pagos, currentUser, isAdmin, filters]);

  // --- Handlers de Acciones ---
  const handleSubmitPago = (e) => {
    e.preventDefault();
    if (!formState.mes || !formState.casa || !formState.fechaVencimiento) {
      toast.error("Por favor completa todos los campos.");
      return;
    }
    
    if (editingId) {
      updatePago(editingId, formState);
      toast.success(`Pago de la casa ${formState.casa} actualizado.`);
      setEditingId(null);
    } else {
      createPago(formState);
      toast.success(`Cuota para la casa ${formState.casa} creada.`);
      
      const userToNotify = (db.users || []).find(u => u.house === formState.casa && u.role === 'residente');
      if (userToNotify) {
        addNotificacion({
          userId: userToNotify.id,
          texto: `Se ha generado una nueva cuota de pago: ${formState.mes} ($${formState.monto}).`,
          link: '/pagos'
        });
      }
    }
    setFormState(initialState);
  };

  const handlePayClick = (pago) => {
    setPagoSeleccionado(pago);
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteClick = (pago) => {
    if (window.confirm(`¿Seguro que quieres eliminar el pago de ${pago.mes} de la casa ${pago.house}?`)) {
      deletePago(pago.id);
      toast.success("Pago eliminado.");
    }
  };

  // --- Renderizado del Componente ---
  return (
    <>
      <div className={`grid ${isAdmin ? 'grid-2' : ''}`}>
        {/* Panel de Admin para Crear/Editar Pagos */}
        {isAdmin && (
          <section className="card">
            <h2 className="section">{editingId ? "Editar Cuota de Pago" : "Crear Nueva Cuota de Pago"}</h2>
            <form onSubmit={handleSubmitPago} className="row">
              <label>Número de Casa</label>
              <input className="input" name="casa" placeholder="Ej. 123" value={formState.casa} onChange={handleFormChange} required />
              <label>Mes a Cobrar</label>
              <input className="input" name="mes" placeholder="Ej. Noviembre" value={formState.mes} onChange={handleFormChange} required />
              <label>Monto</label>
              <input className="input" type="number" name="monto" value={formState.monto} onChange={handleFormChange} required />
              <label>Fecha de Vencimiento</label>
              <input className="input" type="date" name="fechaVencimiento" value={formState.fechaVencimiento} onChange={handleFormChange} required />
              <div style={{display: 'flex', gap: 8, marginTop: 8}}>
                {editingId && (
                  <button type="button" className="btn" style={{background: 'var(--muted)', flex: 1}} onClick={handleCancelEdit}>
                    Cancelar
                  </button>
                )}
                <button className="btn" type="submit" style={{flex: 2}}>
                  {editingId ? "Actualizar Cuota" : "Crear Cuota"}
                </button>
              </div>
            </form>
          </section>
        )}
        
        {/* Panel para ver Pagos (Admin y Residente) */}
        <section className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
            <h2 className="section" style={{ margin: 0 }}>
              {isAdmin ? "Historial de Pagos General" : "Mi Estado de Cuenta"}
            </h2>
            {isAdmin && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <select 
                  name="status"
                  className="select" 
                  value={filters.status}
                  onChange={handleFilterChange}
                  style={{ width: 'auto' }}
                >
                  <option value="todos">Todos los estados</option>
                  <option value="pendientes">Pendientes</option>
                  <option value="vencidos">Vencidos</option>
                  <option value="pagados">Pagados</option>
                </select>
                <input 
                  type="text"
                  name="house"
                  className="input"
                  placeholder="Buscar por casa..."
                  value={filters.house}
                  onChange={handleFilterChange}
                  style={{ width: 'auto', minWidth: 150 }}
                />
              </div>
            )}
          </div>

          <ul className="list">
            {pagosVisibles.length > 0 ? pagosVisibles.map((pago) => {
              const [statusText, statusClass] = getPaymentStatus(pago);
              
              return (
                <li key={pago.id} className="item">
                  <div>
                    <h4>Mantenimiento {pago.mes} {isAdmin && `(Casa ${pago.house})`}</h4>
                    <div className="meta">
                      <span className={`badge ${statusClass}`}>{statusText}</span>
                      <span>${Number(pago.monto).toFixed(2)}</span>
                    </div>
                    <div className="meta" style={{fontSize: 11}}>
                      <span>Vencimiento: {formatDate(pago.fechaVencimiento)}</span>
                      {pago.fechaPago && <span>Pagado: {formatDate(pago.fechaPago)}</span>}
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: 8, marginTop: 12}}>
                    {!isAdmin && (statusClass === 'pendiente' || statusClass === 'vencido') && (
                      <button className="btn" onClick={() => handlePayClick(pago)} style={{ background: 'var(--ok)' }}>
                        Pagar
                      </button>
                    )}
                    {isAdmin && (
                      <>
                        <button className="btn" onClick={() => setEditingId(pago.id)} style={{background: 'var(--warn)', color: '#fff'}}>
                          Editar
                        </button>
                        <button className="btn" onClick={() => handleDeleteClick(pago)} style={{background: 'var(--danger)'}}>
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            }) : (
              <p style={{ color: 'var(--muted)' }}>
                {isAdmin ? "No se encontraron pagos que coincidan con los filtros." : "No hay pagos para mostrar."}
              </p>
            )}
          </ul>
        </section>
      </div>

      {/* Renderizado del Modal de Pago (para residentes) */}
      {pagoSeleccionado && (
        <PaymentModal 
          pago={pagoSeleccionado}
          onClose={() => setPagoSeleccionado(null)}
        />
      )}
    </>
  );
}