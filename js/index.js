/* ============================================================
   ARCHIVO: index.js
   USO: Lógica exclusiva de la PÁGINA PRINCIPAL (index.html).
        Importado solo en index.html.
   ============================================================ */


/* ────────────────────────────────────────────────────────────
   1. FILTRO DEL CATÁLOGO DE ACCESORIOS
   Muestra/oculta productos según la categoría seleccionada.
   
   CÓMO FUNCIONA:
   - Los botones de filtro llaman a filterCatalog('categoria', this).
   - Cada .product-card tiene un atributo data-cat="nombre_categoria".
   - Esta función compara el filtro con el data-cat y muestra/oculta.
   
   CÓMO AGREGAR UNA NUEVA CATEGORÍA:
   1. En index.html agrega un botón: <button class="tab-btn" onclick="filterCatalog('nuevacat', this)">NuevaCat</button>
   2. En los .product-card nuevos pon data-cat="nuevacat"
   ──────────────────────────────────────────────────────────── */
function filterCatalog(categoria, botonPresionado) {

  // Quita el estilo "activo" de todos los botones de filtro
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Le pone el estilo "activo" solo al botón que se presionó
  botonPresionado.classList.add('active');

  // Recorre todas las tarjetas del catálogo
  document.querySelectorAll('.product-card').forEach(card => {
    if (categoria === 'todos') {
      // Si seleccionó "Todos", muestra todas las tarjetas
      card.style.display = 'block';
    } else {
      // Si el data-cat de la tarjeta coincide con el filtro, la muestra; si no, la oculta
      card.style.display = (card.dataset.cat === categoria) ? 'block' : 'none';
    }
  });
}
