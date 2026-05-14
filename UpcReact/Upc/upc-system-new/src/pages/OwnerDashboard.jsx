import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/global.css';
import '../styles/dashboard.css';
import '../styles/owner.css';
import apiClient from '../api/apiClient';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [reparaciones, setReparaciones] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [reparacionActiva, setReparacionActiva] = useState(null);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState(null);
  const chatEndRef = useRef(null);

  const usuario = JSON.parse(localStorage.getItem('user')) || {};
  const iniciales = `${(usuario.nombre || 'A')[0]}`.toUpperCase();

  const avatarColor = (() => {
    const colores = ['#6c63ff', '#00c896', '#ff6b6b', '#ffd93d', '#4ecdc4', '#a29bfe'];
    const index = (usuario.nombre || 'A').charCodeAt(0) % colores.length;
    return colores[index];
  })();

  // ✅ Polling de stats cada 5 segundos para reflejar nuevos clientes
useEffect(() => {
    // ✅ Solo hace polling de stats en el tab overview
    if (activeTab !== 'overview') return;
    const fetchStats = () =>
      apiClient.get('stats')
        .then(data => setStats(data))
        .catch(err => console.error(err));
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

useEffect(() => {
    // ✅ Solo hace polling de reparaciones en los tabs que las necesitan
    if (!['overview', 'repairs', 'chats'].includes(activeTab)) return;
    const fetchReparaciones = () =>
      apiClient.get('reparaciones/todas')
        .then(data => {
          setReparaciones(data);
          setReparacionActiva(prev => {
            if (prev) return data.find(r => r.id === prev.id) ?? prev;
            return data[0] ?? null;
          });
        })
        .catch(err => console.error(err));
    fetchReparaciones();
    const interval = setInterval(fetchReparaciones, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

useEffect(() => {
    // ✅ Solo hace polling si estás en el tab chats y hay una reparación activa
    if (!reparacionActiva || activeTab !== 'chats') return;
    const fetchMensajes = () =>
      apiClient.get(`mensajes?usuarioId=${reparacionActiva.usuarioId}`)
        .then(msgs => setMensajes(msgs.filter(m => m.reparacionId === reparacionActiva.id)));
    fetchMensajes();
    const interval = setInterval(fetchMensajes, 3000);
    return () => clearInterval(interval);
  }, [reparacionActiva, activeTab]); // ✅ agrega activeTab como dependencia

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const handleCambiarEstado = (id, nuevoEstado) => {
    apiClient.patch(`reparaciones/${id}/estado`, nuevoEstado)
      .then(repActualizada => {
        setReparaciones(prev => prev.map(r => r.id === id ? repActualizada : r));
        apiClient.get('stats').then(data => setStats(data));
      })
      .catch(err => console.error('Error cambiando estado:', err));
  };

  const handleSendMessage = () => {
    if (!message.trim() || !reparacionActiva) return;
    const texto = message;
    setMessage('');
    apiClient.post('mensajes', {
      reparacionId: reparacionActiva.id,
      usuarioId: reparacionActiva.usuarioId,
      autor: 'tecnico',
      texto
    }).then(nuevoMensaje => {
      setMensajes(prev => [...prev, nuevoMensaje]);
    }).catch(err => console.error('Error enviando mensaje:', err));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="owner-page">
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div className="logo">Upc <span>System</span> Pro</div>
          <div className="owner-badge">PROPIETARIO</div>
        </div>
        <div className="top-right">
          <div className="avatar-owner" style={{ backgroundColor: avatarColor }}>{iniciales}</div>
          <span style={{ fontSize: '0.88rem' }}>{usuario.nombre || 'Admin'}</span>
          <button className="btn-logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Salir
          </button>
        </div>
      </div>

      <div className="dashboard">
        <div className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-label">Gestión</div>
            <div className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><i className="fas fa-chart-line"></i> Resumen</div>
            <div className={`sidebar-item ${activeTab === 'repairs' ? 'active' : ''}`} onClick={() => setActiveTab('repairs')}><i className="fas fa-wrench"></i> Reparaciones<span className="badge">{reparaciones.length}</span></div>
            <div className={`sidebar-item ${activeTab === 'chats' ? 'active' : ''}`} onClick={() => setActiveTab('chats')}><i className="fas fa-comments"></i> Chats clientes<span className="badge badge-red">{reparaciones.length}</span></div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-label">Sistema</div>
            <Link to="/" className="sidebar-item"><i className="fas fa-globe"></i> Ver sitio web</Link>
          </div>
        </div>

        <div className="content">

          {/* ── TAB: RESUMEN ── */}
          {activeTab === 'overview' && (
            <div className="page active">
              <div className="page-header"><h1>Panel de Control ⚙️</h1><p>Resumen de actividad – Mayo 2026</p></div>
              <div className="stat-cards">
                <div className="stat-card"><div className="label">Total reparaciones</div><div className="value c-purple">{stats?.totalReparaciones ?? reparaciones.length}</div><div className="trend up">↑ Todas</div></div>
                <div className="stat-card"><div className="label">En reparación</div><div className="value c-yellow">{stats?.enProgreso ?? '—'}</div><div className="trend">Activas</div></div>
                <div className="stat-card"><div className="label">Completadas</div><div className="value c-green">{stats?.completadas ?? '—'}</div><div className="trend up">↑ Listas</div></div>
                {/* ✅ Total clientes se actualiza con polling */}
                <div className="stat-card"><div className="label">Total clientes</div><div className="value c-accent">{stats?.totalClientes ?? '—'}</div><div className="trend">Registrados</div></div>
              </div>

              {/* ✅ Tabla con columna Cliente */}
              <div className="repairs-table">
                <div className="table-head" style={{ gridTemplateColumns: '1.5fr 1.5fr 1.2fr 1fr 1fr 1.2fr' }}>
                  <span>Dispositivo</span>
                  <span>Cliente</span>
                  <span>Problema</span>
                  <span>Técnico</span>
                  <span>Fecha</span>
                  <span>Estado</span>
                </div>
                {reparaciones.map(rep => (
                  <div className="table-row" key={rep.id} style={{ gridTemplateColumns: '1.5fr 1.5fr 1.2fr 1fr 1fr 1.2fr' }}>
                    <div className="device-cell">📱 {rep.dispositivo}</div>
                    {/* ✅ Nombre del cliente */}
                    <div style={{ fontSize: '0.85rem' }}>{rep.nombreCliente || `Usuario #${rep.usuarioId}`}</div>
                    <div>{rep.problema}</div>
                    <div>{rep.tecnico}</div>
                    <div>{rep.fecha}</div>
                    <div><span className="status-badge s-progress">{rep.estado}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB: REPARACIONES ── */}
          {activeTab === 'repairs' && (
            <div className="page active">
              <div className="page-header"><h1>Gestión de Reparaciones</h1><p>Administra todos los servicios activos.</p></div>
              <div className="repairs-table">
                <div className="table-head" style={{ gridTemplateColumns: 'auto 1.5fr 1.5fr 1.2fr 1fr 1fr 1.5fr' }}>
                  <span>ID</span>
                  <span>Dispositivo</span>
                  <span>Cliente</span>
                  <span>Problema</span>
                  <span>Técnico</span>
                  <span>Fecha</span>
                  <span>Estado</span>
                </div>
                {reparaciones.map(rep => (
                  <div className="table-row" key={rep.id} style={{ gridTemplateColumns: 'auto 1.5fr 1.5fr 1.2fr 1fr 1fr 1.5fr' }}>
                    <div>#{rep.id}</div>
                    <div>📱 {rep.dispositivo}</div>
                    {/* ✅ Nombre del cliente */}
                    <div style={{ fontSize: '0.85rem' }}>{rep.nombreCliente || `Usuario #${rep.usuarioId}`}</div>
                    <div>{rep.problema}</div>
                    <div>{rep.tecnico}</div>
                    <div>{rep.fecha}</div>
                    <div>
                      <select
                        value={rep.estado}
                        onChange={(e) => handleCambiarEstado(rep.id, e.target.value)}
                        style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.3rem 0.5rem', fontSize: '0.82rem', cursor: 'pointer' }}
                      >
                        <option value="Recibido">Recibido</option>
                        <option value="Diagnóstico">Diagnóstico</option>
                        <option value="En reparación">En reparación</option>
                        <option value="Completado">Completado</option>
                        <option value="Entregado">Entregado</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB: CHATS ── */}
          {activeTab === 'chats' && (
            <div className="page active">
              <div className="page-header"><h1>Chats de Clientes</h1><p>Responde a tus clientes en tiempo real.</p></div>
              <div className="chat-layout">
                <div className="chat-list">
                  <div className="chat-list-head">Conversaciones</div>
                  {reparaciones.map(rep => (
                    <div
                      key={rep.id}
                      className={`chat-contact ${reparacionActiva?.id === rep.id ? 'active' : ''}`}
                      onClick={() => setReparacionActiva(rep)}
                    >
                      <div className="contact-avatar">
                        {/* ✅ Iniciales del nombre del cliente */}
                        {(rep.nombreCliente || `U${rep.usuarioId}`).split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="contact-info">
                        <h4>{rep.dispositivo}</h4>
                        {/* ✅ Nombre del cliente en vez de Usuario #x */}
                        <p>{rep.nombreCliente || `Usuario #${rep.usuarioId}`} – {rep.estado}</p>
                      </div>
                      <div className="online-dot"></div>
                    </div>
                  ))}
                </div>

                <div className="chat-window">
                  {reparacionActiva && (
                    <div className="chat-header">
                      <div className="contact-avatar">
                        {(reparacionActiva.nombreCliente || `U${reparacionActiva.usuarioId}`).split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <h3>{reparacionActiva.dispositivo}</h3>
                        {/* ✅ Nombre del cliente en el header del chat */}
                        <p>{reparacionActiva.nombreCliente || `Usuario #${reparacionActiva.usuarioId}`} · {reparacionActiva.estado}</p>
                      </div>
                    </div>
                  )}
                  <div className="chat-messages">
                    {mensajes.length === 0 ? (
                      <p style={{ color: 'var(--muted)', padding: '1rem' }}>No hay mensajes en esta reparación.</p>
                    ) : (
                      mensajes.map(msg => (
                        <div key={msg.id}>
                          <div className={`msg ${msg.autor === 'tecnico' ? 'sent' : 'received'}`}>{msg.texto}</div>
                          <div className={`msg-time ${msg.autor === 'tecnico' ? 'right' : ''}`}>{msg.hora}</div>
                        </div>
                      ))
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="chat-input">
                    <input
                      type="text"
                      placeholder="Responder como técnico..."
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

        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;