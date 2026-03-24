/* ============================================================
   ARCHIVO: user.js
   USO: Lógica exclusiva de user.html (panel del cliente).
   ============================================================ */


/* ────────────────────────────────────────────────────────────
   1. NAVEGACIÓN ENTRE PÁGINAS DEL PANEL
   Muestra/oculta secciones del dashboard al hacer clic en el sidebar.
   
   CÓMO FUNCIONA:
   - Cada ítem del sidebar llama a showPage('nombre_pagina', this).
   - La función oculta todas las .page y muestra la que corresponde.
   - El id de cada página debe ser "page-" + nombre (ej: page-dashboard).
   
   CÓMO AGREGAR UNA NUEVA PÁGINA:
   1. En el sidebar agrega: <div class="sidebar-item" onclick="showPage('mipagina', this)">Mi Página</div>
   2. En el contenido agrega: <div class="page" id="page-mipagina">... contenido ...</div>
   ──────────────────────────────────────────────────────────── */
function showPage(nombrePagina, elementoClickeado) {
  // Oculta todas las páginas
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Quita el estado activo de todos los ítems del sidebar
  document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));

  // Muestra la página seleccionada
  document.getElementById('page-' + nombrePagina).classList.add('active');

  // Marca el ítem del sidebar como activo
  elementoClickeado.classList.add('active');
}


/* ────────────────────────────────────────────────────────────
   2. ENVIAR MENSAJE EN EL CHAT
   Agrega el mensaje del usuario a la conversación y simula
   una respuesta automática del técnico.
   
   CÓMO FUNCIONA:
   - Lee el texto del input #msgInput.
   - Crea una burbuja .msg.sent con el texto.
   - Después de 1.5 segundos, crea una respuesta automática.
   
   CÓMO CAMBIAR LAS RESPUESTAS AUTOMÁTICAS:
   - Modifica el array "respuestasAutomaticas" con las frases que quieras.
   ──────────────────────────────────────────────────────────── */
function sendMsg() {
  const input = document.getElementById('msgInput');
  const texto = input.value.trim();

  // No hace nada si el campo está vacío
  if (!texto) return;

  const contenedorMensajes = document.getElementById('chatMessages');
  const ahora = new Date();
  const horaFormato = `${ahora.getHours()}:${String(ahora.getMinutes()).padStart(2, '0')}`;

  // Crea la burbuja del mensaje enviado por el usuario
  const divMensaje = document.createElement('div');
  divMensaje.innerHTML = `
    <div class="msg sent">${texto}</div>
    <div class="msg-time">${horaFormato} · ✓</div>
  `;
  contenedorMensajes.appendChild(divMensaje);

  // Hace scroll al fondo para ver el último mensaje
  contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;

  // Limpia el campo de texto
  input.value = '';

  // ── Respuesta automática del técnico (simulación) ──
  // Modifica estas frases para cambiar las respuestas del técnico
  const respuestasAutomaticas = [
    "Entendido, te informamos pronto.",
    "Claro, estamos revisando eso.",
    "¡Por supuesto! Déjame verificar.",
    "Ok, te confirmo en un momento.",
    "Gracias por escribir, ya lo revisamos."
  ];

  // Espera 1.5 segundos antes de mostrar la respuesta
  setTimeout(() => {
    const respuestaAleatoria = respuestasAutomaticas[
      Math.floor(Math.random() * respuestasAutomaticas.length)
    ];

    const minutosRespuesta = String(ahora.getMinutes() + 1).padStart(2, '0');

    const divRespuesta = document.createElement('div');
    divRespuesta.innerHTML = `
      <div class="msg received">${respuestaAleatoria}</div>
      <div class="msg-time">${ahora.getHours()}:${minutosRespuesta}</div>
    `;
    contenedorMensajes.appendChild(divRespuesta);
    contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
  }, 1500);
}
