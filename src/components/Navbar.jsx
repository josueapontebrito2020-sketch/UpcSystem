import { Link } from 'react-router-dom';

const Navbar = ({ showBackLink, backText, backTo }) => {
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
        /* Si showBackLink es FALSE, muestra el menú completo */
        <>
          <ul className="nav-menu">
            {/* Cambiamos Link por <a> para anclas internas */}
            <li><a href="#servicios">Servicios</a></li>
            <li><a href="#tecnicos">Técnicos</a></li>
            <li><a href="#catalogo">Catálogo</a></li>
            <li><a href="#ubicacion">Ubicación</a></li>
            
            {/* Estos sí se mantienen como Link porque son páginas aparte */}
            <li><Link to="/login">Iniciar Sesión</Link></li>
            <li><Link to="/register" className="btn-nav">Registrarse</Link></li>
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