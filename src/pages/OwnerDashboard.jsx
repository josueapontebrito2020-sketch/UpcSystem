import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/global.css';
import '../styles/dashboard.css';
import '../styles/owner.css'; // El específico del admin[cite: 7]

const OwnerDashboard = () => {
  const navigate = useNavigate();
  // Estado para controlar qué pestaña se muestra
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="owner-page">
      {/* TOPBAR */}
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div className="logo">Upc <span>System</span> Pro</div>
          <div className="owner-badge">PROPIETARIO</div>
        </div>
        <div className="top-right">
          <div className="avatar-owner">AD</div>
          <span style={{ fontSize: '0.88rem' }}>Admin</span>
          <button className="btn-logout" onClick={() => navigate('/login')}>
            <i className="fas fa-sign-out-alt"></i> Salir
          </button>
        </div>
      </div>

      <div className="dashboard">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-label">Gestión</div>
            <div 
              className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`} 
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-chart-line"></i> Resumen
            </div>
            <div 
              className={`sidebar-item ${activeTab === 'repairs' ? 'active' : ''}`} 
              onClick={() => setActiveTab('repairs')}
            >
              <i className="fas fa-wrench"></i> Reparaciones
              <span className="badge">8</span>
            </div>
            <div 
              className={`sidebar-item ${activeTab === 'chats' ? 'active' : ''}`} 
              onClick={() => setActiveTab('chats')}
            >
              <i className="fas fa-comments"></i> Chats clientes
              <span className="badge badge-red">5</span>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Sistema</div>
            <Link to="/" className="sidebar-item">
              <i className="fas fa-globe"></i> Ver sitio web
            </Link>
          </div>
        </div>

        {/* ÁREA DE CONTENIDO DINÁMICO */}
        <div className="content">
          
          {/* PÁGINA: RESUMEN */}
          {activeTab === 'overview' && (
            <div className="page active">
              <div className="page-header">
                <h1>Panel de Control ⚙️</h1>
                <p>Resumen de actividad – Mayo 2026</p>
              </div>
              <div className="stat-cards">
                <div className="stat-card">
                  <div className="label">Ingresos hoy</div>
                  <div className="value c-purple">$840.000</div>
                  <div className="trend up">↑ +12%</div>
                </div>
                {/* Agrega aquí las demás stat-cards de tu HTML original */}
              </div>
              
              <div className="repairs-table">
                 <div className="table-head">
                    <span>Dispositivo</span>
                    <span>Cliente</span>
                    <span>Estado</span>
                 </div>
                 {/* Aquí puedes mapear tus reparaciones recientes */}
                 <div className="table-row">
                    <div className="device-cell">📱 iPhone 14 Pro</div>
                    <div className="client-cell">Juan Pérez</div>
                    <div><span className="status-badge s-progress">En reparación</span></div>
                 </div>
              </div>
            </div>
          )}

          {/* PÁGINA: REPARACIONES */}
          {activeTab === 'repairs' && (
            <div className="page active">
              <div className="page-header">
                <h1>Gestión de Reparaciones</h1>
                <p>Administra todos los servicios activos.</p>
              </div>
              {/* Aquí va tu tabla completa de reparaciones del HTML */}
              <div className="repairs-table">
                {/* Copia aquí las filas que tienes en page-repairs de tu HTML */}
              </div>
            </div>
          )}

          {/* PÁGINA: CHATS */}
          {activeTab === 'chats' && (
            <div className="page active">
              <div className="page-header">
                <h1>Chats de Clientes</h1>
              </div>
              <div className="chats-layout">
                {/* Estructura de chat-list y chat-window de tu HTML */}
                <p style={{padding: '2rem'}}>Módulo de mensajería en vivo activado.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;