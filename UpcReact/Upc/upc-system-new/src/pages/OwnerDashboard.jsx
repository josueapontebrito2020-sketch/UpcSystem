import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/global.css';
import '../styles/dashboard.css';
import '../styles/owner.css';
import apiClient from '../api/apiClient';

const OwnerDashboard = () => {
  const navigate = useNavigate(); // Permite redirigir a otra página
  const [activeTab, setActiveTab] = useState('overview'); // Guarda qué pestaña está activa (overview, repairs, chats)
  const [reparaciones, setReparaciones] = useState([]);   // Guarda todas las reparaciones que vienen de la API
  const [mensajes, setMensajes] = useState([]);           // Guarda los mensajes del chat activo
  const [reparacionActiva, setReparacionActiva] = useState(null); // Guarda la reparación seleccionada en el chat
  const [message, setMessage] = useState('');  // Guarda el texto que el técnico está escribiendo
  const [stats, setStats] = useState(null);    // Guarda las estadísticas del panel (totales, completadas, etc.)
  const chatEndRef = useRef(null); // Referencia al final del chat para hacer scroll automático

  const usuario = JSON.parse(localStorage.getItem('user')) || {}; // Lee los datos del propietario guardados en localStorage al hacer login
  const iniciales = `${(usuario.nombre || 'A')[0]}`.toUpperCase(); // Toma la primera letra del nombre para el avatar

  const avatarColor = (() => {
    const colores = ['#6c63ff', '#00c896', '#ff6b6b', '#ffd93d', '#4ecdc4', '#a29bfe'];
    const index = (usuario.nombre || 'A').charCodeAt(0) % colores.length; // Elige un color según la primera letra del nombre
    return colores[index];
  })();

  useEffect(() => {
    if (activeTab !== 'overview') return; // Solo corre si estás en la pestaña overview
    const fetchStats = () =>
      apiClient.get('stats') // GET api/stats → trae totales de reparaciones, clientes, completadas
        .then(data => setStats(data))
        .catch(err => console.error(err));
    fetchStats(); // Llama inmediatamente al cargar
    const interval = setInterval(fetchStats, 5000); // Repite cada 5 segundos para mantener los datos actualizados
    return () => clearInterval(interval); // Limpia el intervalo cuando cambia de pestaña
  }, [activeTab]); // Se re-ejecuta cada vez que cambia la pestaña activa

  useEffect(() => {
    if (!['overview', 'repairs', 'chats'].includes(activeTab)) return; // Solo corre en estas 3 pestañas
    const fetchReparaciones = () =>
      apiClient.get('reparaciones/todas') // GET api/reparaciones/todas → trae TODAS las reparaciones con nombre del cliente
        .then(data => {
          setReparaciones(data); // Guarda todas las reparaciones en el estado
          setReparacionActiva(prev => {
            if (prev) return data.find(r => r.id === prev.id) ?? prev; // Si ya había una activa, la actualiza con los datos nuevos
            return data[0] ?? null; // Si no había ninguna, selecciona la primera
          });
        })
        .catch(err => console.error(err));
    fetchReparaciones(); // Llama inmediatamente al cargar
    const interval = setInterval(fetchReparaciones, 5000); // Repite cada 5 segundos
    return () => clearInterval(interval); // Limpia el intervalo al cambiar de pestaña
  }, [activeTab]); // Se re-ejecuta cada vez que cambia la pestaña activa

  useEffect(() => {
    if (!reparacionActiva || activeTab !== 'chats') return; // Solo corre si hay reparación activa Y estás en la pestaña chats
    const fetchMensajes = () =>
      apiClient.get(`mensajes?usuarioId=${reparacionActiva.usuarioId}`) // GET api/mensajes?usuarioId=X → trae mensajes del cliente
        .then(msgs => setMensajes(msgs.filter(m => m.reparacionId === reparacionActiva.id))); // Filtra solo los mensajes de esta reparación
    fetchMensajes(); // Llama inmediatamente
    const interval = setInterval(fetchMensajes, 3000); // Repite cada 3 segundos para el chat en tiempo real
    return () => clearInterval(interval); // Limpia el intervalo al cambiar de reparación o pestaña
  }, [reparacionActiva, activeTab]); // Se re-ejecuta si cambia la reparación activa o la pestaña

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); // Cada vez que llegan mensajes nuevos hace scroll al final del chat
  }, [mensajes]); // Se ejecuta cada vez que el array de mensajes cambia

  const handleCambiarEstado = (id, nuevoEstado) => {
    apiClient.patch(`reparaciones/${id}/estado`, nuevoEstado) // PATCH api/reparaciones/{id}/estado → actualiza el estado de la reparación
      .then(repActualizada => {
        setReparaciones(prev => prev.map(r => r.id === id ? repActualizada : r)); // Reemplaza solo la reparación actualizada en el estado local
        apiClient.get('stats').then(data => setStats(data)); // Refresca las stats porque cambió una reparación
      })
      .catch(err => console.error('Error cambiando estado:', err));
  };

  const handleSendMessage = () => {
    if (!message.trim() || !reparacionActiva) return; // No envía si el mensaje está vacío o no hay reparación activa
    const texto = message;
    setMessage(''); // Limpia el input inmediatamente antes de esperar respuesta de la API
    apiClient.post('mensajes', { // POST api/mensajes → guarda el mensaje en la BD
      reparacionId: reparacionActiva.id, // ID de la reparación a la que pertenece el mensaje
      usuarioId: reparacionActiva.usuarioId, // ID del cliente dueño de la reparación
      autor: 'tecnico', // Identifica que este mensaje lo envió el técnico, no el cliente
      texto // El contenido del mensaje
    }).then(nuevoMensaje => {
      setMensajes(prev => [...prev, nuevoMensaje]); // Agrega el mensaje nuevo al chat sin recargar todos
    }).catch(err => console.error('Error enviando mensaje:', err));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');  // Borra los datos del usuario del localStorage
    localStorage.removeItem('token'); // Borra el token de autenticación del localStorage
    navigate('/login'); // Redirige al login
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