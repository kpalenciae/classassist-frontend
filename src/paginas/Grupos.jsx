import { useEffect, useState } from "react";
import axios from "axios";
import LayoutAdmin from "../componentes/LayoutAdmin";
import "../styles/panel.css";
import { API_URL } from "../config";

export default function Grupos() {
  const [sesiones, setSesiones] = useState([]);
  const [sesionSeleccionada, setSesionSeleccionada] = useState("");
  const [modo, setModo] = useState("cantidad");
  const [valor, setValor] = useState("");
  const [grupos, setGrupos] = useState([]);

  const obtenerSesiones = async () => {
    try {
      const respuesta = await axios.get(`${API_URL}/api/clases`)
      setSesiones(respuesta.data);
    } catch (error) {
      console.error("Error al obtener sesiones:", error);
    }
  };

  const obtenerGrupos = async (sesionId) => {
    if (!sesionId) return;

    try {
      const respuesta = await axios.get(`${API_URL}/api/grupos/${sesionId}`);
      setGrupos(respuesta.data);
    } catch (error) {
      console.error("Error al obtener grupos:", error);
      setGrupos([]);
    }
  };

  const generarGrupos = async () => {
    if (!sesionSeleccionada || !valor) {
      alert("Debes seleccionar una sesión e ingresar un valor");
      return;
    }

    try {
      const respuesta = await axios.post(`${API_URL}/api/grupos/generar`, {
        sesion_id: sesionSeleccionada,
        modo,
        valor,
      });

      setGrupos(respuesta.data.grupos);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.mensaje || "No se pudieron generar los grupos");
    }
  };

  const guardarNotaGrupo = async (grupoId, nota) => {
    try {
      await axios.put(`${API_URL}/api/grupos/nota/${grupoId}`, {
        nota,
      });

      if (sesionSeleccionada) {
        obtenerGrupos(sesionSeleccionada);
      }
    } catch (error) {
      console.error("Error al guardar nota:", error);
      alert("No se pudo guardar la nota del grupo");
    }
  };

  useEffect(() => {
    obtenerSesiones();
  }, []);

  useEffect(() => {
    if (sesionSeleccionada) {
      obtenerGrupos(sesionSeleccionada);
    }
  }, [sesionSeleccionada]);

  return (
    <LayoutAdmin>
      <div className="page-box">
        <div className="page-hero">
          <h1>Grupos Aleatorios</h1>
          <p>
            Genera grupos automáticamente con base en los estudiantes presentes.
          </p>
        </div>

        <div className="content-card">
          <h2 className="section-title">Configuración</h2>

          <div className="two-columns">
            <select
              className="input-modern"
              value={sesionSeleccionada}
              onChange={(e) => setSesionSeleccionada(e.target.value)}
            >
              <option value="">Selecciona una sesión</option>
              {sesiones.map((sesion) => (
                <option key={sesion.id} value={sesion.id}>
                  {sesion.nombre_clase} - {sesion.fecha}
                </option>
              ))}
            </select>

            <select
              className="input-modern"
              value={modo}
              onChange={(e) => setModo(e.target.value)}
            >
              <option value="cantidad">Definir número de grupos</option>
              <option value="tamano">Definir tamaño por grupo</option>
            </select>
          </div>

          <div className="two-columns">
            <input
              className="input-modern"
              type="number"
              placeholder={modo === "cantidad" ? "Cantidad de grupos" : "Tamaño por grupo"}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />

            <div style={{ display: "flex", alignItems: "center" }}>
              <button onClick={generarGrupos} className="btn-primary-modern">
                Generar grupos
              </button>
            </div>
          </div>
        </div>

        {grupos.length === 0 ? (
          <div className="content-card">
            <p>No hay grupos generados todavía.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "18px",
            }}
          >
            {grupos.map((grupo) => (
              <div key={grupo.id} className="content-card">
                <h2 style={{ marginTop: 0, color: "#0f172a" }}>{grupo.nombre_grupo}</h2>

                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                    marginBottom: "16px",
                  }}
                >
                  {grupo.integrantes.length === 0 ? (
                    <p>Sin integrantes</p>
                  ) : (
                    grupo.integrantes.map((integrante) => (
                      <div
                        key={integrante.id}
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: "16px",
                          padding: "14px",
                          background: "#f8fafc",
                        }}
                      >
                        <strong>{integrante.nombre}</strong>
                        <p style={{ margin: "6px 0 0 0" }}>
                          Carné: {integrante.carne}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <input
                    className="input-modern"
                    type="number"
                    defaultValue={grupo.nota}
                    placeholder="Nota del grupo"
                    style={{ maxWidth: "180px", marginBottom: 0 }}
                    id={`nota-${grupo.id}`}
                  />

                  <button
                    onClick={() =>
                      guardarNotaGrupo(
                        grupo.id,
                        document.getElementById(`nota-${grupo.id}`).value
                      )
                    }
                    className="btn-primary-modern"
                    style={{ background: "#22c55e" }}
                  >
                    Guardar nota
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutAdmin>
  );
}