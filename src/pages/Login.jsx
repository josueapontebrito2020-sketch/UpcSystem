import { Link, useNavigate } from 'react-router-dom';
import '../styles/global.css';
import '../styles/auth.css';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    // Aquí irá tu lógica de login.js más adelante. 
    // Por ahora, simulamos que entra al dashboard de usuario.
    navigate('/user');
  };

  return (
    <div className="auth-page">
      {/* NAV simplificada */}
      <nav>
        <Link to="/" className="logo">Upc <span>System</span> Pro</Link>
        <Link to="/" className="back-link">
          <i className="fas fa-arrow-left"></i> Volver al inicio
        </Link>
      </nav>

      <main>
        <div className="auth-wrapper">
          
          {/* PANEL DECORATIVO IZQUIERDO */}
          <div className="auth-side">
            <div className="side-tag">Bienvenido de vuelta</div>
            <div className="side-title">Tu dispositivo en buenas manos</div>
            <div className="side-desc">
              Inicia sesión para ver el estado de tu reparación y chatear con nuestros técnicos.
            </div>

            <div className="side-features">
              <div className="feat">
                <div className="feat-icon"><i className="fas fa-comments"></i></div>
                Chat directo con tu técnico
              </div>
              <div className="feat">
                <div className="feat-icon"><i className="fas fa-timeline"></i></div>
                Estado de reparación en tiempo real
              </div>
              <div className="feat">
                <div className="feat-icon"><i className="fas fa-shield-halved"></i></div>
                Garantía registrada en tu cuenta
              </div>
            </div>
          </div>

          {/* FORMULARIO DE LOGIN */}
          <div className="auth-form-wrap">
            <div className="form-title">Iniciar Sesión</div>
            <div className="form-sub">Ingresa tus datos para continuar</div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Correo electrónico</label>
                <div className="input-wrap">
                  <i className="fas fa-envelope"></i>
                  <input type="email" id="email" placeholder="tu@correo.com" required />
                </div>
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <div className="input-wrap">
                  <i className="fas fa-lock"></i>
                  <input type="password" id="password" placeholder="••••••••" required />
                </div>
              </div>

              <div className="row-opts">
                <label className="check-label">
                  <input type="checkbox" style={{ width: 'auto', padding: 0 }} />
                  Recordarme
                </label>
                <a href="#" className="forgot">¿Olvidaste tu contraseña?</a>
              </div>

              <button type="submit" className="btn-submit">Iniciar Sesión</button>
            </form>

            <div className="divider"><span>o</span></div>

            {/* Acceso directo al panel del propietario */}
            <button className="btn-owner" onClick={() => navigate('/owner')}>
              <i className="fas fa-user-gear"></i> Acceso propietario / administrador
            </button>

            <div className="register-link">
              ¿No tienes cuenta? <Link to="/register">Regístrate gratis</Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Login;