/* ============================================================
   ARCHIVO: global.js
   USO: Funciones compartidas por TODAS las páginas.
        Importado en todos los archivos HTML al final del <body>.
   ============================================================ */


/* ────────────────────────────────────────────────────────────
   1. MENÚ HAMBURGUESA (MÓVIL)
   Abre/cierra el menú desplegable cuando la pantalla es pequeña.
   Se activa con el botón de las 3 líneas (☰) en la navbar.
   
   CÓMO FUNCIONA:
   - El HTML tiene un <div id="mobileMenu"> con los links del menú.
   - Al presionar el botón hamburguesa se agrega/quita la clase "open".
   - La clase "open" en global.css hace que el menú se muestre (display: flex).
   ──────────────────────────────────────────────────────────── */
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) {
    menu.classList.toggle('open');
  }
}


/* ────────────────────────────────────────────────────────────
   2. ANIMACIÓN FADE-IN AL HACER SCROLL
   Los elementos con clase "fade-in" aparecen suavemente
   cuando el usuario los ve al bajar la página.
   
   CÓMO USARLO EN EL HTML:
   - Agrega class="fade-in" a cualquier elemento que quieras animar.
   - Cuando ese elemento aparezca en pantalla, se le agrega "visible".
   - El CSS de global.css define la transición de opacidad/posición.
   ──────────────────────────────────────────────────────────── */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Cuando el elemento es visible, añade la clase que lo muestra
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1 // se activa cuando el 10% del elemento es visible
});

// Aplicar a todos los elementos con clase fade-in
document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
