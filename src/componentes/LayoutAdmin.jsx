import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/panel.css";

const menu = [
  { nombre: "Panel", ruta: "/panel" },
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

function LayoutAdmin({ children }) {
  const location = useLocation();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="simple-brand">
          <h2>UMG</h2>
          <p>Menú principal</p>
        </div>

        {menu.map((item, i) => (
          <Link
            key={i}
            to={item.ruta}
            className={`menu-btn ${
              location.pathname === item.ruta ? "active" : ""
            }`}
          >
            {item.nombre}
          </Link>
        ))}
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}

export default LayoutAdmin;