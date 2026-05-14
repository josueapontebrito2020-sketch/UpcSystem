/* ============================================================
   ARCHIVO: register.js
   USO: Lógica exclusiva de register.html (crear cuenta).
   ============================================================ */


/* ────────────────────────────────────────────────────────────
   1. INDICADOR DE SEGURIDAD DE CONTRASEÑA
   Muestra qué tan segura es la contraseña mientras el usuario escribe.
   
   NIVELES DE SEGURIDAD:
   score 0 → sin contraseña
   score 1 → muy débil (rojo)
   score 2 → débil (naranja)
   score 3 → buena (amarillo)
   score 4 → excelente (verde)
   
   CÓMO FUNCIONA:
   - La función se llama con oninput="checkStrength(this.value)" en el HTML.
   - Suma puntos según criterios (longitud, mayúsculas, números, símbolos).
   - Actualiza la barra de color y el texto.
   
   CÓMO CAMBIAR LOS CRITERIOS:
   - Modifica las condiciones if() debajo para hacer la validación más/menos estricta.
   ──────────────────────────────────────────────────────────── */
function checkStrength(valor) {
  const barra  = document.getElementById('strengthFill');
  const texto  = document.getElementById('strengthLabel');

  let puntos = 0;

  // +1 punto si tiene al menos 8 caracteres
  if (valor.length >= 8) puntos++;

  // +1 punto si tiene al menos una letra mayúscula
  if (/[A-Z]/.test(valor)) puntos++;

  // +1 punto si tiene al menos un número
  if (/[0-9]/.test(valor)) puntos++;

  // +1 punto si tiene al menos un símbolo especial
  if (/[^A-Za-z0-9]/.test(valor)) puntos++;

  // Configuración visual para cada nivel (ancho de barra, color, texto)
  const niveles = [
    { ancho: '0%',   color: 'transparent', etiqueta: 'Ingresa una contraseña' },
    { ancho: '25%',  color: '#ef4444',     etiqueta: 'Muy débil' },
    { ancho: '50%',  color: '#f97316',     etiqueta: 'Débil' },
    { ancho: '75%',  color: '#eab308',     etiqueta: 'Buena' },
    { ancho: '100%', color: '#22c55e',     etiqueta: '¡Excelente!' },
  ];

  // Aplica el nivel correspondiente a la barra y al texto
  barra.style.width      = niveles[puntos].ancho;
  barra.style.background = niveles[puntos].color;
  texto.textContent      = niveles[puntos].etiqueta;
}


/* ────────────────────────────────────────────────────────────
   2. MANEJO DEL FORMULARIO DE REGISTRO
   Muestra un mensaje de éxito al enviar el formulario.
   
   ¡IMPORTANTE! En una aplicación real aquí se enviarían los
   datos al servidor para crear la cuenta en la base de datos.
   ──────────────────────────────────────────────────────────── */
function handleRegister(event) {
  // Evita que el formulario recargue la página
  event.preventDefault();

  // Oculta el formulario
  document.getElementById('formContent').style.display = 'none';

  // Muestra el mensaje de éxito
  document.getElementById('successMsg').style.display = 'block';
}
