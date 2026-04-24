import React from "react";
import { Link } from "react-router-dom";
import "../styles/panel.css";
import logoUMG from "../assets/umg-logo.png";

const modulos = [
  {
    titulo: "Gestión de Clases",
    descripcion: "Crea, edita y organiza tus clases",
    ruta: "/clases",
    icono: "📘",
  },
  {
    titulo: "Gestión de Estudiantes",
    descripcion: "Administra estudiantes y carga desde Excel",
    ruta: "/estudiantes",
    icono: "👥",
  },
  {
    titulo: "Asistencia con QR",
    descripcion: "Genera sesiones y registra asistencia",
    ruta: "/asistencias",
    icono: "📷",
  },
  {
    titulo: "Ruleta de Participación",
    descripcion: "Selecciona estudiantes presentes aleatoriamente",
    ruta: "/ruleta",
    icono: "🎯",
  },
  {
    titulo: "Grupos Aleatorios",
    descripcion: "Forma grupos de trabajo automáticamente",
    ruta: "/grupos",
    icono: "👨‍👩‍👧‍👦",
  },
  {
    titulo: "Temporizador",
    descripcion: "Controla el tiempo de tus actividades",
    ruta: "/temporizador",
    icono: "⏱️",
  },
  {
    titulo: "Pantalla de Clase",
    descripcion: "Vista en vivo para proyección",
    ruta: "/pantalla-clase",
    icono: "🖥️",
  },
  {
    titulo: "Ranking de Desempeño",
    descripcion: "Visualiza el rendimiento de estudiantes",
    ruta: "/ranking",
    icono: "🏆",
  },
];

const menuItems = [
  { nombre: "Panel", ruta: "/" },
  { nombre: "Clases", ruta: "/clases" },
  { nombre: "Estudiantes", ruta: "/estudiantes" },
  { nombre: "Asistencias", ruta: "/asistencias" },
  { nombre: "Ruleta", ruta: "/ruleta" },
  { nombre: "Grupos", ruta: "/grupos" },
  { nombre: "Temporizador", ruta: "/temporizador" },
  { nombre: "Pantalla de Clase", ruta: "/pantalla-clase" },
  { nombre: "Ranking", ruta: "/ranking" },
  { nombre: "Exportación Excel", ruta: "/exportacion-excel" },
];

function Panel() {
  const cerrarSesion = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div>
          <div className="sidebar-brand">
            <img src={logoUMG} alt="Logo UMG" className="sidebar-logo" />
            <h2>Universidad Mariano Galvez de Guatemala</h2>
            <p>Gestión inteligente de clases</p>
          </div>

          <nav className="sidebar-menu">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.ruta}
                className={`menu-btn ${index === 0 ? "active" : ""}`}
              >
                {item.nombre}
              </Link>
            ))}
          </nav>
        </div>

        <div
          className="sidebar-user"
          onClick={cerrarSesion}
          style={{ cursor: "pointer" }}
          title="Cerrar sesión"
        >
          <div>
            <strong>Admin</strong>
            <p>admin@correo.com</p>
          </div>
          <span className="logout-icon">↪</span>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div className="topbar-right">
            <span className="top-icon">🔔</span>
            <div className="user-pill">
              <span className="user-avatar">👤</span>
              <span>Admin</span>
            </div>
          </div>
        </div>

        <section className="hero-panel">
          <div className="hero-left">
            <img src={logoUMG} alt="Logo UMG" className="hero-logo" />
            <div>
              <h1>UMG</h1>
              <p>Panel principal del catedrático</p>
            </div>
          </div>
          <div className="hero-icon">🎓</div>
        </section>

        <section className="welcome-row">
          <div>
            <h2>
              ¡Bienvenido, <span>Admin</span>! 👋
            </h2>
            <p>
              Gestiona tus clases de manera eficiente y mejora la experiencia de
              aprendizaje.
            </p>
          </div>
          <div className="status-pill">● Sistema Activo</div>
        </section>

        <section className="stats-grid">
          <div className="stat-card stat-blue">
            <div className="stat-icon">📖</div>
            <div>
              <h3>6</h3>
              <p>Clases Activas</p>
            </div>
          </div>

          <div className="stat-card stat-green">
            <div className="stat-icon">👥</div>
            <div>
              <h3>125</h3>
              <p>Estudiantes</p>
            </div>
          </div>

          <div className="stat-card stat-purple">
            <div className="stat-icon">🧾</div>
            <div>
              <h3>24</h3>
              <p>Asistencias Hoy</p>
            </div>
          </div>

          <div className="stat-card stat-yellow">
            <div className="stat-icon">🏆</div>
            <div>
              <h3>4.8</h3>
              <p>Promedio del Curso</p>
            </div>
          </div>
        </section>

        <section className="modules-section">
          <h2>Módulos del sistema</h2>
          <p>Accede rápidamente a cada funcionalidad principal del proyecto</p>

          <div className="modules-grid">
            {modulos.map((modulo, index) => (
              <div className="module-card" key={index}>
                <div className="module-icon">{modulo.icono}</div>
                <h3>{modulo.titulo}</h3>
                <p>{modulo.descripcion}</p>
                <Link to={modulo.ruta} className="module-btn">
                  Abrir módulo →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <footer className="panel-footer">
          © 2026 UMG - Universidad Mariano Gálvez de Guatemala
        </footer>
      </main>
    </div>
  );
}

export default Panel;