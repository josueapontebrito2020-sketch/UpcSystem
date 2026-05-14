import '../styles/global.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-logo">Upc System Pro</div>
      <div className="footer-sub">Reparaciones & Accesorios – Valledupar, Cesar</div>
      <div className="footer-links">
        <a href="#servicios">Servicios</a>
        <a href="#tecnicos">Técnicos</a>
        <a href="#catalogo">Catálogo</a>
        <a href="#ubicacion">Ubicación</a>
        <a href="/login">Iniciar Sesión</a>
        <a href="/register">Registrarse</a>
      </div>
      <div className="footer-copy">© 2025 Upc System Pro. Todos los derechos reservados.</div>
    </footer>
  );
};

export default Footer;