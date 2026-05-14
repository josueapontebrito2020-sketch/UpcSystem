import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/global.css';
import '../styles/auth.css';
import '../styles/login.css';
import { login } from '../api/authService'; // 👈 1. Importa el servicio

const Login = () => {
  const navigate = useNavigate(); // Permite redirigir al usuario a otra página
  const [email, setEmail] = useState('');    // Guarda lo que el usuario escribe en el campo email
  const [password, setPassword] = useState(''); // Guarda lo que el usuario escribe en el campo contraseña
  const [error, setError] = useState('');    // Guarda el mensaje de error si el login falla
  const [loading, setLoading] = useState(false); // Controla si el botón muestra "Iniciando sesión..."

  const handleLogin = async (event) => {
    event.preventDefault(); // Evita que el formulario recargue la página al enviarse
    setError('');      // Limpia cualquier error anterior antes de intentar
    setLoading(true);  // Activa el estado de carga, deshabilita el botón

    try {
      const usuario = await login(email, password); // Llama a authService.js → que llama a POST api/auth/login con email y password

      // Lee el rol que devolvió la API y redirige según corresponda
      if (usuario.role === 'owner') {
        navigate('/owner'); // Si es propietario → va al panel del dueño
      } else {
        navigate('/user');  // Si es cliente → va al panel de usuario
      }

    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor'); // Muestra el error que lanzó authService.js (ej: "Correo o contraseña incorrectos")
    } finally {
      setLoading(false); // Siempre desactiva el estado de carga, haya error o no
    }
  };


  return (
    <div className="auth-page">
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
                <div className="feat-icon"><i>💬</i><i className="fas fa-comments"></i></div>
                Chat directo con tu técnico
              </div>
              <div className="feat">
                <div className="feat-icon"><i>📊</i><i className="fas fa-timeline"></i></div>
                Estado de reparación en tiempo real
              </div>
              <div className="feat">
                <div className="feat-icon"><i>🛡️</i><i className="fas fa-shield-halved"></i></div>
                Garantía registrada en tu cuenta
              </div>
            </div>
          </div>

          {/* FORMULARIO DE LOGIN */}
          <div className="auth-form-wrap">
            <div className="form-title">Iniciar Sesión</div>
            <div className="form-sub">Ingresa tus datos para continuar</div>

            {/* Mensaje de error */}
            {error && (
              <div style={{
                background: '#ff4d4d22',
                border: '1px solid #ff4d4d',
                color: '#ff4d4d',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
  <label>Correo electrónico</label>
  <div className="input-wrap">
    <span className="input-icon-inside">✉️</span> {/* El emoji aquí */}
    <input
      type="email"
      placeholder="tu@correo.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
  </div>
</div>

              <div className="form-group">
                <label>Contraseña</label>
                <div className="input-wrap">
                  <i className="fas fa-lock"></i>
                  <span className="input-icon-inside">🔒</span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row-opts">
                <label className="check-label">
                  <input type="checkbox" style={{ width: 'auto', padding: 0 }} />
                  Recordarme
                </label>
                <a href="#" className="forgot">¿Olvidaste tu contraseña?</a>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="divider"><span>o</span></div>

            <button className="btn-owner" onClick={() => {
              setEmail('admin@test.com');
              setPassword('123');
            }}>
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