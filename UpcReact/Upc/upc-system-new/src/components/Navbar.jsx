import { Link } from 'react-router-dom';

const Navbar = ({ showBackLink, backText, backTo }) => {
  // ✅ Detectar si hay sesión activa y el rol del usuario
  const usuario = JSON.parse(localStorage.getItem('user')) || null;
  const panelLink = usuario?.role === 'owner' ? '/owner' : '/user';

  return (
    <nav>
      {/* Logo siempre visible */}
      <Link to="/" className="logo">Upc <span>System</span> Pro</Link>

      {/* Si showBackLink es TRUE, muestra el botón de volver */}
      {showBackLink ? (
        <Link to={backTo} className="back-link">
          <i className="fas fa-arrow-left"></i> {backText}
        </Link>
      ) : (
        <>
          <ul className="nav-menu">
            <li><a href="#servicios">Servicios</a></li>
            <li><a href="#tecnicos">Técnicos</a></li>
            <li><a href="#catalogo">Catálogo</a></li>
            <li><a href="#ubicacion">Ubicación</a></li>

            {usuario ? (
              /* ✅ Si hay sesión activa: mostrar botón Mi Panel */
              <li>
                <Link to={panelLink} className="btn-nav">
                  <i className="fas fa-user"></i> Mi Panel
                </Link>
              </li>
            ) : (
              /* ✅ Si no hay sesión: mostrar Iniciar Sesión y Registrarse */
              <>
                <li><Link to="/login">Iniciar Sesión</Link></li>
                <li><Link to="/register" className="btn-nav">Registrarse</Link></li>
              </>
            )}
          </ul>

          {/* Botón hamburguesa para móvil */}
          <button className="hamburger">
            <i className="fas fa-bars"></i>
          </button>
        </>
      )}
    </nav>
  );
};

export default Navbar;