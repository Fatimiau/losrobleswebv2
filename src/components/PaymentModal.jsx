import { useState } from "react";
import { useApp } from "../context/AppContext";
import { toast } from "react-hot-toast";

export default function PaymentModal({ pago, onClose }) {
  const { payPago } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // 1. Simula el tiempo de procesamiento de la pasarela de pago
    setTimeout(() => {
      // 2. Llama a la función real para actualizar la base de datos
      payPago(pago.id);
      
      // 3. Notifica al usuario y cierra el modal
      toast.success(`Pago de ${pago.mes} completado exitosamente.`);
      setIsProcessing(false);
      onClose();
    }, 2000); // 2 segundos de simulación
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="row">
          <h2 className="section">Simulación de Pago</h2>
          <p>Estás a punto de pagar la cuota de **{pago.mes}** por un monto de **${pago.monto.toFixed(2)}**.</p>
          
          <label>Número de Tarjeta (simulado)</label>
          <input className="input" placeholder="4242 4242 4242 4242" required />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label>Vencimiento (MM/AA)</label>
              <input className="input" placeholder="12/28" required />
            </div>
            <div>
              <label>CVC (simulado)</label>
              <input className="input" placeholder="123" required />
            </div>
          </div>
          
          <label>Nombre en la Tarjeta</label>
          <input className="input" placeholder="Fatima Bautista" required />

          <button className="btn" type="submit" disabled={isProcessing} style={{ background: 'var(--ok)' }}>
            {isProcessing ? (
              <div className="spinner-mini"></div> // Muestra el spinner
            ) : (
              `Pagar $${pago.monto.toFixed(2)} ahora`
            )}
          </button>
          <button type="button" className="btn" style={{ background: 'var(--muted)' }} onClick={onClose} disabled={isProcessing}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}