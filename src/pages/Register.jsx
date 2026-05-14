import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/global.css';
import '../styles/auth.css';
import '../styles/register.css'; // Basado en register_2.html[cite: 8]

const Register = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [strength, setStrength] = useState({ width: '0%', color: '#eee', label: 'Ingresa una contraseña' });

  // Lógica para la barra de seguridad (reemplaza checkStrength de register.js)
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

  const handleRegister = (event) => {
    event.preventDefault();
    // Aquí iría la conexión con tu base de datos
    setShowSuccess(true);
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

              <form onSubmit={handleRegister}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre</label>
                    <div className="input-wrap">
                      <i className="fas fa-user"></i>
                      <input type="text" placeholder="Juan" required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Apellido</label>
                    <div className="input-wrap">
                      <i className="fas fa-user"></i>
                      <input type="text" placeholder="Pérez" required />
                    </div>
                  </div>

                  <div className="form-group full">
                    <label>Correo electrónico</label>
                    <div className="input-wrap">
                      <i className="fas fa-envelope"></i>
                      <input type="email" placeholder="tu@correo.com" required />
                    </div>
                  </div>

                  <div className="form-group full">
                    <label>Número de teléfono</label>
                    <div className="input-wrap">
                      <i className="fas fa-phone"></i>
                      <input type="tel" placeholder="+57 310 123 4567" />
                    </div>
                  </div>

                  <div className="form-group full">
                    <label>Ciudad</label>
                    <div className="input-wrap">
                      <select defaultValue="Valledupar">
                        <option value="">Seleccionar ciudad</option>
                        <option value="Valledupar">Valledupar</option>
                        <option value="Barranquilla">Barranquilla</option>
                        <option value="Bogotá">Bogotá</option>
                        <option value="Medellín">Medellín</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group full">
                    <label>Contraseña</label>
                    <div className="input-wrap">
                      <i className="fas fa-lock"></i>
                      <input 
                        type="password" 
                        placeholder="Mínimo 8 caracteres" 
                        required 
                        onChange={(e) => handlePasswordInput(e.target.value)}
                      />
                    </div>
                    {/* Barra de seguridad reactiva */}
                    <div className="strength-bar">
                      <div 
                        className="strength-fill" 
                        style={{ width: strength.width, backgroundColor: strength.color }}
                      ></div>
                    </div>
                    <div className="strength-label">{strength.label}</div>
                  </div>

                  <div className="form-group full">
                    <label>Confirmar contraseña</label>
                    <div className="input-wrap">
                      <i className="fas fa-lock"></i>
                      <input type="password" placeholder="Repite tu contraseña" required />
                    </div>
                  </div>
                </div>

                <div className="terms">
                  <input type="checkbox" id="termsCheck" required />
                  <label htmlFor="termsCheck" style={{ textTransform: 'none', letterSpacing: 0, fontSize: '0.83rem' }}>
                    Acepto los <a href="#">Términos y Condiciones</a> y la <a href="#">Política de Privacidad</a>.
                  </label>
                </div>

                <button type="submit" className="btn-submit">
                  <i className="fas fa-user-plus"></i> Crear cuenta gratis
                </button>
              </form>

              <div className="login-link">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
              </div>
            </div>
          ) : (
            /* Mensaje de éxito que se muestra cuando showSuccess es true */
            <div className="success-msg">
              <div className="icon">🎉</div>
              <h3>¡Cuenta creada!</h3>
              <p>Tu cuenta ha sido creada exitosamente. Ya puedes iniciar sesión y solicitar tus reparaciones.</p>
              <button onClick={() => navigate('/user')} className="btn-submit" style={{ border: 'none', cursor: 'pointer' }}>
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