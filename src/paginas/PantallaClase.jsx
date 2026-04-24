import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LayoutAdmin from "../componentes/LayoutAdmin";
import "../styles/panel.css";
import { API_URL } from "../config";

export default function PantallaClase() {
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [ultimaSesion, setUltimaSesion] = useState(null);
  const [asistencias, setAsistencias] = useState([]);
  const [participaciones, setParticipaciones] = useState([]);
  const [grupos, setGrupos] = useState([]);

  const obtenerClases = async () => {
    try {
      const respuesta = await axios.get(`${API_URL}/api/clases`)
      setClases(respuesta.data);

      if (respuesta.data.length > 0 && !claseSeleccionada) {
        setClaseSeleccionada(String(respuesta.data[0].id));
      }
    } catch (error) {
      console.error("Error al obtener clases:", error);
    }
  };

  const obtenerEstudiantes = async (claseId) => {
    try {
      const respuesta = await axios.get(
        `${API_URL}/api/estudiantes?clase_id=${claseId}`
      );
      setEstudiantes(respuesta.data);
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
      setEstudiantes([]);
    }
  };

  const obtenerUltimaSesion = async (claseId) => {
    try {
      const respuesta = await axios.get(
        `${API_URL}/api/asistencias/ultima-sesion/${claseId}`
      );

      setUltimaSesion(respuesta.data);

      if (respuesta.data?.id) {
        obtenerAsistencias(respuesta.data.id);
        obtenerParticipaciones(respuesta.data.id);
        obtenerGrupos(respuesta.data.id);
      } else {
        setAsistencias([]);
        setParticipaciones([]);
        setGrupos([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setUltimaSesion(null);
      setAsistencias([]);
      setParticipaciones([]);
      setGrupos([]);
    }
  };

  const obtenerAsistencias = async (sesionId) => {
    try {
      const respuesta = await axios.get(
        `${API_URL}/api/asistencias/lista/${sesionId}`
      );
      setAsistencias(respuesta.data);
    } catch {
      setAsistencias([]);
    }
  };

  const obtenerParticipaciones = async (sesionId) => {
    try {
      const respuesta = await axios.get(
        `${API_URL}/api/ruleta/participaciones/${sesionId}`
      );
      setParticipaciones(respuesta.data);
    } catch {
      setParticipaciones([]);
    }
  };

  const obtenerGrupos = async (sesionId) => {
    try {
      const respuesta = await axios.get(
        `${API_URL}/api/grupos/${sesionId}`
      );
      setGrupos(respuesta.data);
    } catch {
      setGrupos([]);
    }
  };

  useEffect(() => {
    obtenerClases();
  }, []);

  useEffect(() => {
    if (claseSeleccionada) {
      obtenerEstudiantes(claseSeleccionada);
      obtenerUltimaSesion(claseSeleccionada);
    }
  }, [claseSeleccionada]);

  const nombreClase =
    clases.find((c) => String(c.id) === String(claseSeleccionada))?.nombre ||
    "Sin clase";

  return (
    <LayoutAdmin>
      <div className="page-box">

        <div className="page-hero">
          <h1>Pantalla de Clase</h1>
          <p>Vista general del estado actual de la clase.</p>
        </div>

        <div className="content-card">
          <select
            className="input-modern"
            value={claseSeleccionada}
            onChange={(e) => setClaseSeleccionada(e.target.value)}
          >
            {clases.map((clase) => (
              <option key={clase.id} value={clase.id}>
                {clase.nombre}
              </option>
            ))}
          </select>

          <h2 style={{ marginTop: "16px" }}>{nombreClase}</h2>
          <p style={{ color: "#64748b" }}>
            Última sesión: {ultimaSesion ? ultimaSesion.fecha : "Sin sesiones"}
          </p>
        </div>

        <div className="two-columns">
          <div className="content-card">
            <h3>Total estudiantes</h3>
            <p style={{ fontSize: "22px" }}>{estudiantes.length}</p>
          </div>

          <div className="content-card">
            <h3>Asistencias</h3>
            <p style={{ fontSize: "22px" }}>{asistencias.length}</p>
          </div>

          <div className="content-card">
            <h3>Participaciones</h3>
            <p style={{ fontSize: "22px" }}>{participaciones.length}</p>
          </div>

          <div className="content-card">
            <h3>Grupos</h3>
            <p style={{ fontSize: "22px" }}>{grupos.length}</p>
          </div>
        </div>

        <div className="content-card">
          <h2 className="section-title">Accesos rápidos</h2>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link to="/asistencias" className="btn-primary-modern">QR</Link>
            <Link to="/ruleta" className="btn-primary-modern">Ruleta</Link>
            <Link to="/grupos" className="btn-primary-modern">Grupos</Link>
            <Link to="/temporizador" className="btn-primary-modern">Timer</Link>
            <Link to="/ranking" className="btn-primary-modern">Ranking</Link>
          </div>
        </div>

        <div className="two-columns">
          <div className="content-card">
            <h2 className="section-title">Últimas asistencias</h2>
            {asistencias.slice(0, 5).map((a) => (
              <div key={a.id}>{a.nombre}</div>
            ))}
          </div>

          <div className="content-card">
            <h2 className="section-title">Participaciones</h2>
            {participaciones.slice(0, 5).map((p) => (
              <div key={p.id}>{p.nombre}</div>
            ))}
          </div>

          <div className="content-card">
            <h2 className="section-title">Grupos</h2>
            {grupos.map((g) => (
              <div key={g.id}>{g.nombre_grupo}</div>
            ))}
          </div>
        </div>

      </div>
    </LayoutAdmin>
  );
}