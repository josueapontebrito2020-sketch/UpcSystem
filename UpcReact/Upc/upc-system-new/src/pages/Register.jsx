import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/global.css';
import '../styles/auth.css';
import '../styles/register.css';
import apiClient from '../api/apiClient';

const Register = () => {
  const navigate = useNavigate(); // Permite redirigir al usuario a otra página
  const [showSuccess, setShowSuccess] = useState(false); // Controla si muestra el formulario o la pantalla de éxito
  const [loading, setLoading] = useState(false);         // Controla si el botón muestra "Creando cuenta..."
  const [error, setError] = useState('');                // Guarda el mensaje de error si el registro falla
  const [strength, setStrength] = useState({ width: '0%', color: '#eee', label: 'Ingresa una contraseña' }); // Controla la barra de seguridad de la contraseña

  const [form, setForm] = useState({  // Guarda todos los campos del formulario en un solo objeto
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    ciudad: 'Valledupar', // Ciudad por defecto
    password: '',
    confirmar: ''         // Este campo NO se envía a la API, solo sirve para validar localmente
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // Actualiza solo el campo que cambió, mantiene los demás igual
    if (e.target.name === 'password') handlePasswordInput(e.target.value); // Si el campo es password, actualiza la barra de seguridad
  };

  const handlePasswordInput = (value) => { // Calcula la seguridad de la contraseña según su longitud
    if (value.length === 0) {
      setStrength({ width: '0%', color: '#eee', label: 'Ingresa una contraseña' }); // Sin contraseña
    } else if (value.length < 5) {
      setStrength({ width: '30%', color: '#ff4d4d', label: 'Débil' });   // Menos de 5 caracteres → débil
    } else if (value.length < 8) {
      setStrength({ width: '60%', color: '#ffd11a', label: 'Media' });   // Entre 5 y 7 caracteres → media
    } else {
      setStrength({ width: '100%', color: '#00cc66', label: 'Fuerte' }); // 8 o más caracteres → fuerte
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault(); // Evita que el formulario recargue la página
    setError(''); // Limpia errores anteriores

    if (form.password !== form.confirmar) { // Valida localmente que las contraseñas coincidan ANTES de llamar a la API
      setError('Las contraseñas no coinciden');
      return; // Corta aquí, no llama a la API
    }

    setLoading(true); // Activa estado de carga

    try {
      const data = await apiClient.post('auth/register', { // POST api/auth/register → crea el usuario en la BD
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        telefono: form.telefono,
        ciudad: form.ciudad,
        password: form.password
        // ⚠️ 'confirmar' NO se envía a la API, solo se usó para validar localmente
      });

      if (data.mensaje && !data.token) { // Si la API devuelve un mensaje pero no un token significa que hubo error (ej: correo ya registrado)
        setError(data.mensaje); // Muestra el error que mandó la API
        return;
      }

      const usuario = { // Construye el objeto usuario con la respuesta de la API
        id: data.Id ?? data.id,           // ?? = si el primero es null/undefined usa el segundo (maneja mayúsculas y minúsculas)
        nombre: data.Nombre ?? data.nombre,
        apellido: data.Apellido ?? data.apellido,
        email: data.Email ?? data.email,
        role: data.Role ?? data.role,
        telefono: form.telefono, // Estos dos vienen del form porque la API no los devuelve
        ciudad: form.ciudad,
        token: data.token
      };

      localStorage.setItem('user', JSON.stringify(usuario)); // Guarda el usuario en localStorage para que toda la app lo pueda leer
      localStorage.setItem('token', data.token);             // Guarda el token suelto para que apiClient lo incluya en las siguientes peticiones
      setShowSuccess(true); // Cambia la vista al mensaje de éxito

    } catch (err) {
      setError('No se pudo conectar con el servidor'); // Error de red, la API no respondió
    } finally {
      setLoading(false); // Siempre desactiva el estado de carga, haya error o no
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