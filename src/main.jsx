import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
// 1. Importamos el proveedor
import { AppProvider } from "./context/AppContext.jsx";
// 2. Importamos el Toaster para las notificaciones
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        {/* 3. Añadimos el Toaster aquí */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            // Estilos para que coincida con tu tema oscuro
            style: {
              background: 'var(--card)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
            },
          }}
        />
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);