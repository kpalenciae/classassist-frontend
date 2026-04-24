import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/registroAsistencia.css"
import { API_URL } from "../config";;

export default function RegistroAsistencia() {
  const { token } = useParams();

  const [sesion, setSesion] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudianteId, setEstudianteId] = useState("");
  const [selfie, setSelfie] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);

        const respuestaSesion = await axios.get(`${API_URL}/api/asistencias/sesion/${token}`);
        

        const datosSesion = respuestaSesion.data;
        setSesion(datosSesion);

        const respuestaEstudiantes = await axios.get(`${API_URL}/api/asistencias/estudiantes-clase/${datosSesion.clase_id}`);

        setEstudiantes(respuestaEstudiantes.data);
      } catch (error) {
        console.error("Error al cargar datos de asistencia:", error);
        alert("No se pudo cargar la sesión o los estudiantes");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [token]);

  const registrar = async () => {
    if (!estudianteId) {
      alert("Selecciona un estudiante");
      return;
    }

    const formData = new FormData();
    formData.append("token_qr", token);
    formData.append("estudiante_id", estudianteId);

    if (selfie) {
      formData.append("selfie", selfie);
    }

    try {
    const respuesta = await axios.post(`${API_URL}/api/asistencias/registrar`, formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(respuesta.data.mensaje);
      setEstudianteId("");
      setSelfie(null);
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
      alert(error?.response?.data?.mensaje || "No se pudo registrar asistencia");
    }
  };

  if (cargando) {
    return (
      <div className="registro-asistencia-contenedor">
        <div className="registro-asistencia-tarjeta">
          <h1 className="registro-asistencia-titulo">Registro de Asistencia</h1>
          <p className="registro-asistencia-subtitulo">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="registro-asistencia-contenedor">
      <div className="registro-asistencia-tarjeta">
        <h1 className="registro-asistencia-titulo">Registro de Asistencia</h1>

        {sesion && (
          <p className="registro-asistencia-subtitulo">
            Clase: <strong>{sesion.nombre_clase}</strong>
          </p>
        )}

        <select
          value={estudianteId}
          onChange={(e) => setEstudianteId(e.target.value)}
          className="registro-asistencia-input"
        >
          <option value="">Selecciona tu nombre</option>
          {estudiantes.map((estudiante) => (
            <option key={estudiante.id} value={estudiante.id}>
              {estudiante.nombre} - {estudiante.carne}
            </option>
          ))}
        </select>

        <label className="registro-asistencia-label">Tomar o subir selfie</label>

        <input
          type="file"
          accept="image/*"
          capture="user"
          onChange={(e) => setSelfie(e.target.files[0])}
          className="registro-asistencia-input"
        />

        <button onClick={registrar} className="registro-asistencia-boton">
          Registrar asistencia
        </button>
      </div>
    </div>
  );
}