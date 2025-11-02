import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Helper para convertir archivos a Base64
// Límite de 5MB para PDFs
const toBase64 = (file) => new Promise((resolve, reject) => {
  if (file.size > 5 * 1024 * 1024) { 
    reject(new Error("El archivo es muy grande. El límite es 5MB."));
  }
  if (file.type !== "application/pdf") {
    reject(new Error("Formato inválido. Solo se permiten archivos PDF."));
  }
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve({ data: reader.result, name: file.name });
  reader.onerror = error => reject(error);
});

// Helper para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
};

// Estado inicial del formulario
const initialState = { titulo: "", file: null, dataBase64: "", fileName: "" };

export default function AdminDocumentos() {
  // --- 1. Obtenemos 'updateDocumento' y 'db' ---
  const { currentUser, db, addDocumento, deleteDocumento, updateDocumento } = useApp();
  
  const [formState, setFormState] = useState(initialState);
  const [isUploading, setIsUploading] = useState(false);
  
  // --- 2. Nuevo estado para manejar la edición ---
  const [editingId, setEditingId] = useState(null);

  const documentosOrdenados = (db.documentos || []).sort((a, b) => b.creado - a.creado);

  // --- 3. Efecto para rellenar el formulario al editar ---
  useEffect(() => {
    if (editingId) {
      const docToEdit = db.documentos.find(d => d.id === editingId);
      if (docToEdit) {
        setFormState({
          titulo: docToEdit.titulo,
          file: null, // No rellenamos el archivo
          dataBase64: docToEdit.dataBase64, // Conservamos el Base64 original
          fileName: docToEdit.fileName,
        });
        toast.success(`Editando: ${docToEdit.titulo}. Adjunta un nuevo PDF solo si deseas reemplazarlo.`);
      }
    } else {
      setFormState(initialState); // Resetear al estado inicial
    }
  }, [editingId, db.documentos]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { data, name } = await toBase64(file);
      setFormState(prev => ({
        ...prev,
        file: file,
        dataBase64: data, // Nuevo Base64 listo para guardar
        fileName: name
      }));
      toast.success("Nuevo PDF cargado. Listo para guardar.");
    } catch (error) {
      toast.error(error.message);
      e.target.value = "";
    }
    setIsUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.titulo.trim()) {
      toast.error("Por favor, añade un título.");
      return;
    }

    // --- 4. Lógica de Creación vs Edición ---
    if (editingId) {
      // Modo Edición
      const docOriginal = db.documentos.find(d => d.id === editingId);
      if (!docOriginal) return; // Seguridad
      
      const updatedData = {
        titulo: formState.titulo,
        // Si no se seleccionó un archivo nuevo (formState.file es null),
        // mantenemos el fileName y dataBase64 originales.
        fileName: formState.file ? formState.fileName : docOriginal.fileName,
        dataBase64: formState.file ? formState.dataBase64 : docOriginal.dataBase64,
        userId: currentUser.id, // Actualizamos el 'dueño' por si acaso
      };
      updateDocumento(editingId, updatedData);
      setEditingId(null);
    } else {
      // Modo Creación
      if (!formState.dataBase64) {
        toast.error("Por favor, selecciona un archivo PDF.");
        return;
      }
      addDocumento({
        titulo: formState.titulo,
        fileName: formState.fileName,
        dataBase64: formState.dataBase64,
        userId: currentUser.id,
      });
    }
    
    // Resetear formulario
    setFormState(initialState);
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = "";
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (doc) => {
    if (window.confirm(`¿Seguro que quieres eliminar el documento "${doc.titulo}"?`)) {
      deleteDocumento(doc.id);
    }
  };

  return (
    <div className="grid grid-2">
      <section className="card">
        {/* 5. Título y botón dinámicos */}
        <h2 className="section">{editingId ? "Editar Documento" : "Subir Nuevo Documento"}</h2>
        <form onSubmit={handleSubmit} className="row">
          <label>Título del Documento</label>
          <input 
            className="input" 
            name="titulo" 
            placeholder="Ej. Reglamento de la Piscina" 
            value={formState.titulo}
            onChange={(e) => setFormState(prev => ({...prev, titulo: e.target.value}))}
            required 
          />
          
          <label>{editingId ? "Reemplazar PDF (Opcional)" : "Archivo PDF (Max 5MB)"}</label>
          <input 
            type="file" 
            className="input" 
            id="file-input"
            onChange={handleFileChange}
            accept="application/pdf"
            // 6. El archivo solo es 'required' si estamos creando, no editando
            required={!editingId} 
          />
          
          {isUploading && (
             <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
               <div className="spinner-mini"></div>
               <span>Procesando PDF...</span>
             </div>
          )}
          
          <div style={{display: 'flex', gap: 8, marginTop: 8}}>
            {editingId && (
              <button type="button" className="btn" style={{background: 'var(--muted)', flex: 1}} onClick={handleCancelEdit}>
                Cancelar
              </button>
            )}
            <button className="btn" type="submit" disabled={isUploading} style={{flex: 2}}>
              {editingId ? "Actualizar Documento" : "Subir Documento"}
            </button>
          </div>
        </form>
      </section>

      <section className="card">
        <h2 className="section">Documentos Publicados</h2>
        <ul className="list">
          {documentosOrdenados.length > 0 ? documentosOrdenados.map((doc) => (
            <li key={doc.id} className="item">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10}}>
                <div>
                  <h4>{doc.titulo}</h4>
                  <p style={{fontSize: 12, margin: '4px 0', color: 'var(--muted)'}}>{doc.fileName}</p>
                  <div className="meta" style={{fontSize: 11}}>
                    <span>Subido el: {formatDate(doc.creado)}</span>
                  </div>
                </div>
                {/* 7. Nuevos botones de Editar y Eliminar */}
                <div style={{display: 'flex', gap: 8}}>
                  <button className="btn" onClick={() => setEditingId(doc.id)} style={{background: 'var(--warn)', color: '#fff'}}>
                    Editar
                  </button>
                  <button className="btn" onClick={() => handleDelete(doc)} style={{background: 'var(--danger)'}}>
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          )) : (
            <p style={{ color: 'var(--muted)' }}>Aún no se han subido documentos.</p>
          )}
        </ul>
      </section>
    </div>
  );
}