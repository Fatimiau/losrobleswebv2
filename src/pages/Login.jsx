import { useState } from "react";

export default function Login({ onLoginSuccess }) {
  const [modo, setModo] = useState("login");

  const onLoginSubmit = (e) => {
    e.preventDefault();
    alert("Simulación de inicio de sesión exitosa!");
    onLoginSuccess();
  };

  const onRegisterSubmit = (e) => {
    e.preventDefault();
    alert("Simulación de registro exitoso!");
    onLoginSuccess();
  };

  return (
    <div className="container" style={{paddingTop: '5vh'}}>
      <div className="grid" style={{ maxWidth: 400, margin: "0 auto" }}>
        <header style={{textAlign: 'center', marginBottom: 16}}>
            <h1>Residencial Los Robles</h1>
            <p>Plataforma de Gestión Comunitaria</p>
        </header>
        <section className="card">
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
            <button
              className="btn"
              style={{
                background: modo === "login" ? "var(--brand)" : "transparent",
                borderRadius: "8px 8px 0 0",
                flex: 1,
                boxShadow: 'none'
              }}
              onClick={() => setModo("login")}
            >
              Iniciar Sesión
            </button>
            <button
              className="btn"
              style={{
                background: modo === "registro" ? "var(--brand)" : "transparent",
                borderRadius: "8px 8px 0 0",
                flex: 1,
                boxShadow: 'none'
              }}
              onClick={() => setModo("registro")}
            >
              Registrarse
            </button>
          </div>

          {modo === "login" && (
            <form onSubmit={onLoginSubmit} className="row">
              <h2 className="section" style={{textAlign: 'center'}}>Iniciar Sesión</h2>
              <input
                className="input"
                type="email"
                placeholder="correo@ejemplo.com"
                required
              />
              <input
                className="input"
                type="password"
                placeholder="Contraseña"
                required
              />
              <button className="btn" type="submit">
                Entrar
              </button>
            </form>
          )}

          {modo === "registro" && (
            <form onSubmit={onRegisterSubmit} className="row">
              <h2 className="section" style={{textAlign: 'center'}}>Crear Cuenta</h2>
              <input
                className="input"
                type="text"
                placeholder="Nombre completo"
                required
              />
              <input
                className="input"
                type="email"
                placeholder="correo@ejemplo.com"
                required
              />
              <input
                className="input"
                type="password"
                placeholder="Crear contraseña"
                required
              />
              <button className="btn" type="submit">
                Registrarse
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}