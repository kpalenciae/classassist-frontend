import { useEffect, useState } from "react";
import axios from "axios";
import LayoutAdmin from "../componentes/LayoutAdmin";
import "../styles/panel.css";
import { API_URL } from "../config";

export default function Ranking() {
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState("");
  const [ranking, setRanking] = useState([]);

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

  const obtenerRanking = async (claseId) => {
    if (!claseId) return;

    try {
     const respuesta = await axios.get(`${API_URL}/api/ranking/${claseId}`);
      setRanking(respuesta.data);
    } catch (error) {
      console.error("Error al obtener ranking:", error);
      setRanking([]);
    }
  };

  useEffect(() => {
    obtenerClases();
  }, []);

  useEffect(() => {
    if (claseSeleccionada) {
      obtenerRanking(claseSeleccionada);
    }
  }, [claseSeleccionada]);

  return (
    <LayoutAdmin>
      <div className="page-box">
        <div className="page-hero">
          <h1>Ranking de Participación</h1>
          <p>Consulta el rendimiento de participación por clase.</p>
        </div>

        <div className="content-card">
          <h2 className="section-title">Clase</h2>

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
        </div>

        {ranking.length === 0 ? (
          <div className="content-card">
            <p>No hay datos de participación para esta clase.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            {ranking.map((estudiante, index) => (
              <div key={estudiante.id} className="content-card">
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      minWidth: "68px",
                      width: "68px",
                      height: "68px",
                      borderRadius: "999px",
                      background:
                        index === 0
                          ? "linear-gradient(135deg, #f59e0b, #fbbf24)"
                          : index === 1
                          ? "linear-gradient(135deg, #94a3b8, #cbd5e1)"
                          : index === 2
                          ? "linear-gradient(135deg, #b45309, #d97706)"
                          : "linear-gradient(135deg, #2563eb, #3b82f6)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "1.4rem",
                    }}
                  >
                    #{index + 1}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>
                      {estudiante.nombre}
                    </h3>

                    <p style={{ margin: "0 0 4px 0" }}>
                      <strong>Carné:</strong> {estudiante.carne}
                    </p>

                    <p style={{ margin: "0 0 4px 0" }}>
                      <strong>Participaciones:</strong> {estudiante.total_participaciones}
                    </p>

                    <p style={{ margin: "0 0 4px 0" }}>
                      <strong>Promedio:</strong> {Number(estudiante.promedio_nota).toFixed(2)}
                    </p>

                    <p style={{ margin: 0 }}>
                      <strong>Total de puntos:</strong> {Number(estudiante.total_puntos).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutAdmin>
  );
}