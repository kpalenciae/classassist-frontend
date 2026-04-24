import { useEffect, useState } from "react";
import axios from "axios";
import LayoutAdmin from "../componentes/LayoutAdmin";
import "../styles/panel.css";
import { API_URL } from "../config";

export default function Clases() {
  const [clases, setClases] = useState([]);
  const [nombre, setNombre] = useState("");
  const [seccion, setSeccion] = useState("");
  const [horario, setHorario] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const obtenerClases = async () => {
    try {
      const respuesta = await axios.get(`${API_URL}/api/clases`)
      setClases(respuesta.data);
    } catch (error) {
      console.error("Error al obtener clases:", error);
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setSeccion("");
    setHorario("");
    setEditandoId(null);
  };

  const guardarClase = async (e) => {
    e.preventDefault();

    try {
      if (editandoId) {
        await axios.put(`${API_URL}/api/clases/${editandoId}`,  {
          nombre,
          seccion,
          horario,
        });
      } else {
        await axios.post(`${API_URL}/api/clases`, {
          nombre,
          seccion,
          horario,
          docente_id: usuario?.id || null,
        });
      }

      limpiarFormulario();
      obtenerClases();
    } catch (error) {
      console.error("Error al guardar clase:", error);
      alert("No se pudo guardar la clase");
    }
  };

  const editarClase = (clase) => {
    setNombre(clase.nombre);
    setSeccion(clase.seccion || "");
    setHorario(clase.horario || "");
    setEditandoId(clase.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarClase = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar esta clase?");
    if (!confirmar) return;

    try {
      await axios.delete(`${API_URL}/api/clases/${id}`);
      obtenerClases();

      if (editandoId === id) {
        limpiarFormulario();
      }
    } catch (error) {
      console.error("Error al eliminar clase:", error);
      alert("No se pudo eliminar la clase");
    }
  };

  useEffect(() => {
    obtenerClases();
  }, []);

  return (
    <LayoutAdmin>
      <div className="page-box">
        <div className="page-hero">
          <h1>Gestión de Clases</h1>
          <p>Administra tus clases, secciones y horarios desde un solo lugar.</p>
        </div>

        <div className="two-columns">
          <div className="content-card">
            <h2 className="section-title">
              {editandoId ? "Editar clase" : "Nueva clase"}
            </h2>

            <form onSubmit={guardarClase}>
              <input
                className="input-modern"
                type="text"
                placeholder="Nombre de la clase"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />

              <input
                className="input-modern"
                type="text"
                placeholder="Sección"
                value={seccion}
                onChange={(e) => setSeccion(e.target.value)}
              />

              <input
                className="input-modern"
                type="text"
                placeholder="Horario"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
              />

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button type="submit" className="btn-primary-modern">
                  {editandoId ? "Actualizar clase" : "Crear clase"}
                </button>

                {editandoId && (
                  <button
                    type="button"
                    className="btn-primary-modern"
                    onClick={limpiarFormulario}
                    style={{ background: "#64748b" }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="content-card">
            <h2 className="section-title">Resumen</h2>
            <p style={{ fontSize: "18px", margin: 0 }}>
              <strong>Total de clases:</strong> {clases.length}
            </p>
          </div>
        </div>

        <div className="content-card">
          <h2 className="section-title">Listado de clases</h2>

          {clases.length === 0 ? (
            <p>No hay clases registradas todavía.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "16px",
              }}
            >
              {clases.map((clase) => (
                <div
                  key={clase.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "18px",
                    background: "#f8fafc",
                  }}
                >
                  <h3 style={{ marginTop: 0, marginBottom: "10px", color: "#0f172a" }}>
                    {clase.nombre}
                  </h3>

                  <p style={{ margin: "0 0 6px 0" }}>
                    <strong>Sección:</strong> {clase.seccion || "Sin sección"}
                  </p>

                  <p style={{ margin: "0 0 14px 0" }}>
                    <strong>Horario:</strong> {clase.horario || "Sin horario"}
                  </p>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      className="btn-primary-modern"
                      onClick={() => editarClase(clase)}
                      style={{ background: "#f59e0b" }}
                    >
                      Editar
                    </button>

                    <button
                      className="btn-primary-modern"
                      onClick={() => eliminarClase(clase.id)}
                      style={{ background: "#dc2626" }}
                    >
                      Eliminar
                    </button>
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