import { createContext, useState, useEffect, useContext } from "react";

const initialDb = {
  users: [
    { id: "u1", name: "Mesa Directiva", email: "admin@robles.com", password: "admin123", role: "admin", house: "Admin" },
    { id: "u2", name: "Fatima Bautista", email: "residente@test.com", password: "res123", role: "residente", house: "123" },
  ],
  incidencias: [
    { id: "i1", titulo: "Fuga de agua en área común", detalle: "La fuente principal tiene una fuga visible.", estado: "Nueva", userId: "u2", house: "123", creado: Date.now() - 86400000 },
  ],
  avisos: [
    { id: "a1", titulo: "Mantenimiento de bombas", detalle: "Lunes 10:00–12:00 — Podrían presentarse bajas de presión.", userId: "u1" },
  ],
  pagos: [
    { id: "p1", mes: "Septiembre", monto: 500, estado: "Pagado", house: "123" },
    { id: "p2", mes: "Octubre", monto: 500, estado: "Pendiente", house: "123" },
  ],
  comentarios: [
    { id: "c1", texto: "Gracias por el reporte, ya lo estamos revisando.", parentId: "i1", userId: "u1", creado: Date.now() - 3600000 },
    { id: "c2", texto: "¡Excelente, quedo al pendiente!", parentId: "i1", userId: "u2", creado: Date.now() - 1800000 },
  ],
  votaciones: [
    { id: "v1", pregunta: "¿Nuevo color para la fachada?", opciones: [{id: "o1", texto: "Azul Pacífico"}, {id: "o2", texto: "Verde Olivo"}], activa: true }
  ],
  votos: [
    // { votacionId: "v1", userId: "u2", optionId: "o1" } // Example of a vote
  ]
};

const STORAGE_KEY = "DB_ROBLES";
export const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [db, setDb] = useState(() => {
    try {
      const storedDb = localStorage.getItem(STORAGE_KEY);
      return storedDb ? JSON.parse(storedDb) : initialDb;
    } catch { return initialDb; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }, [db]);

  const login = (email, password) => {
    const foundUser = db.users.find((user) => user.email === email && user.password === password);
    if (foundUser) {
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };
  const logout = () => setCurrentUser(null);
  const register = (userData) => {
    const newUser = { ...userData, id: crypto.randomUUID(), role: 'residente' };
    setDb(prev => ({ ...prev, users: [...prev.users, newUser] }));
  };
  const updateUser = (userId, updatedData) => {
    setDb(prev => ({ ...prev, users: prev.users.map(u => u.id === userId ? { ...u, ...updatedData } : u) }));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updatedData }));
    }
    alert("¡Datos actualizados con éxito!");
  };
  const deleteUser = (userId) => {
    if (userId === currentUser?.id) return alert("No puedes eliminar tu propia cuenta.");
    setDb(prev => ({ ...prev, users: prev.users.filter(u => u.id !== userId) }));
    alert("Usuario eliminado exitosamente.");
  };

  // --- NEW BUSINESS LOGIC FUNCTIONS ---
  const createPago = (pagoData) => {
    const nuevoPago = { ...pagoData, id: crypto.randomUUID(), monto: 500, estado: "Pendiente" };
    setDb(prev => ({ ...prev, pagos: [nuevoPago, ...prev.pagos] }));
  };
  const payPago = (pagoId) => {
    setDb(prev => ({ ...prev, pagos: prev.pagos.map(p => p.id === pagoId ? { ...p, estado: "Pagado" } : p) }));
  };
  const createVotacion = (votacionData) => {
    const nuevaVotacion = {
      ...votacionData,
      id: crypto.randomUUID(),
      activa: true,
      opciones: votacionData.opciones.map(o => ({...o, id: crypto.randomUUID()}))
    };
    setDb(prev => ({ ...prev, votaciones: [nuevaVotacion, ...prev.votaciones] }));
  };
  const castVote = (votacionId, optionId) => {
    const nuevoVoto = { votacionId, optionId, userId: currentUser.id };
    setDb(prev => ({ ...prev, votos: [...prev.votos, nuevoVoto] }));
  };

  const value = { currentUser, db, setDb, login, logout, register, updateUser, deleteUser, createPago, payPago, createVotacion, castVote };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}