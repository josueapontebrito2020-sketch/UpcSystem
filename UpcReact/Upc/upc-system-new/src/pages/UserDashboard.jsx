import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/global.css';
import '../styles/dashboard.css';
import apiClient from '../api/apiClient';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [message, setMessage] = useState('');
  const [reparaciones, setReparaciones] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [reparacionActiva, setReparacionActiva] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const chatEndRef = useRef(null);

  // ── Modal nueva reparación ──
  const [showModal, setShowModal] = useState(false);
  const [loadingRep, setLoadingRep] = useState(false);
  const [formRep, setFormRep] = useState({ dispositivo: '', problema: '', tecnico: '' });

  const usuario = JSON.parse(localStorage.getItem('user')) || {};
  const nombreCompleto = `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim();
  const iniciales = `${(usuario.nombre || 'U')[0]}${(usuario.apellido || '')[0] || ''}`.toUpperCase();

  const avatarColor = (() => {
    const colores = ['#6c63ff', '#00c896', '#ff6b6b', '#ffd93d', '#4ecdc4', '#a29bfe'];
    const index = (usuario.nombre || 'U').charCodeAt(0) % colores.length;
    return colores[index];
  })();

  // Cargar reparaciones del usuario
const fetchReparaciones = () => {
  if (usuario.id) {
    apiClient.get(`reparaciones?usuarioId=${usuario.id}`)
      .then(data => {
        setReparaciones(data);
        setReparacionActiva(prev =>
          prev ? (data.find(r => r.id === prev.id) ?? prev) : (data[0] ?? null)
        );
      })
      .catch(err => console.error(err));
  }
};

  useEffect(() => { fetchReparaciones(); }, []);

  // Cargar técnicos para el selector del modal
  useEffect(() => {
    apiClient.get('tecnicos')
      .then(data => {
        setTecnicos(data);
        if (data.length > 0) setFormRep(prev => ({ ...prev, tecnico: data[0].nombre }));
      })
      .catch(err => console.error(err));
  }, []);

  // Polling de mensajes
useEffect(() => {
    // ✅ Solo hace polling si estás en el tab chat
    if (!usuario.id || activeTab !== 'chat') return;
    const fetchMensajes = () =>
      apiClient.get(`mensajes?usuarioId=${usuario.id}`)
        .then(msgs => setMensajes(msgs));
    fetchMensajes();
    const interval = setInterval(fetchMensajes, 3000);
    return () => clearInterval(interval);
  }, [activeTab]); // ✅ agrega activeTab como dependencia

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const enProgreso  = reparaciones.filter(r => r.estado === 'En reparación').length;
  const completadas = reparaciones.filter(r => r.estado === 'Completado').length;
  const mensajesActivos = reparacionActiva
    ? mensajes.filter(m => m.reparacionId === reparacionActiva.id)
    : [];
  const mensajesTecnico = mensajes.filter(m => m.autor === 'tecnico').length;

  // ── Enviar mensaje del chat ──
  const handleSendMessage = () => {
    if (!message.trim() || !reparacionActiva) return;
    const texto = message;
    setMessage('');
    apiClient.post('mensajes', {
      reparacionId: reparacionActiva.id,
      usuarioId: usuario.id,
      autor: 'cliente',
      texto
    }).then(nuevoMensaje => {
      setMensajes(prev => [...prev, nuevoMensaje]);
    }).catch(err => console.error('Error enviando mensaje:', err));
  };

  // ── Crear nueva reparación ──
  const handleCrearReparacion = async () => {
    if (!formRep.dispositivo.trim() || !formRep.problema.trim() || !formRep.tecnico) return;
    setLoadingRep(true);
    try {
      const nueva = await apiClient.post('reparaciones', {
        usuarioId: usuario.id,
        dispositivo: formRep.dispositivo,
        problema: formRep.problema,
        tecnico: formRep.tecnico,
      });
      // Agregar al estado local y actualizar reparación activa para el chat
      setReparaciones(prev => [...prev, nueva]);
      setReparacionActiva(nueva);
      setShowModal(false);
      setFormRep({ dispositivo: '', problema: '', tecnico: tecnicos[0]?.nombre || '' });
    } catch (err) {
      console.error('Error creando reparación:', err);
    } finally {
      setLoadingRep(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // ── Estilos del modal ──
  const modalOverlay = {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 2000,
  };
  const modalBox = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '18px',
    padding: '2rem',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 0 60px rgba(0,212,255,0.1)',
  };
  const inputStyle = {
    width: '100%',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    fontSize: '0.92rem',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    marginTop: '0.4rem',
  };
  const labelStyle = {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  return (
    <div className="user-panel">
      <div className="topbar">
        <div className="logo">Upc <span>System</span> Pro</div>
        <div className="user-info">
          <div className="avatar" style={{ backgroundColor: avatarColor }}>{iniciales}</div>
          <span className="user-name">{nombreCompleto}</span>
          <button className="btn-logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Salir
          </button>
        </div>
      </div>

      {/* ── MODAL NUEVA REPARACIÓN ── */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            {/* Cabecera del modal */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  color: 'var(--muted)', borderRadius: '8px', width: '34px', height: '34px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem', flexShrink: 0,
                }}
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.2rem', fontWeight: '800' }}>
                  Nueva Reparación
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
                  Completa los datos de tu dispositivo
                </div>
              </div>
            </div>

            {/* Campo: Dispositivo */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={labelStyle}>Modelo del dispositivo</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="Ej: iPhone 14 Pro, Samsung S23..."
                value={formRep.dispositivo}
                onChange={e => setFormRep({ ...formRep, dispositivo: e.target.value })}
              />
            </div>

            {/* Campo: Problema */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={labelStyle}>Describe el problema</label>
              <textarea
                style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }}
                placeholder="Ej: La pantalla está rota, no carga la batería..."
                value={formRep.problema}
                onChange={e => setFormRep({ ...formRep, problema: e.target.value })}
              />
            </div>

            {/* Campo: Técnico */}
            <div style={{ marginBottom: '1.8rem' }}>
              <label style={labelStyle}>Selecciona un técnico</label>
              <select
                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                value={formRep.tecnico}
                onChange={e => setFormRep({ ...formRep, tecnico: e.target.value })}
              >
                {tecnicos.map(t => (
                  <option key={t.id} value={t.nombre}>
                    {t.avatar} {t.nombre} — {t.rol}
                  </option>
                ))}
              </select>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1, background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--muted)', padding: '0.85rem', borderRadius: '8px',
                  fontSize: '0.92rem', fontWeight: '600', cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearReparacion}
                disabled={loadingRep || !formRep.dispositivo.trim() || !formRep.problema.trim()}
                style={{
                  flex: 2, background: 'var(--accent)', border: 'none',
                  color: 'var(--bg)', padding: '0.85rem', borderRadius: '8px',
                  fontSize: '0.92rem', fontWeight: '700', cursor: 'pointer',
                  fontFamily: "'Syne', sans-serif",
                  opacity: loadingRep || !formRep.dispositivo.trim() || !formRep.problema.trim() ? 0.6 : 1,
                  boxShadow: '0 0 20px rgba(0,212,255,0.3)',
                }}
              >
                {loadingRep ? 'Enviando...' : '✓ Solicitar Reparación'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard">
        <div className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-label">Panel</div>
            <div className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <i className="fas fa-house"></i> Inicio
            </div>
            <div className={`sidebar-item ${activeTab === 'repairs' ? 'active' : ''}`} onClick={() => setActiveTab('repairs')}>
              <i className="fas fa-wrench"></i> Mis reparaciones
              <span className="badge">{reparaciones.length}</span>
            </div>
            <div className={`sidebar-item ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
              <i className="fas fa-comments"></i> Chat con técnico
              <span className="badge">{mensajesTecnico}</span>
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

        <div className="content">

          {/* ── TAB: DASHBOARD ── */}
          {activeTab === 'dashboard' && (
            <div className="page active">
              <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1>¡Hola, {usuario.nombre || 'Usuario'}! 👋</h1>
                  <p>Aquí está el resumen de tus reparaciones y servicios activos.</p>
                </div>
                {/* ── BOTÓN NUEVA REPARACIÓN ── */}
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    background: 'var(--accent)', border: 'none', color: 'var(--bg)',
                    padding: '0.7rem 1.4rem', borderRadius: '10px', fontWeight: '700',
                    fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Syne', sans-serif",
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    boxShadow: '0 0 20px rgba(0,212,255,0.25)', whiteSpace: 'nowrap',
                  }}
                >
                  <i className="fas fa-plus"></i> Nueva Reparación
                </button>
              </div>

              <div className="stat-cards">
                <div className="stat-card"><div className="label">Total reparaciones</div><div className="value c-accent">{reparaciones.length}</div><div className="sub">Historial completo</div></div>
                <div className="stat-card"><div className="label">En progreso</div><div className="value c-yellow">{enProgreso}</div><div className="sub">Dispositivos</div></div>
                <div className="stat-card"><div className="label">Completadas</div><div className="value c-green">{completadas}</div><div className="sub">Dispositivos</div></div>
                <div className="stat-card"><div className="label">Mensajes del técnico</div><div className="value c-purple">{mensajesTecnico}</div><div className="sub">Recibidos</div></div>
              </div>

              <div className="repairs-section">
                <div className="repairs-head">
                  <h3>Mis reparaciones</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)', cursor: 'pointer' }} onClick={() => setActiveTab('repairs')}>Ver todo →</span>
                </div>
                {reparaciones.length === 0 ? (
                  <p style={{ color: 'var(--muted)', padding: '1rem' }}>No tienes reparaciones registradas aún.</p>
                ) : (
                  reparaciones.map(rep => (
                    <div className="repair-item" key={rep.id}>
                      <div className="device-icon">📱</div>
                      <div className="device-info"><h4>{rep.dispositivo}</h4><p>{rep.problema} – Técnico: {rep.tecnico}</p></div>
                      <div className="repair-date">{rep.fecha}</div>
                      <span className={`status-badge ${rep.estado === 'Completado' ? 'status-done' : rep.estado === 'Diagnóstico' ? 'status-pending' : 'status-progress'}`}>{rep.estado}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── TAB: REPARACIONES ── */}
          {activeTab === 'repairs' && (
            <div className="page active">
              <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1>Mis Reparaciones</h1>
                  <p>Seguimiento detallado de todos tus dispositivos.</p>
                </div>
                {/* ── BOTÓN NUEVA REPARACIÓN también en esta tab ── */}
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    background: 'var(--accent)', border: 'none', color: 'var(--bg)',
                    padding: '0.7rem 1.4rem', borderRadius: '10px', fontWeight: '700',
                    fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Syne', sans-serif",
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    boxShadow: '0 0 20px rgba(0,212,255,0.25)', whiteSpace: 'nowrap',
                  }}
                >
                  <i className="fas fa-plus"></i> Nueva Reparación
                </button>
              </div>

              <div className="repairs-section">
                <div className="repairs-head"><h3>Historial completo</h3></div>
                {reparaciones.length === 0 ? (
                  <p style={{ color: 'var(--muted)', padding: '1rem' }}>No tienes reparaciones registradas aún.</p>
                ) : (
                  reparaciones.map(rep => (
                    <div className="repair-item" key={rep.id}>
                      <div className="device-icon">📱</div>
                      <div className="device-info"><h4>{rep.dispositivo} – {rep.problema}</h4><p>Técnico {rep.tecnico} · Entrada: {rep.fecha}</p></div>
                      <div className="repair-date">{rep.fecha}</div>
                      <span className={`status-badge ${rep.estado === 'Completado' ? 'status-done' : rep.estado === 'Diagnóstico' ? 'status-pending' : 'status-progress'}`}>{rep.estado}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── TAB: CHAT ── */}
          {activeTab === 'chat' && (
            <div className="page active">
              <div className="page-header"><h1>Chat con Técnico</h1><p>Comunícate directamente con tu técnico asignado.</p></div>
              <div className="chat-layout">
                <div className="chat-list">
                  <div className="chat-list-head">Conversaciones</div>
                  {reparaciones.map(rep => (
                    <div key={rep.id} className={`chat-contact ${reparacionActiva?.id === rep.id ? 'active' : ''}`} onClick={() => setReparacionActiva(rep)}>
                      <div className="contact-avatar">{rep.tecnico.split(' ').map(n => n[0]).join('')}</div>
                      <div className="contact-info"><h4>{rep.tecnico}</h4><p>{rep.dispositivo}</p></div>
                      <div className="online-dot"></div>
                    </div>
                  ))}
                </div>
                <div className="chat-window">
                  {reparacionActiva && (
                    <div className="chat-header">
                      <div className="contact-avatar">{reparacionActiva.tecnico.split(' ').map(n => n[0]).join('')}</div>
                      <div><h3>{reparacionActiva.tecnico}</h3><p>● En línea ahora</p></div>
                    </div>
                  )}
                  <div className="chat-messages">
                    {mensajesActivos.length === 0 ? (
                      <p style={{ color: 'var(--muted)' }}>No hay mensajes aún.</p>
                    ) : (
                      mensajesActivos.map(msg => (
                        <div key={msg.id}>
                          <div className={`msg ${msg.autor === 'cliente' ? 'sent' : 'received'}`}>{msg.texto}</div>
                          <div className={`msg-time ${msg.autor === 'cliente' ? 'right' : ''}`}>{msg.hora}</div>
                        </div>
                      ))
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="chat-input">
                    <input type="text" placeholder="Escribe un mensaje..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
                    <button className="btn-send" onClick={handleSendMessage}><i className="fas fa-paper-plane"></i></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: PERFIL ── */}
          {activeTab === 'profile' && (
            <div className="page active">
              <div className="page-header"><h1>Mi Perfil</h1><p>Administra tu información personal.</p></div>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '2rem', maxWidth: '540px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2rem' }}>
                  <div className="avatar" style={{ width: '64px', height: '64px', fontSize: '1.6rem', fontWeight: '700', backgroundColor: avatarColor }}>
                    {iniciales}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.2rem', fontWeight: '700' }}>{nombreCompleto}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Cliente desde Mayo 2026</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div><div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Correo</div><div>{usuario.email || '—'}</div></div>
                  <div><div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Teléfono</div><div>{usuario.telefono || '—'}</div></div>
                  <div><div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Ciudad</div><div>{usuario.ciudad || '—'}</div></div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;