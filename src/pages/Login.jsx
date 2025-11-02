import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Login() {
  const { login, register } = useApp();
  const [modo, setModo] = useState("login");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (modo === "login") {
      const success = login(data.email, data.password);
      if (!success) {
        setError("Credenciales incorrectas. Inténtalo de nuevo.");
      }
    } else {
      if (!data.house.trim()) {
        setError("El número de casa es obligatorio.");
        return;
      }
      register({
        name: data.name,
        email: data.email,
        password: data.password,
        house: data.house.trim(),
      });
      alert("¡Registro exitoso! Ahora inicia sesión.");
      setModo("login");
    }
  };

  return (
    <div className="container" style={{ paddingTop: "5vh" }}>
      <div className="grid" style={{ maxWidth: 400, margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: 16 }}>
          <h1>Residencial Los Robles</h1>
          <p>Plataforma de Gestión Comunitaria</p>
        </header>
        <section className="card">
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
            <button className="btn" style={{ flex: 1, background: modo === 'login' ? 'var(--brand)' : 'transparent', boxShadow: 'none', border: 0, borderRadius: '10px 10px 0 0' }} onClick={() => { setModo("login"); setError(null); }}>
              Iniciar Sesión
            </button>
            <button className="btn" style={{ flex: 1, background: modo === 'registro' ? 'var(--brand)' : 'transparent', boxShadow: 'none', border: 0, borderRadius: '10px 10px 0 0' }} onClick={() => { setModo("registro"); setError(null); }}>
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="row">
            {modo === "registro" && (
              <>
                <h2 className="section" style={{ textAlign: "center" }}>Crear Cuenta</h2>
                <input className="input" type="text" name="name" placeholder="Nombre completo" required />
                <label>Dirección</label>
                <input className="input" value="Residencial Los Robles, Av. Siempre Viva 742" disabled />
                <input className="input" type="text" name="house" placeholder="Número de Casa (ej. 123)" required />
                <input className="input" type="email" name="email" placeholder="correo@ejemplo.com" required />
                <input className="input" type="password" name="password" placeholder="Contraseña" required />
              </>
            )}

            {modo === "login" && (
              <>
                <h2 className="section" style={{ textAlign: "center" }}>Iniciar Sesión</h2>
                <input className="input" type="email" name="email" placeholder="correo@ejemplo.com" required />
                <input className="input" type="password" name="password" placeholder="Contraseña" required />
              </>
            )}

            {error && (<p style={{ color: "var(--danger)", textAlign: "center", margin: 0, fontSize: 14 }}>{error}</p>)}

            <button className="btn" type="submit">
              {modo === "login" ? "Entrar" : "Registrarse"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}