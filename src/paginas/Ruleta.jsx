import { useEffect, useState } from "react";
import axios from "axios";
import LayoutAdmin from "../componentes/LayoutAdmin";
import "../styles/panel.css";
import { API_URL } from "../config";

export default function Ruleta() {
  const [sesiones, setSesiones] = useState([]);
  const [sesionSeleccionada, setSesionSeleccionada] = useState("");
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [animando, setAnimando] = useState(false);
  const [nota, setNota] = useState("");
  const [comentario, setComentario] = useState("");
  const [participaciones, setParticipaciones] = useState([]);

  const obtenerSesiones = async () => {
    try {
      const respuesta = await axios.get(`${API_URL}/api/grupos/sesiones`);
      setSesiones(respuesta.data);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerParticipaciones = async (sesionId) => {
    if (!sesionId) return;

    try {
      const respuesta = await axios.get(`${API_URL}/api/ruleta/participaciones/${sesionId}`);
    
      setParticipaciones(respuesta.data);
    } catch (error) {
      console.error(error);
    }
  };

  const girarRuleta = async () => {
    if (!sesionSeleccionada) {
      alert("Selecciona una sesión");
      return;
    }

    setAnimando(true);
    setEstudianteSeleccionado(null);

    setTimeout(async () => {
      try {
       const respuesta = await axios.get(`${API_URL}/api/ruleta/aleatorio/${sesionSeleccionada}`);
        setEstudianteSeleccionado(respuesta.data);
      } catch (error) {
        console.error(error);
        alert(error?.response?.data?.mensaje || "Error al seleccionar");
      } finally {
        setAnimando(false);
      }
    }, 1500);
  };

  const guardarParticipacion = async () => {
    if (!estudianteSeleccionado) {
      alert("Primero selecciona un estudiante");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/ruleta/guardar`, {
        sesion_id: sesionSeleccionada,
        estudiante_id: estudianteSeleccionado.id,
        nota,
        comentario,
      });

      alert("Participación guardada");
      setNota("");
      setComentario("");
      obtenerParticipaciones(sesionSeleccionada);
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar");
    }
  };

  useEffect(() => {
    obtenerSesiones();
  }, []);

  useEffect(() => {
    if (sesionSeleccionada) {
      obtenerParticipaciones(sesionSeleccionada);
    }
  }, [sesionSeleccionada]);

  return (
    <LayoutAdmin>
      <div className="page-box">

        <div className="page-hero">
          <h1>Ruleta de Participación</h1>
          <p>Selecciona estudiantes aleatoriamente y registra su participación.</p>
        </div>

        <div className="two-columns">
          <div className="content-card">
            <h2 className="section-title">Configuración</h2>

            <select
              className="input-modern"
              value={sesionSeleccionada}
              onChange={(e) => setSesionSeleccionada(e.target.value)}
            >
              <option value="">Selecciona una sesión</option>
              {sesiones.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre_clase} - {s.fecha}
                </option>
              ))}
            </select>

            <button
              onClick={girarRuleta}
              className="btn-primary-modern"
              style={{ marginTop: "10px" }}
            >
              Girar ruleta
            </button>
          </div>

          <div className="content-card">
            <h2 className="section-title">Resultado</h2>

            <div
              style={{
                minHeight: "160px",
                border: "2px dashed #cbd5e1",
                borderRadius: "16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                background: "#f8fafc",
              }}
            >
              {animando ? (
                <h2 style={{ color: "#7c3aed" }}>🎡 Girando...</h2>
              ) : estudianteSeleccionado ? (
                <div>
                  <h2>{estudianteSeleccionado.nombre}</h2>
                  <p>Carné: {estudianteSeleccionado.carne}</p>
                </div>
              ) : (
                <p>No hay selección aún</p>
              )}
            </div>
          </div>
        </div>

        {estudianteSeleccionado && (
          <div className="content-card">
            <h2 className="section-title">Registrar participación</h2>

            <input
              className="input-modern"
              type="number"
              placeholder="Nota"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />

            <textarea
              className="input-modern"
              placeholder="Comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              style={{ minHeight: "100px" }}
            />

            <button
              onClick={guardarParticipacion}
              className="btn-primary-modern"
              style={{ background: "#22c55e" }}
            >
              Guardar participación
            </button>
          </div>
        )}

        <div className="content-card">
          <h2 className="section-title">Participaciones</h2>

          {participaciones.length === 0 ? (
            <p>No hay registros.</p>
          ) : (
            participaciones.map((p) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                  padding: "14px",
                  marginBottom: "10px",
                  background: "#f8fafc",
                }}
              >
                <strong>{p.nombre}</strong>
                <p>Carné: {p.carne}</p>
                <p>Nota: {p.nota}</p>
                <p>Comentario: {p.comentario || "Sin comentario"}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </LayoutAdmin>
  );
}