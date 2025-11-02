import { useApp } from "../context/AppContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Helper para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "dd MMMM yyyy", { locale: es });
};

// Helper para obtener el nombre del admin (quien subió el doc)
function findUploaderName(db, userId) {
  const user = (db.users || []).find(u => u.id === userId);
  return user ? user.name : "Administración";
}

export default function Documentos() {
  const { db } = useApp();

  const documentosOrdenados = (db.documentos || []).sort((a, b) => b.creado - a.creado);

  return (
    <div className="card">
      <h2 className="section">Documentos Importantes</h2>
      <p>Aquí encontrarás reglamentos, actas de asamblea y otros documentos de interés para la comunidad.</p>
      
      <ul className="list">
        {documentosOrdenados.length > 0 ? documentosOrdenados.map((doc) => (
          <li key={doc.id} className="item">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <h4 style={{fontSize: 16}}>{doc.titulo}</h4>
                <div className="meta" style={{fontSize: 11}}>
                  <span>Subido por: {findUploaderName(db, doc.userId)}</span>
                  <span>Fecha: {formatDate(doc.creado)}</span>
                </div>
              </div>
              
              {/* El atributo 'download' le dice al navegador que descargue el archivo con el nombre original */}
              <a 
                href={doc.dataBase64} 
                download={doc.fileName}
                className="btn" 
                style={{textDecoration: 'none'}}
              >
                Descargar PDF
              </a>
            </div>
          </li>
        )) : (
          <p style={{ color: 'var(--muted)' }}>No hay documentos disponibles en este momento.</p>
        )}
      </ul>
    </div>
  );
}