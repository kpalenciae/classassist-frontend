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

    try {
      const respuesta = await axios.post(
        `${API_URL}/api/autenticacion/iniciar-sesion`,
        {
          correo,
          contrasena,
        }
      );

      localStorage.setItem("usuario", JSON.stringify(respuesta.data.usuario));

      navigate("/panel");
    } catch (error) {
      console.error("Error login:", error);
      alert("Credenciales incorrectas o error de conexión");
    }
  };

  return (
    <div className="login-page">
      <section className="info-panel">
        <div className="login-brand">
          <span className="brand-icon">🎓</span>
          <h1 className="titulo-bienvenida">Bienvenido Catedrático</h1>
          <p className="subtitulo-bienvenida">
            Sistema académico para gestionar clases, estudiantes y asistencias.
          </p>
        </div>
      </section>

      <section className="login-card">
        <h2>Inicio de sesión</h2>
        <p className="login-text">Ingresa tus credenciales para continuar</p>

        <form onSubmit={manejarEnvio}>
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="tu@correo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          <button type="submit">Ingresar</button>
        </form>
      </section>
    </div>
  );
}