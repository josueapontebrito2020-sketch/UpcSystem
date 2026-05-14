import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/global.css';
import '../styles/dashboard.css'; // Basado en user_2.html[cite: 9]

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Mensaje enviado:", message);
      setMessage('');
      // Aquí añadirías la lógica para actualizar la lista de mensajes
    }
  };

  return (
    <div className="user-panel">
      {/* TOPBAR */}
      <div className="topbar">
        <div className="logo">Upc <span>System</span> Pro</div>
        <div className="user-info">
          <div className="avatar">JP</div>
          <span className="user-name">Juan Pérez</span>
          <button className="btn-logout" onClick={() => navigate('/login')}>
            <i className="fas fa-sign-out-alt"></i> Salir
          </button>
        </div>
      </div>

      <div className="dashboard">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-label">Panel</div>
            <div className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <i className="fas fa-house"></i> Inicio
            </div>
            <div className={`sidebar-item ${activeTab === 'repairs' ? 'active' : ''}`} onClick={() => setActiveTab('repairs')}>
              <i className="fas fa-wrench"></i> Mis reparaciones
              <span className="badge">2</span>
            </div>
            <div className={`sidebar-item ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
              <i className="fas fa-comments"></i> Chat con técnico
              <span className="badge">1</span>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Cuenta</div>
            <div className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <i className="fas fa-user"></i> Mi perfil
            </div>
            <Link to="/" className="sidebar-item">
              <i className="fas fa-bag-shopping"></i> Tienda
            </Link>
          </div>
        </div>

        {/* ÁREA DE CONTENIDO DINÁMICO */}
        <div className="content">
          
          {/* PÁGINA: INICIO */}
          {activeTab === 'dashboard' && (
            <div className="page active">
              <div className="page-header">
                <h1>¡Hola, Juan! 👋</h1>
                <p>Aquí está el resumen de tus reparaciones y servicios activos.</p>
              </div>
              <div className="stat-cards">
                <div className="stat-card">
                  <div className="label">Total reparaciones</div>
                  <div className="value c-accent">3</div>
                  <div className="sub">Historial completo</div>
                </div>
                <div className="stat-card">
                  <div className="label">En progreso</div>
                  <div className="value c-yellow">1</div>
                  <div className="sub">Dispositivo</div>
                </div>
                {/* Agrega las demás tarjetas de tu HTML original aquí */}
              </div>

              <div className="repairs-section">
                <div className="repairs-head">
                  <h3>Reparaciones recientes</h3>
                </div>
                <div className="repair-item">
                  <div className="device-icon">📱</div>
                  <div className="device-info">
                    <h4>iPhone 14 Pro</h4>
                    <p>Pantalla rota – Técnico: Carlos M.</p>
                  </div>
                  <span className="status-badge status-progress">En reparación</span>
                </div>
              </div>
            </div>
          )}

          {/* PÁGINA: CHAT */}
          {activeTab === 'chat' && (
            <div className="page active">
              <div className="page-header">
                <h1>Chat con Técnico</h1>
              </div>
              <div className="chat-layout">
                <div className="chat-list">
                  <div className="chat-contact active">
                    <div className="contact-avatar">CM</div>
                    <div className="contact-info">
                      <h4>Carlos Mendoza</h4>
                      <p>Tu iPhone 14 está listo...</p>
                    </div>
                    <div className="online-dot"></div>
                  </div>
                </div>

                <div className="chat-window">
                  <div className="chat-messages">
                    <div className="msg received">¡Hola Juan! Recibimos tu iPhone.</div>
                    <div className="msg sent">¡Gracias! ¿Cuándo estará listo?</div>
                  </div>
                  <div className="chat-input">
                    <input 
                      type="text" 
                      placeholder="Escribe un mensaje..." 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button className="btn-send" onClick={handleSendMessage}>
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PÁGINA: PERFIL */}
          {activeTab === 'profile' && (
            <div className="page active">
              <div className="page-header">
                <h1>Mi Perfil</h1>
              </div>
              <div className="profile-card" style={{background:'var(--surface)', padding:'2rem', borderRadius:'14px', maxWidth:'500px'}}>
                <div style={{display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1.5rem'}}>
                   <div className="avatar" style={{width:'60px', height:'60px', fontSize:'1.5rem'}}>JP</div>
                   <div>
                     <h2 style={{margin:0}}>Juan Pérez</h2>
                     <p style={{color:'var(--muted)', fontSize:'0.9rem'}}>Cliente desde Mayo 2026</p>
                   </div>
                </div>
                <p><strong>Correo:</strong> juan.perez@email.com</p>
                <p><strong>Teléfono:</strong> +57 310 456 7890</p>
                <p><strong>Ciudad:</strong> Valledupar, Cesar</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;