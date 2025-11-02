import { createContext, useState, useContext } from "react";
import { useDatabase } from "../hooks/useDatabase"; // 1. Importamos nuestro nuevo hook

export const AppContext = createContext();

export function AppProvider({ children }) {
  // 2. El estado ahora es SOLO para el usuario actual
  const [currentUser, setCurrentUser] = useState(null);
  
  // 3. Usamos el hook para obtener la DB y todas las funciones de manipulación
  const database = useDatabase(); 

  // --- Funciones de Autenticación (Ahora usan el hook de DB) ---
  const login = (email, password) => {
    // 4. Llama a la función del hook
    const foundUser = database.findUserByCredentials(email, password);
    if (foundUser) {
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };
  
  const register = (userData) => {
    // 5. Llama a la función del hook
    database.addUser(userData);
    // (En un futuro, aquí podríamos enviar un email de bienvenida, etc.)
  };

  // 6. El valor compartido es la suma del estado de auth + todo el hook de DB
  const value = {
    currentUser,
    login,
    logout,
    register,
    ...database, // ¡Incluimos 'db', 'updateUser', 'createPago', 'payPago', etc.!
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// El hook useApp no necesita cambios
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp debe ser usado dentro de un AppProvider");
  }
  return context;
}