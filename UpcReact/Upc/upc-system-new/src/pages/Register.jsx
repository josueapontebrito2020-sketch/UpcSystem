import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/global.css';
import '../styles/auth.css';
import '../styles/register.css';
import apiClient from '../api/apiClient';

const Register = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [strength, setStrength] = useState({ width: '0%', color: '#eee', label: 'Ingresa una contraseña' });

  // Estado del formulario
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    ciudad: 'Valledupar',
    password: '',
    confirmar: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'password') handlePasswordInput(e.target.value);
  };

  const handlePasswordInput = (value) => {
    if (value.length === 0) {
      setStrength({ width: '0%', color: '#eee', label: 'Ingresa una contraseña' });
    } else if (value.length < 5) {
      setStrength({ width: '30%', color: '#ff4d4d', label: 'Débil' });
    } else if (value.length < 8) {
      setStrength({ width: '60%', color: '#ffd11a', label: 'Media' });
    } else {
      setStrength({ width: '100%', color: '#00cc66', label: 'Fuerte' });
    }
  };

  const handleRegister = async (event) => {
  event.preventDefault();
  setError('');

  if (form.password !== form.confirmar) {
    setError('Las contraseñas no coinciden');
    return;
  }

  setLoading(true);

  try {
    const data = await apiClient.post('auth/register', { // 👈 usa apiClient (lleva x-api-key)
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      telefono: form.telefono,
      ciudad: form.ciudad,
      password: form.password
    });

    if (data.mensaje && !data.token) {
      setError(data.mensaje);
      return;
    }

    const usuario = {
      id: data.Id ?? data.id,
      nombre: data.Nombre ?? data.nombre,
      apellido: data.Apellido ?? data.apellido,
      email: data.Email ?? data.email,
      role: data.Role ?? data.role,
      telefono: form.telefono,
      ciudad: form.ciudad,
      token: data.token
    };

    localStorage.setItem('user', JSON.stringify(usuario)); // 👈 'user' consistente con authService
    localStorage.setItem('token', data.token);             // 👈 también guarda el token suelto
    setShowSuccess(true);

  } catch (err) {
    setError('No se pudo conectar con el servidor');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-page">
      <nav>
        <Link to="/" className="logo">Upc <span>System</span> Pro</Link>
        <Link to="/login" className="back-link">
          <i className="fas fa-arrow-left"></i> Ya tengo cuenta
        </Link>
      </nav>

      <main>
        <div className="register-box">
          {!showSuccess ? (
            <div id="formContent">
              <div className="form-header">
                <div className="form-icon">👤</div>
                <div className="form-title">Crear cuenta</div>
                <div className="form-sub">Regístrate para hacer seguimiento a tus reparaciones</div>
              </div>

              {error && (
                <div className="error-alert">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>NOMBRE</label>
                    <div className="input-wrap">
                      <span className="input-icon">👤</span>
                      <input
                        type="text"
                        name="nombre"
                        placeholder="Juan"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>APELLIDO</label>
                    <div className="input-wrap">
                      <span className="input-icon">👤</span>
                      <input
                        type="text"
                        name="apellido"
                        placeholder="Pérez"
                        value={form.apellido}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group full">
                    <label>CORREO ELECTRÓNICO</label>
                    <div className="input-wrap">
                      <span className="input-icon">✉️</span>
                      <input
                        type="email"
                        name="email"
                        placeholder="tu@correo.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group full">
                    <label>NÚMERO DE TELÉFONO</label>
                    <div className="input-wrap">
                      <span className="input-icon">📞</span>
                      <input
                        type="tel"
                        name="telefono"
                        placeholder="+57 310 123 4567"
                        value={form.telefono}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group full">
                    <label>CIUDAD</label>
                    <div className="input-wrap">
                      <select
                        name="ciudad"
                        value={form.ciudad}
                        onChange={handleChange}
                      >
                        <option value="">Seleccionar ciudad</option>
                        <option value="Valledupar">Valledupar</option>
                        <option value="Barranquilla">Barranquilla</option>
                        <option value="Bogotá">Bogotá</option>
                        <option value="Medellín">Medellín</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group full">
                    <label>CONTRASEÑA</label>
                    <div className="input-wrap">
                      <span className="input-icon">🔒</span>
                      <input
                        type="password"
                        name="password"
                        placeholder="Mínimo 8 caracteres"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="strength-bar">
                      <div
                        className="strength-fill"
                        style={{ width: strength.width, backgroundColor: strength.color }}
                      ></div>
                    </div>
                    <div className="strength-label">{strength.label}</div>
                  </div>

                  <div className="form-group full">
                    <label>CONFIRMAR CONTRASEÑA</label>
                    <div className="input-wrap">
                      <span className="input-icon">🔒</span>
                      <input
                        type="password"
                        name="confirmar"
                        placeholder="Repite tu contraseña"
                        value={form.confirmar}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="terms">
                  <input type="checkbox" id="termsCheck" required />
                  <label htmlFor="termsCheck">
                    Acepto los <a href="#">Términos y Condiciones</a> y la <a href="#">Política de Privacidad</a>.
                  </label>
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
                </button>
              </form>

              <div className="login-link">
                ¿Ya tienes cuenta? <Link to="/login">Regístrate gratis</Link>
              </div>
            </div>
          ) : (
            /* VISTA DE ÉXITO (IGUAL A TU IMAGEN) */
            <div className="success-container">
              <div className="success-icon-wrap">🎉</div>
              <h1 className="success-title">¡Cuenta creada!</h1>
              <p className="success-text">
                Tu cuenta ha sido creada exitosamente. Ya puedes iniciar sesión y solicitar tus reparaciones.
              </p>
              <button 
                onClick={() => navigate('/user')} 
                className="btn-submit"
              >
                Ir a mi panel →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Register;