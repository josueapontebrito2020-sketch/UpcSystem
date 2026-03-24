/* ============================================================
   ARCHIVO: owner.js
   USO: Lógica exclusiva de owner.html (panel del propietario).
   ============================================================ */


/* ────────────────────────────────────────────────────────────
   1. NAVEGACIÓN ENTRE PÁGINAS DEL PANEL
   Igual que en user.js pero para el panel del propietario.
   ──────────────────────────────────────────────────────────── */
function showPage(nombrePagina, elementoClickeado) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById('page-' + nombrePagina).classList.add('active');
  if (elementoClickeado) elementoClickeado.classList.add('active');
}


/* ────────────────────────────────────────────────────────────
   2. CAMBIAR EL ESTADO DE UNA REPARACIÓN
   Cuando el propietario selecciona un nuevo estado en el <select>,
   esta función actualiza el badge de color y muestra una notificación.
   
   ESTADOS DISPONIBLES (y sus colores):
   - "Pendiente"     → amarillo (s-pending)
   - "En reparación" → azul cian (s-progress)
   - "Reparado"      → verde (s-done)
   
   CÓMO FUNCIONA:
   - El <select> tiene onchange="changeStatus(this)" en el HTML.
   - La función busca el .status-badge en la misma fila (.table-row).
   - Cambia las clases CSS y el texto del badge.
   - Muestra una notificación verde en la esquina inferior derecha.
   ──────────────────────────────────────────────────────────── */
function changeStatus(selectElement) {
  const fila  = selectElement.closest('.table-row');
  const badge = fila.querySelector('.status-badge');
  const nuevoEstado = selectElement.value;

  // Limpia todas las clases de estado anteriores
  badge.className = 'status-badge';

  // Aplica la clase y texto del nuevo estado
  if (nuevoEstado === 'Pendiente') {
    badge.classList.add('s-pending');
    badge.textContent = 'Pendiente';
  } else if (nuevoEstado === 'En reparación') {
    badge.classList.add('s-progress');
    badge.textContent = 'En reparación';
  } else if (nuevoEstado === 'Reparado') {
    badge.classList.add('s-done');
    badge.textContent = '✓ Reparado';
  }

  // Actualiza el atributo data-status para que el filtro funcione correctamente
  fila.setAttribute('data-status', nuevoEstado);

  // ── Notificación de cambio exitoso ──
  mostrarNotificacion(`✓ Estado actualizado: ${nuevoEstado}`);
}


/* ────────────────────────────────────────────────────────────
   3. FILTRAR REPARACIONES POR ESTADO
   Muestra solo las filas que coinciden con el estado seleccionado.
   
   CÓMO FUNCIONA:
   - Los botones de filtro tienen onclick="filterRows('estado', this)".
   - 'all' muestra todas las filas.
   - Otros valores comparan con el atributo data-status de cada fila.
   ──────────────────────────────────────────────────────────── */
function filterRows(estado, botonPresionado) {
  // Marca el botón activo
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  botonPresionado.classList.add('active');

  // Muestra u oculta filas según el estado
  document.querySelectorAll('.table-row').forEach(fila => {
    const mostrar = estado === 'all' || fila.dataset.status === estado;
    fila.style.display = mostrar ? 'grid' : 'none';
  });
}


/* ────────────────────────────────────────────────────────────
   4. SELECCIONAR CONVERSACIÓN EN EL CHAT
   Cuando el propietario hace clic en un contacto,
   actualiza la cabecera del chat con el nombre y dispositivo.
   
   CÓMO FUNCIONA:
   - Cada .chat-contact tiene onclick="selectChat(this, 'Nombre', 'Dispositivo')".
   - Esta función actualiza los elementos del encabezado del chat.
   - También elimina el punto azul de "no leído".
   ──────────────────────────────────────────────────────────── */
function selectChat(elementoContacto, nombreCliente, dispositivo) {
  // Quita la selección anterior
  document.querySelectorAll('.chat-contact').forEach(c => c.classList.remove('selected'));

  // Marca el contacto clickeado como seleccionado
  elementoContacto.classList.add('selected');

  // Elimina el punto de "no leído" si existe
  const puntoPendiente = elementoContacto.querySelector('.unread-dot');
  if (puntoPendiente) puntoPendiente.remove();

  // Actualiza el encabezado del chat con los datos del cliente
  document.getElementById('cwName').textContent   = nombreCliente;
  document.getElementById('cwDevice').textContent = dispositivo;

  // Actualiza las iniciales del avatar (primeras letras del nombre)
  document.getElementById('cwAvatar').textContent = nombreCliente
    .split(' ')
    .map(n => n[0])
    .join('');
}


/* ────────────────────────────────────────────────────────────
   5. ENVIAR MENSAJE COMO PROPIETARIO/ADMIN
   Agrega el mensaje del admin a la conversación con el cliente.
   
   CÓMO FUNCIONA:
   - Lee el texto del input #ownerInput.
   - Crea una burbuja .msg.sent con el mensaje.
   - El botón de envío y la tecla Enter llaman esta función.
   ──────────────────────────────────────────────────────────── */
function ownerSend() {
  const input = document.getElementById('ownerInput');
  const texto = input.value.trim();

  if (!texto) return;

  const contenedor = document.getElementById('ownerChatMsgs');
  const ahora = new Date();
  const hora = `${ahora.getHours()}:${String(ahora.getMinutes()).padStart(2, '0')}`;

  const divMensaje = document.createElement('div');
  divMensaje.innerHTML = `
    <div class="msg sent">${texto}</div>
    <div class="msg-meta">Tú (Admin) · ${hora} · ✓</div>
  `;
  contenedor.appendChild(divMensaje);
  contenedor.scrollTop = contenedor.scrollHeight;

  // Limpia el campo de texto
  input.value = '';
}


/* ────────────────────────────────────────────────────────────
   6. FUNCIÓN AUXILIAR: MOSTRAR NOTIFICACIÓN
   Muestra un toast verde en la esquina inferior derecha.
   
   USO: mostrarNotificacion("Texto del mensaje")
   ──────────────────────────────────────────────────────────── */
function mostrarNotificacion(mensaje) {
  const notif = document.createElement('div');

  // Estilo inline para la notificación
  notif.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: #22c55e;
    color: #fff;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.88rem;
    z-index: 9999;
    box-shadow: 0 4px 20px rgba(34,197,94,0.3);
    transition: opacity 0.3s;
  `;
  notif.textContent = mensaje;

  document.body.appendChild(notif);

  // Se elimina automáticamente después de 3 segundos
  setTimeout(() => notif.remove(), 3000);
}
