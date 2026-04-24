import { useEffect, useState } from "react";
import axios from "axios";
import LayoutAdmin from "../componentes/LayoutAdmin";
import "../styles/panel.css";
import { API_URL } from "../config";

export default function Estudiantes() {
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);

  const [numeroLista, setNumeroLista] = useState("");
  const [carne, setCarne] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [archivoExcel, setArchivoExcel] = useState(null);

  const [editandoId, setEditandoId] = useState(null);

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
    if (!claseId) return;

    try {
      const respuesta = await axios.get(`${API_URL}/api/estudiantes?clase_id=${claseId}`
      );
      setEstudiantes(respuesta.data);
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
    }
  };

  const limpiarFormulario = () => {
    setNumeroLista("");
    setCarne("");
    setNombre("");
    setCorreo("");
    setEditandoId(null);
  };

  const guardarEstudiante = async (e) => {
    e.preventDefault();

    if (!claseSeleccionada) {
      alert("Debes seleccionar una clase");
      return;
    }

    try {
      if (editandoId) {
        await axios.put(`${API_URL}/api/estudiantes/${editandoId}`, {
          numero_lista: numeroLista,
          carne,
          nombre,
          correo,
        });
      } else {
        await axios.post(`${API_URL}/api/estudiantes`, {
          numero_lista: numeroLista,
          carne,
          nombre,
          correo,
          clase_id: claseSeleccionada,
        });
      }

      limpiarFormulario();
      obtenerEstudiantes(claseSeleccionada);
    } catch (error) {
      console.error("Error al guardar estudiante:", error);
      alert("No se pudo guardar el estudiante");
    }
  };

  const importarExcel = async () => {
    if (!archivoExcel) {
      alert("Debes seleccionar un archivo Excel");
      return;
    }

    if (!claseSeleccionada) {
      alert("Debes seleccionar una clase");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", archivoExcel);
    formData.append("clase_id", claseSeleccionada);

    try {
      const respuesta = await axios.post(`${API_URL}/api/estudiantes/importar-excel`, formData, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(respuesta.data.mensaje);
      setArchivoExcel(null);
      obtenerEstudiantes(claseSeleccionada);
    } catch (error) {
      console.error("Error al importar Excel:", error);
      alert("No se pudo importar el archivo Excel");
    }
  };

  const editarEstudiante = (estudiante) => {
    setNumeroLista(estudiante.numero_lista || "");
    setCarne(estudiante.carne || "");
    setNombre(estudiante.nombre || "");
    setCorreo(estudiante.correo || "");
    setEditandoId(estudiante.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarEstudiante = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este estudiante?");
    if (!confirmar) return;

    try {
      await axios.delete(`${API_URL}/api/estudiantes/${id}`);
      obtenerEstudiantes(claseSeleccionada);

      if (editandoId === id) {
        limpiarFormulario();
      }
    } catch (error) {
      console.error("Error al eliminar estudiante:", error);
      alert("No se pudo eliminar el estudiante");
    }
  };

  useEffect(() => {
    obtenerClases();
  }, []);

  useEffect(() => {
    if (claseSeleccionada) {
      obtenerEstudiantes(claseSeleccionada);
    }
  }, [claseSeleccionada]);

  return (
    <LayoutAdmin>
      <div className="page-box">
        <div className="page-hero">
          <h1>Gestión de Estudiantes</h1>
          <p>
            Administra estudiantes manualmente o mediante importación desde Excel.
          </p>
        </div>

        <div className="two-columns">
          <div className="content-card">
            <h2 className="section-title">Clase seleccionada</h2>

            <select
              className="input-modern"
              value={claseSeleccionada}
              onChange={(e) => {
                setClaseSeleccionada(e.target.value);
                limpiarFormulario();
              }}
            >
              {clases.map((clase) => (
                <option key={clase.id} value={clase.id}>
                  {clase.nombre}
                </option>
              ))}
            </select>

            <div
              style={{
                marginTop: "18px",
                padding: "18px",
                borderRadius: "16px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3 style={{ margin: "0 0 8px 0" }}>Total de estudiantes</h3>
              <p style={{ margin: 0, fontSize: "22px", fontWeight: "bold" }}>
                {estudiantes.length}
              </p>
            </div>
          </div>

          <div className="content-card">
            <h2 className="section-title">Carga masiva desde Excel</h2>

            <input
              className="input-modern"
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setArchivoExcel(e.target.files[0])}
            />

            <button className="btn-primary-modern" onClick={importarExcel}>
              Importar Excel
            </button>
          </div>
        </div>

        <div className="content-card">
          <h2 className="section-title">
            {editandoId ? "Editar estudiante" : "Nuevo estudiante"}
          </h2>

          <form onSubmit={guardarEstudiante}>
            <div className="two-columns">
              <input
                className="input-modern"
                type="text"
                placeholder="Número de lista"
                value={numeroLista}
                onChange={(e) => setNumeroLista(e.target.value)}
              />

              <input
                className="input-modern"
                type="text"
                placeholder="Carné"
                value={carne}
                onChange={(e) => setCarne(e.target.value)}
                required
              />
            </div>

            <div className="two-columns">
              <input
                className="input-modern"
                type="text"
                placeholder="Nombre del estudiante"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />

              <input
                className="input-modern"
                type="email"
                placeholder="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button type="submit" className="btn-primary-modern">
                {editandoId ? "Actualizar estudiante" : "Agregar estudiante"}
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
          <h2 className="section-title">Listado de estudiantes</h2>

          {estudiantes.length === 0 ? (
            <p>No hay estudiantes en esta clase.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "16px",
              }}
            >
              {estudiantes.map((estudiante) => (
                <div
                  key={estudiante.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "18px",
                    background: "#f8fafc",
                  }}
                >
                  <h3 style={{ marginTop: 0, marginBottom: "10px", color: "#0f172a" }}>
                    {estudiante.nombre}
                  </h3>

                  <p style={{ margin: "0 0 6px 0" }}>
                    <strong>Número de lista:</strong>{" "}
                    {estudiante.numero_lista || "Sin número"}
                  </p>

                  <p style={{ margin: "0 0 6px 0" }}>
                    <strong>Carné:</strong> {estudiante.carne}
                  </p>

                  <p style={{ margin: "0 0 14px 0" }}>
                    <strong>Correo:</strong> {estudiante.correo || "Sin correo"}
                  </p>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      className="btn-primary-modern"
                      onClick={() => editarEstudiante(estudiante)}
                      style={{ background: "#f59e0b" }}
                    >
                      Editar
                    </button>

                    <button
                      className="btn-primary-modern"
                      onClick={() => eliminarEstudiante(estudiante.id)}
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