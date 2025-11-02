import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const initialDb = {
  users: [
    { id: "u1", name: "Mesa Directiva", email: "admin@robles.com", password: "admin123", role: "admin", house: "Admin" },
    { id: "u2", name: "Fatima Bautista", email: "residente@test.com", password: "res123", role: "residente", house: "123" },
  ],
  incidencias: [
    { id: "i1", titulo: "Fuga de agua en área común", detalle: "La fuente principal tiene una fuga visible.", estado: "Nueva", userId: "u2", house: "123", creado: Date.now() - 86400000, imagenBase64: null },
  ],
  avisos: [
    { id: "a1", titulo: "Mantenimiento de bombas", detalle: "Lunes 10:00–12:00 — Podrían presentarse bajas de presión.", userId: "u1" },
  ],
  pagos: [
    { id: "p1", mes: "Septiembre", monto: 500, estado: "Pagado", house: "123", fechaVencimiento: new Date(2025, 8, 30).toISOString(), fechaPago: new Date(2025, 8, 15).toISOString() },
    { id: "p2", mes: "Octubre", monto: 500, estado: "Pendiente", house: "123", fechaVencimiento: new Date(2025, 9, 31).toISOString(), fechaPago: null },
    { id: "p3", mes: "Agosto", monto: 500, estado: "Pagado con retraso", house: "123", fechaVencimiento: new Date(2025, 7, 31).toISOString(), fechaPago: new Date(2025, 8, 5).toISOString() },
  ],
  comentarios: [
    { id: "c1", texto: "Gracias por el reporte, ya lo estamos revisando.", parentId: "i1", userId: "u1", creado: Date.now() - 3600000, imagenBase64: null },
    { id: "c2", texto: "¡Excelente, quedo al pendiente!", parentId: "i1", userId: "u2", creado: Date.now() - 1800000, imagenBase64: null },
  ],
  votaciones: [
    { id: "v1", pregunta: "¿Nuevo color para la fachada?", opciones: [{id: "o1", texto: "Azul Pacífico"}, {id: "o2", texto: "Verde Olivo"}], activa: true }
  ],
  votos: [],
  notificaciones: [
    { id: "n1", userId: "u2", texto: "¡Bienvenido a Residencial Los Robles!", creado: Date.now() - 3600000, leida: false, link: "/mi-cuenta" },
  ],
  // --- CAMBIO: Se quitó el documento de ejemplo ---
  documentos: [
    {
      id: "doc1_ejemplo",
      titulo: "Reglamento de la Piscina (Ejemplo)",
      fileName: "REGLAMENTO_PISCINA.pdf",
      // Este es el truco: usamos la ruta pública en lugar de Base64
      dataBase64: "/REGLAMENTO_PISCINA.pdf",
      userId: "u1", // ID del admin "Mesa Directiva"
      creado: Date.now() - 200000000 // Fecha de ejemplo (hace ~2 días)
    },
    {
      id: "doc2_ejemplo",
      titulo: "Acta de Asamblea de Octubre (Ejemplo)",
      fileName: "ACTA_ASAMBLEA_OCTUBRE.pdf",
      dataBase64: "/ACTA_ASAMBLEA_OCTUBRE.pdf",
      userId: "u1",
      creado: Date.now() - 100000000 // Fecha de ejemplo (hace ~1 día)
    }
  ]
};
const STORAGE_KEY = "DB_ROBLES_PRO_V1"; 

function loadDatabase() {
  try {
    const storedDb = localStorage.getItem(STORAGE_KEY);
    if (storedDb) {
      const parsedDb = JSON.parse(storedDb);
      const adminUser = parsedDb.users?.find(u => u.email === "admin@robles.com");
      if (adminUser && adminUser.house !== undefined) {
        // Fusionamos para asegurar que todas las claves nuevas (como 'documentos') existan
        return { ...initialDb, ...parsedDb };
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDb));
    return initialDb;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDb));
    return initialDb;
  }
}

