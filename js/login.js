/* ============================================================
   ARCHIVO: login.js
   USO: Lógica exclusiva de login.html (inicio de sesión).
   ============================================================ */


/* ────────────────────────────────────────────────────────────
   1. MANEJO DEL FORMULARIO DE LOGIN
   Redirige al usuario al panel correcto según su rol.
   
   LÓGICA DE ROLES (DEMO):
   - Si el correo contiene "admin", "owner" o "propietario"
     → va al panel del propietario (owner.html)
   - Cualquier otro correo
     → va al panel del usuario (user.html)
   
   ¡IMPORTANTE! En una aplicación real esto lo hace el servidor
   (backend), no el navegador. Aquí es solo una simulación.
   ──────────────────────────────────────────────────────────── */
function handleLogin(event) {
  // Evita que el formulario recargue la página al enviar
  event.preventDefault();

  const email = document.getElementById('email').value;

  // Detecta si es un correo de propietario/administrador
  const esAdmin = email.includes('admin') ||
                  email.includes('owner') ||
                  email.includes('propietario');

  if (esAdmin) {
    // Redirige al panel del propietario
    window.location.href = 'owner.html';
  } else {
    // Redirige al panel del usuario normal
    window.location.href = 'user.html';
  }
}
