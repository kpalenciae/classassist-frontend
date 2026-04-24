import { useEffect, useRef, useState } from "react";
import LayoutAdmin from "../componentes/LayoutAdmin";
import "../styles/panel.css";

export default function Temporizador() {
  const [minutos, setMinutos] = useState(5);
  const [segundosRestantes, setSegundosRestantes] = useState(5 * 60);
  const [activo, setActivo] = useState(false);
  const [finalizado, setFinalizado] = useState(false);

  const intervaloRef = useRef(null);

  useEffect(() => {
    if (activo) {
      intervaloRef.current = setInterval(() => {
        setSegundosRestantes((prev) => {
          if (prev <= 1) {
            clearInterval(intervaloRef.current);
            setActivo(false);
            setFinalizado(true);
            alert("¡Tiempo finalizado!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervaloRef.current);
  }, [activo]);

  const iniciar = () => {
    if (segundosRestantes > 0) {
      setFinalizado(false);
      setActivo(true);
    }
  };

  const pausar = () => {
    clearInterval(intervaloRef.current);
    setActivo(false);
  };

  const reiniciar = () => {
    clearInterval(intervaloRef.current);
    setActivo(false);
    setFinalizado(false);
    setSegundosRestantes(Number(minutos) * 60);
  };

  const cambiarMinutos = (valor) => {
    const nuevoValor = Number(valor);
    setMinutos(valor);

    if (!valor || nuevoValor < 0) {
      setSegundosRestantes(0);
      setActivo(false);
      setFinalizado(false);
      clearInterval(intervaloRef.current);
      return;
    }

    setSegundosRestantes(nuevoValor * 60);
    setActivo(false);
    setFinalizado(false);
    clearInterval(intervaloRef.current);
  };

  const formatoTiempo = (totalSegundos) => {
    const min = Math.floor(totalSegundos / 60);
    const seg = totalSegundos % 60;
    return `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
  };

  return (
    <LayoutAdmin>
      <div className="page-box">
        <div className="page-hero">
          <h1>Temporizador de Actividades</h1>
          <p>Configura, inicia, pausa y reinicia el tiempo de tus actividades.</p>
        </div>

        <div className="content-card" style={{ textAlign: "center" }}>
          <div style={{ maxWidth: "420px", margin: "0 auto 26px auto" }}>
            <label
              style={{
                fontWeight: 700,
                color: "#475569",
                display: "block",
                marginBottom: "10px",
              }}
            >
              Ingresa la duración en minutos
            </label>

            <input
              className="input-modern"
              type="number"
              min="0"
              step="1"
              value={minutos}
              onChange={(e) => cambiarMinutos(e.target.value)}
              disabled={activo}
              placeholder="Ejemplo: 7"
            />
          </div>

          <div
            style={{
              fontSize: "clamp(56px, 10vw, 96px)",
              fontWeight: 800,
              color: finalizado ? "#dc2626" : "#0f172a",
              marginBottom: "28px",
              letterSpacing: "2px",
            }}
          >
            {formatoTiempo(segundosRestantes)}
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={iniciar}
              className="btn-primary-modern"
              style={{ background: "#22c55e" }}
              disabled={activo || segundosRestantes <= 0}
            >
              Iniciar
            </button>

            <button
              onClick={pausar}
              className="btn-primary-modern"
              style={{ background: "#f59e0b" }}
              disabled={!activo}
            >
              Pausar
            </button>

            <button onClick={reiniciar} className="btn-primary-modern">
              Reiniciar
            </button>
          </div>

          {finalizado && (
            <div
              style={{
                marginTop: "24px",
                padding: "14px",
                borderRadius: "14px",
                background: "#fee2e2",
                color: "#b91c1c",
                fontWeight: 700,
              }}
            >
              La actividad ha terminado.
            </div>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
}