export function useDatabase() {
  const [db, setDb] = useState(loadDatabase());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }, [db]);

  // --- Funciones de USERS ---
  const findUserByCredentials = (email, password) => {
    return (db.users || []).find((user) => user.email === email && user.password === password);
  };
  const addUser = (userData) => {
    const newUser = { ...userData, id: crypto.randomUUID(), role: 'residente' };
    setDb(prev => ({ ...prev, users: [newUser, ...(prev.users || [])] }));
  };
  const updateUser = (userId, updatedData) => {
    setDb(prev => ({ ...prev, users: (prev.users || []).map(u => u.id === userId ? { ...u, ...updatedData } : u) }));
  };
  const deleteUser = (userId) => {
    setDb(prev => ({ ...prev, users: (prev.users || []).filter(u => u.id !== userId) }));
  };

  // --- Funciones de PAGOS ---
  const createPago = (pagoData) => {
    const { mes, casa: house, fechaVencimiento, monto = 500 } = pagoData;
    const nuevoPago = {
      id: crypto.randomUUID(),
      mes, house,
      monto: parseFloat(monto), 
      estado: "Pendiente",
      fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento).toISOString() : null,
      fechaPago: null
    };
    setDb(prev => ({ ...prev, pagos: [nuevoPago, ...(prev.pagos || [])] }));
  };
  const payPago = (pagoId) => {
    setDb(prev => ({
      ...prev,
      pagos: (prev.pagos || []).map(p => {
        if (p.id === pagoId) {
          const fechaPago = new Date();
          const fechaVencimiento = p.fechaVencimiento ? new Date(p.fechaVencimiento) : null;
          let estado = "Pagado";
          if (fechaVencimiento && fechaPago > fechaVencimiento) {
            estado = "Pagado con retraso";
          }
          return { ...p, estado: estado, fechaPago: fechaPago.toISOString() };
        }
        return p;
      })
    }));
  };
  const updatePago = (pagoId, pagoData) => {
    const { mes, casa: house, fechaVencimiento, monto = 500 } = pagoData;
    setDb(prev => ({
      ...prev,
      pagos: (prev.pagos || []).map(p => 
        p.id === pagoId ? { ...p, mes, house, fechaVencimiento, monto: parseFloat(monto) } : p
      )
    }));
  };
  const deletePago = (pagoId) => {
    setDb(prev => ({
      ...prev,
      pagos: (prev.pagos || []).filter(p => p.id !== pagoId)
    }));
  };

  // --- Funciones de VOTACIONES ---
  const createVotacion = (votacionData) => {
    const nuevaVotacion = {
      ...votacionData,
      id: crypto.randomUUID(),
      activa: true,
      opciones: votacionData.opciones.map(o => ({...o, id: crypto.randomUUID()}))
    };
    setDb(prev => ({ ...prev, votaciones: [nuevaVotacion, ...(prev.votaciones || [])] }));
  };
  const castVote = (votacionId, optionId, userId) => {
    const nuevoVoto = { votacionId, optionId, userId };
    setDb(prev => ({ ...prev, votos: [...(prev.votos || []), nuevoVoto] }));
  };

  // --- Funciones de INCIDENCIAS ---
  const addIncidencia = (incidenciaData) => {
     const nuevaIncidencia = { ...incidenciaData, id: crypto.randomUUID(), estado: 'Nueva', creado: Date.now() };
     setDb(prev => ({...prev, incidencias: [nuevaIncidencia, ...(prev.incidencias || [])]}));
  };
  const updateIncidenciaState = (incidenciaId) => {
    setDb(prev => ({ ...prev, incidencias: (prev.incidencias || []).map(i => {
      if (i.id !== incidenciaId) return i;
      const newState = i.estado === "Nueva" ? "En progreso" : i.estado === "En progreso" ? "Cerrada" : "Nueva";
      toast.success(`Incidencia actualizada a: ${newState}`);
      return {...i, estado: newState};
    })}));
  };
  const deleteIncidencia = (incidenciaId) => {
    setDb(prev => ({
      ...prev,
      incidencias: (prev.incidencias || []).filter(i => i.id !== incidenciaId),
      comentarios: (prev.comentarios || []).filter(c => c.parentId !== incidenciaId)
    }));
    toast.success("Incidencia y comentarios eliminados.");
  };

  // --- Funciones de COMENTARIOS ---
   const addComentario = (comentarioData) => {
     const nuevoComentario = { ...comentarioData, id: crypto.randomUUID(), creado: Date.now() };
     setDb(prev => ({...prev, comentarios: [...(prev.comentarios || []), nuevoComentario]}));
  };

  // --- Funciones de AVISOS ---
  const addAviso = (avisoData) => {
    const nuevoAviso = {...avisoData, id: crypto.randomUUID() };
    setDb(prev => ({...prev, avisos: [nuevoAviso, ...(prev.avisos || [])]}));
  };

  // --- Funciones de NOTIFICACIONES ---
  const addNotificacion = (notificacionData) => {
    const nuevaNotificacion = {
      ...notificacionData,
      id: crypto.randomUUID(),
      creado: Date.now(),
      leida: false
    };
    setDb(prev => ({ ...prev, notificaciones: [nuevaNotificacion, ...(prev.notificaciones || [])] }));
  };
  const markNotificacionesAsLeidas = (userId) => {
    setDb(prev => ({
      ...prev,
      notificaciones: (prev.notificaciones || []).map(n => 
        n.userId === userId ? { ...n, leida: true } : n
      )
    }));
  };
  
  // --- FUNCIONES DE DOCUMENTOS (ACTUALIZADAS) ---
  const addDocumento = (documentoData) => {
    const nuevoDocumento = { 
      ...documentoData, 
      id: crypto.randomUUID(), 
      creado: Date.now() 
    };
    setDb(prev => ({ ...prev, documentos: [nuevoDocumento, ...(prev.documentos || [])] }));
    toast.success("Documento subido con éxito.");
  };

  const deleteDocumento = (documentoId) => {
    setDb(prev => ({
      ...prev,
      documentos: (prev.documentos || []).filter(d => d.id !== documentoId)
    }));
    toast.success("Documento eliminado.");
  };
  
  // --- NUEVA FUNCIÓN ---
  const updateDocumento = (documentoId, documentoData) => {
    setDb(prev => ({
      ...prev,
      documentos: (prev.documentos || []).map(doc =>
        doc.id === documentoId ? { ...doc, ...documentoData } : doc
      )
    }));
    toast.success("Documento actualizado con éxito.");
  };

  // --- VALORES DEVUELTOS POR EL HOOK ---
  return {
    db, 
    findUserByCredentials,
    addUser,
    updateUser,
    deleteUser,
    createPago,
    payPago,
    updatePago,
    deletePago,
    createVotacion,
    castVote,
    addIncidencia,
    updateIncidenciaState,
    deleteIncidencia,
    addComentario,
    addAviso,
    addNotificacion,
    markNotificacionesAsLeidas,
    addDocumento,
    deleteDocumento,
    updateDocumento, // <-- Exportamos la nueva función
  };
}