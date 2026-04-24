import { useEffect, useState } from "react";
import axios from "axios";
import LayoutAdmin from "../componentes/LayoutAdmin";
import "../styles/panel.css";
import { API_URL } from "../config";

export default function ExportacionExcel() {
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState("");

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

  useEffect(() => {
    obtenerClases();
  }, []);

  const descargarArchivo = (tipo) => {
    if (!claseSeleccionada) {
      alert("Selecciona una clase");
      return;
    }

    window.open(`${API_URL}/api/exportacion/${tipo}/${claseSeleccionada}`, "_blank");
  };

  return (
    <LayoutAdmin>
      <div className="page-box">

        <div className="page-hero">
          <h1>Exportación a Excel</h1>
          <p>Exporta información académica en archivos Excel estructurados.</p>
        </div>

        <div className="content-card">
          <h2 className="section-title">Selecciona una clase</h2>

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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "18px",
          }}
        >
          <div className="content-card">
            <h2 className="section-title">Estudiantes</h2>
            <p style={{ marginBottom: "18px", color: "#64748b" }}>
              Exporta el listado completo de estudiantes de la clase.
            </p>

            <button
              className="btn-primary-modern"
              onClick={() => descargarArchivo("estudiantes")}
            >
              Descargar estudiantes
            </button>
          </div>

          <div className="content-card">
            <h2 className="section-title">Asistencias</h2>
            <p style={{ marginBottom: "18px", color: "#64748b" }}>
              Exporta la asistencia de la última sesión disponible.
            </p>

            <button
              className="btn-primary-modern"
              style={{ background: "#22c55e" }}
              onClick={() => descargarArchivo("asistencias")}
            >
              Descargar asistencias
            </button>
          </div>

          <div className="content-card">
            <h2 className="section-title">Ranking</h2>
            <p style={{ marginBottom: "18px", color: "#64748b" }}>
              Exporta el ranking de participación y puntos.
            </p>

            <button
              className="btn-primary-modern"
              style={{ background: "#f59e0b" }}
              onClick={() => descargarArchivo("ranking")}
            >
              Descargar ranking
            </button>
          </div>
        </div>

      </div>
    </LayoutAdmin>
  );
}