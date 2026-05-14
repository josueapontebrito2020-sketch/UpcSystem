import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import TechCard from '../components/TechCard';
import ProductCard from '../components/ProductCard';
import '../styles/global.css';
import '../styles/index.css';

const Home = () => {
  // Estado para controlar el filtro de categorías
  const [categoriaActiva, setCategoriaActiva] = useState('todos');

  // Datos del catálogo
  const productos = [
    { id: 1, emoji: "📱", badge: "Nuevo", name: "Funda iPhone 15", desc: "Silicona premium con protección MagSafe", price: "$28.000", category: "fundas" },
    { id: 2, emoji: "📱", name: "Funda Samsung S24", desc: "Armor case antigolpes nivel militar", price: "$32.000", category: "fundas" },
    { id: 3, emoji: "⚡", badge: "Top", name: "Cargador USB-C 65W", desc: "Carga rápida universal GaN", price: "$55.000", category: "cargadores" },
    { id: 4, emoji: "🔋", name: "Power Bank 20.000mAh", desc: "Carga 3 dispositivos simultáneamente", price: "$75.000", category: "cargadores" },
    { id: 5, emoji: "🎧", badge: "Oferta", name: "Auriculares Bluetooth", desc: "TWS con cancelación de ruido activa", price: "$89.000", category: "audio" },
    { id: 6, emoji: "🎵", name: "Audífonos Alámbricos", desc: "Jack 3.5mm, bajos potentes HD", price: "$15.000", category: "audio" },
    { id: 7, emoji: "🔌", name: "Cable USB-C 2m", desc: "Carga rápida 100W, trenzado nylon", price: "$20.000", category: "cables" },
    { id: 8, emoji: "💻", name: "Funda Laptop 15\"", desc: "Neopreno resistente al agua", price: "$45.000", category: "fundas" },
  ];

  const productosFiltrados = categoriaActiva === 'todos' 
    ? productos 
    : productos.filter(p => p.category === categoriaActiva);

  useEffect(() => {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(el => fadeObserver.observe(el));

    return () => fadeObserver.disconnect();
  }, [categoriaActiva]);

  return (
    <div className="home-container">
      <Navbar />

      {/* Hero Section */}
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

      {/* Sección de Servicios */}
      <section id="servicios" className="section fade-in">
        <div className="section-tag">LO QUE HACEMOS</div>
        <h2 className="section-title">Servicios de reparación</h2>
        <p className="section-subtitle">Soluciones rápidas y confiables para todos tus dispositivos electrónicos.</p>
        
        <div className="services-grid">
          <ServiceCard icon="fa-mobile-screen" title="Teléfonos Móviles" description="Cambio de pantallas..." price="Desde $45.000 COP" />
          <ServiceCard icon="fa-tablet-screen-button" title="Tablets" description="Reparamos tablets Android..." price="Desde $50.000 COP" />
          <ServiceCard icon="fa-laptop" title="Computadoras" description="Reparación de portátiles..." price="Desde $80.000 COP" />
          <ServiceCard icon="fa-gamepad" title="Consolas de Juego" description="PlayStation, Xbox y Nintendo..." price="Desde $60.000 COP" />
          <ServiceCard icon="fa-print" title="Impresoras" description="Mantenimiento y configuración..." price="Desde $35.000 COP" />
          <ServiceCard icon="fa-network-wired" title="Redes & Configuración" description="Instalación de routers..." price="Desde $30.000 COP" />
        </div>
      </section>

      {/* Sección de Técnicos */}
      <section id="tecnicos" className="section fade-in">
        <h2 className="section-title">Técnicos Expertos</h2>
        <div className="techs-grid">
          <TechCard avatar="👨‍💻" name="Alan Amador" role="Especialista en Móviles" bio="+5 años reparando dispositivos iOS y Android." skills={['iPhone', 'Samsung', 'Xiaomi']} rating="★★★★★ 5.0" />
          <TechCard avatar="👩‍🔧" name="Johsua Aponte" role="Técnico de Computadoras" bio="Especialista en laptops HP, Dell y MacBook." skills={['MacBook', 'Dell', 'Asus', 'HP']} rating="★★★★★ 4.9" />
          <TechCard avatar="👨‍🔬" name="Venito Camelo" role="Redes & Software" bio="Ingeniero de sistemas con experiencia empresarial." skills={['Redes', 'Windows', 'Linux']} rating="★★★★☆ 4.7" />
          <TechCard avatar="👩‍💻" name="Rosa Melano" role="Tablets & Consolas" bio="Especialista en iPad y consolas PlayStation." skills={['iPad', 'PS5', 'Xbox']} rating="★★★★★ 4.8" />
        </div>
      </section>

      {/* Catálogo Section */}
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
          {productosFiltrados.map(prod => (
            <ProductCard 
              key={prod.id}
              emoji={prod.emoji}
              badge={prod.badge}
              name={prod.name}
              desc={prod.desc}
              price={prod.price}
            />
          ))}
        </div>
      </section>

      {/* Ubicación Actualizada (Dos Columnas) */}
      <section id="ubicacion" className="section fade-in">
        <div className="location-container">
          
          <div className="location-info">
            <span className="section-tag-alt">ENCUÉNTRANOS</span>
            <h2 className="location-title">Visítanos en nuestro local</h2>
            
            <div className="info-item">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h4>Dirección</h4>
                <p>Diagonal 21 n.º 29-56, Barrio Sabanas del Valle.</p>
                <p>Valledupar, Cesar</p>
              </div>
            </div>

            <div className="info-item">
              <i className="fas fa-clock"></i>
              <div>
                <h4>Horario de atención</h4>
                <p>Lunes a Viernes: 8:00 am – 7:00 pm</p>
                <p>Sábados: 9:00 am – 5:00 pm</p>
              </div>
            </div>

            <div className="info-item">
              <i className="fas fa-phone-alt"></i>
              <div>
                <h4>Teléfono / WhatsApp</h4>
                <p>+57 311 365 9462</p>
              </div>
            </div>

            <div className="info-item">
              <i className="fas fa-envelope"></i>
              <div>
                <h4>Correo</h4>
                <p>upcsystemvalledupar@unicesar.com</p>
              </div>
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