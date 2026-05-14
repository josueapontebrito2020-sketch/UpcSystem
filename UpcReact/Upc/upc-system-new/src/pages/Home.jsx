import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import TechCard from '../components/TechCard';
import ProductCard from '../components/ProductCard';
import '../styles/global.css';
import '../styles/index.css';
import apiClient from '../api/apiClient'; // 👈

const Home = () => {
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [servicios, setServicios] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [accesorios, setAccesorios] = useState([]);

  useEffect(() => {
    apiClient.get('servicios')  // 👈
      .then(data => setServicios(data))
      .catch(err => console.error('Error servicios:', err));

    apiClient.get('tecnicos')   // 👈
      .then(data => setTecnicos(data))
      .catch(err => console.error('Error tecnicos:', err));

    apiClient.get('accesorios') // 👈
      .then(data => setAccesorios(data))
      .catch(err => console.error('Error accesorios:', err));
  }, []);

  const productosFiltrados = categoriaActiva === 'todos'
    ? accesorios
    : accesorios.filter(p => p.categoria === categoriaActiva);

  useEffect(() => {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(el => fadeObserver.observe(el));
    return () => fadeObserver.disconnect();
  }, [categoriaActiva]);

  return (
    <div className="home-container">
      <Navbar />

      <section className="hero fade-in">
        <div className="hero-content">
          <h1>Soluciones Tecnológicas al <span>Alcance de tu Mano</span></h1>
          <p>Expertos en reparación de hardware y software en Valledupar. Calidad garantizada para tus dispositivos.</p>
          <div className="hero-btns">
            <a href="#catalogo" className="btn-primary">Ver Catálogo</a>
            <a href="#tecnicos" className="btn-secondary">Nuestros Técnicos</a>
          </div>
        </div>
      </section>

      <section id="servicios" className="section fade-in">
        <div className="section-tag">LO QUE HACEMOS</div>
        <h2 className="section-title">Servicios de reparación</h2>
        <p className="section-subtitle">Soluciones rápidas y confiables para todos tus dispositivos electrónicos.</p>
        <div className="services-grid">
          {servicios.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Cargando servicios...</p>
          ) : (
            servicios.map(s => (
              <ServiceCard
                key={s.id}
                icon={s.icono}
                title={s.titulo}
                description={s.descripcion}
                price={s.precioDesde}
              />
            ))
          )}
        </div>
      </section>

      <section id="tecnicos" className="section fade-in">
        <h2 className="section-title">Técnicos Expertos</h2>
        <div className="techs-grid">
          {tecnicos.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Cargando técnicos...</p>
          ) : (
            tecnicos.map(t => (
              <TechCard
                key={t.id}
                avatar={t.avatar}
                name={t.nombre}
                role={t.rol}
                bio={t.bio}
                skills={t.skills}
                rating={t.ratingTexto}
              />
            ))
          )}
        </div>
      </section>

      <section id="catalogo" className="section fade-in">
        <h2 className="section-title">Accesorios Disponibles</h2>
        <div className="filter-container">
          {['todos', 'fundas', 'cargadores', 'audio', 'cables'].map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${categoriaActiva === cat ? 'active' : ''}`}
              onClick={() => setCategoriaActiva(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div className="products-grid">
          {accesorios.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Cargando accesorios...</p>
          ) : productosFiltrados.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center' }}>No hay productos en esta categoría.</p>
          ) : (
            productosFiltrados.map(prod => (
              <ProductCard
                key={prod.id}
                emoji={prod.emoji}
                badge={prod.badge}
                name={prod.nombre}
                desc={prod.descripcion}
                price={prod.precio}
              />
            ))
          )}
        </div>
      </section>

      <section id="ubicacion" className="section fade-in">
        <div className="location-container">
          <div className="location-info">
            <span className="section-tag-alt">ENCUÉNTRANOS</span>
            <h2 className="location-title">Visítanos en nuestro local</h2>
            <div className="info-item">
              <i className="fas fa-map-marker-alt"></i>
              <div><h4>Dirección</h4><p>Diagonal 21 n.º 29-56, Barrio Sabanas del Valle.</p><p>Valledupar, Cesar</p></div>
            </div>
            <div className="info-item">
              <i className="fas fa-clock"></i>
              <div><h4>Horario de atención</h4><p>Lunes a Viernes: 8:00 am – 7:00 pm</p><p>Sábados: 9:00 am – 5:00 pm</p></div>
            </div>
            <div className="info-item">
              <i className="fas fa-phone-alt"></i>
              <div><h4>Teléfono / WhatsApp</h4><p>+57 311 365 9462</p></div>
            </div>
            <div className="info-item">
              <i className="fas fa-envelope"></i>
              <div><h4>Correo</h4><p>upcsystemvalledupar@unicesar.com</p></div>
            </div>
          </div>
          <div className="location-map-card">
            <div className="map-content">
              <i className="fas fa-map-marked-alt map-icon"></i>
              <h3>Mapa interactivo</h3>
              <p>Valledupar, Cesar – Colombia</p>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="btn-map">
                Cómo llegar
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;