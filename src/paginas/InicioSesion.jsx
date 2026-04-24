import "./InicioSesion.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function InicioSesion() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();

    console.log("Intentando login...");
    console.log("API:", API_URL);

    try {
      const respuesta = await axios.post(
        `${API_URL}/api/autenticacion/iniciar-sesion`,
        {
          correo,
          contrasena,
        }
      );

      console.log("Respuesta:", respuesta.data);

      localStorage.setItem(
        "usuario",
        JSON.stringify(respuesta.data.usuario)
      );

      navigate("/panel");
    } catch (error) {
      console.error("Error login:", error);
      alert("Credenciales incorrectas o error de conexión");
    }
  };

  return (
    <div className="login-page">
      <section className="info-panel">
        <h1>ClassAssist Pro</h1>
      </section>

      <section className="login-card">
        <h2>Bienvenido de nuevo</h2>

        {/* 👇 AQUÍ ESTÁ LA CLAVE */}
        <form onSubmit={manejarEnvio}>
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="tu@correo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />

          <button type="submit">Ingresar</button>
        </form>
      </section>
    </div>
  );
}