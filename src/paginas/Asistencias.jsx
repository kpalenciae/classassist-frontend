import { useEffect, useState } from "react";
import axios from "axios";
import LayoutAdmin from "../componentes/LayoutAdmin";
import "../styles/panel.css";
import { API_URL } from "../config";

export default function Asistencias() {
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState("");
  const [qr, setQr] = useState("");
  const [enlace, setEnlace] = useState("");
  const [sesionId, setSesionId] = useState(null);
  const [asistencias, setAsistencias] = useState([]);

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

  const crearSesion = async () => {
    if (!claseSeleccionada) {
      alert("Selecciona una clase");
      return;
    }

    try {
      const respuesta = await axios.post(`${API_URL}/api/asistencias/sesion`, {
          clase_id: claseSeleccionada,
        }
      );

      setQr(respuesta.data.qr);
      setEnlace(respuesta.data.enlace);
      setSesionId(respuesta.data.sesion_id);
      obtenerAsistencias(respuesta.data.sesion_id);
    } catch (error) {
      console.error("Error al crear sesión:", error);
      alert("No se pudo crear la sesión QR");
    }
  };

  const obtenerAsistencias = async (idSesion) => {
    try {
      const respuesta = await axios.get(`${API_URL}/api/asistencias/lista/${idSesion}`
      );
      setAsistencias(respuesta.data);
    } catch (error) {
      console.error("Error al obtener asistencias:", error);
      setAsistencias([]);
    }
  };

  useEffect(() => {
    obtenerClases();
  }, []);

  useEffect(() => {
    let intervalo;

    if (sesionId) {
      intervalo = setInterval(() => {
        obtenerAsistencias(sesionId);
      }, 3000);
    }

    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [sesionId]);

  return (
    <LayoutAdmin>
      <div className="page-box">
        <div className="page-hero">
          <h1>Asistencia con QR</h1>
          <p>
            Genera sesiones de asistencia y registra a los estudiantes en tiempo real.
          </p>
        </div>

        <div className="two-columns">
          <div className="content-card">
            <h2 className="section-title">Configuración de sesión</h2>

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

            <button onClick={crearSesion} className="btn-primary-modern">
              Generar QR de asistencia
            </button>
          </div>

          <div className="content-card">
            <h2 className="section-title">Resumen</h2>

            <div
              style={{
                padding: "18px",
                borderRadius: "16px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3 style={{ margin: "0 0 8px 0" }}>Asistencias registradas</h3>
              <p style={{ margin: 0, fontSize: "22px", fontWeight: "bold" }}>
                {asistencias.length}
              </p>
            </div>
          </div>
        </div>

        {qr && (
          <div className="content-card" style={{ textAlign: "center" }}>
            <h2 className="section-title">Código QR generado</h2>

            <img
              src={qr}
              alt="QR de asistencia"
              style={{
                width: "100%",
                maxWidth: "260px",
                margin: "0 auto 16px auto",
                display: "block",
                borderRadius: "12px",
              }}
            />

            <p style={{ wordBreak: "break-all", color: "#64748b" }}>{enlace}</p>
          </div>
        )}

        <div className="content-card">
          <h2 className="section-title">Asistencias registradas</h2>

          {asistencias.length === 0 ? (
            <p>No hay asistencias todavía.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "16px",
              }}
            >
              {asistencias.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    flexWrap: "wrap",
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "18px",
                    background: "#f8fafc",
                  }}
                >
                  {item.selfie_url ? (
                    <a
                      href={item.selfie_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: "inline-block" }}
                    >
                      <img
                        src={item.selfie_url}
                        alt={`Selfie de ${item.nombre}`}
                        style={{
                          width: "72px",
                          height: "72px",
                          objectFit: "cover",
                          borderRadius: "12px",
                          border: "1px solid #dbe3ef",
                          cursor: "pointer",
                        }}
                      />
                    </a>
                  ) : (
                    <div
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "12px",
                        border: "1px dashed #cbd5e1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#64748b",
                        fontSize: "12px",
                        textAlign: "center",
                        padding: "6px",
                      }}
                    >
                      Sin selfie
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginTop: 0, marginBottom: "8px", color: "#0f172a" }}>
                      {item.nombre}
                    </h3>

                    <p style={{ margin: "0 0 6px 0" }}>
                      <strong>Carné:</strong> {item.carne}
                    </p>

                    <p style={{ margin: 0 }}>
                      <strong>Registro:</strong> {item.fecha_registro}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
}