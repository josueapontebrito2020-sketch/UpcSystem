using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Models;

namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")] // Ruta base: api/mensajes
    [ApiController] // Indica que es un controller de API
    public class MensajesController : ControllerBase
    {
        private readonly AppDbContext _context; // Variable para acceder a la BD

        // Constructor: recibe el DbContext automáticamente (inyección de dependencias)
        public MensajesController(AppDbContext context)
        {
            _context = context; // Guarda la conexión a la BD
        }

        [HttpGet] // Responde a GET api/mensajes?usuarioId=2
        public async Task<IActionResult> GetByUsuario([FromQuery] int usuarioId)
        {
            var lista = await _context.Mensajes
                .Where(m => m.UsuarioId == usuarioId) // Filtra los mensajes del usuario
                .ToListAsync();

            return Ok(lista); // Devuelve los mensajes con código 200
        }

        [HttpPost] // Responde a POST api/mensajes
        public async Task<IActionResult> Enviar([FromBody] Mensaje nuevo)
        {
            nuevo.Hora = DateTime.Now.ToString("HH:mm"); // Asigna la hora actual al mensaje
            _context.Mensajes.Add(nuevo); // Agrega el mensaje a la BD
            await _context.SaveChangesAsync(); // Guarda los cambios en la BD
            return Ok(nuevo); // Devuelve el mensaje creado con código 200
        }
    }
}