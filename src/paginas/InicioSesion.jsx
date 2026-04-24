import "./InicioSesion.css";

export default function InicioSesion() {
  return (
    <div className="login-page">
      <div className="decor decor-left"></div>
      <div className="decor decor-right"></div>

      <section className="info-panel">
        <div className="brand">
          <div className="logo-circle">🎓</div>
          <h1>ClassAssist Pro</h1>
        </div>

        <p className="description">
          La plataforma integral para la gestión académica del catedrático.
        </p>

        <div className="feature">
          <div className="feature-icon purple">📋</div>
          <div>
            <h3>Gestión de clases</h3>
            <p>Organiza tus clases, materiales y actividades.</p>
          </div>
        </div>

        <div className="feature">
          <div className="feature-icon blue">📈</div>
          <div>
            <h3>Seguimiento académico</h3>
            <p>Monitorea el progreso y rendimiento de tus estudiantes.</p>
          </div>
        </div>

        <div className="feature">
          <div className="feature-icon green">👥</div>
          <div>
            <h3>Comunicación efectiva</h3>
            <p>Mantén una comunicación fluida con tus estudiantes.</p>
          </div>
        </div>
      </section>

      <section className="login-card">
        <div className="user-icon">👤</div>

        <h2>Bienvenido de nuevo</h2>
        <p className="subtitle">Inicia sesión para continuar</p>

        <form>
          <label>Correo electrónico</label>
          <input type="email" placeholder="tu@correo.com" />

          <label>Contraseña</label>
          <input type="password" placeholder="Ingresa tu contraseña" />

          <div className="options">
            <label className="remember">
              <input type="checkbox" />
              Recordarme
            </label>

            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit">Ingresar ›</button>
        </form>

        <p className="help">
          ¿Necesitas ayuda? <a href="#">Contacta al administrador</a>
        </p>
      </section>
    </div>
  );
}