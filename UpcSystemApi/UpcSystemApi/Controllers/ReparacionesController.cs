using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Models;

namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")] 
    [ApiController] 
    public class ReparacionesController : ControllerBase
    {
        private readonly AppDbContext _context; 

        
        public ReparacionesController(AppDbContext context)
        {
            _context = context; 
        }

        [HttpGet] // Responde a GET api/reparaciones?usuarioId=2
        public async Task<IActionResult> GetByUsuario([FromQuery] int usuarioId)
        {
            var lista = await _context.Reparaciones
                .Where(r => r.UsuarioId == usuarioId) // Filtra las reparaciones del usuario
                .ToListAsync();

            return Ok(lista); 
        }

        [HttpGet("todas")] // Responde a GET api/reparaciones/todas (para el panel del dueño)
        public async Task<IActionResult> GetTodas()
        {
            // Trae todas las reparaciones e incluye el nombre del cliente
            var lista = await _context.Reparaciones.Select(r => new
            {
                r.Id,
                r.UsuarioId,
                r.Dispositivo,
                r.Problema,
                r.Tecnico,
                r.Estado,
                r.Fecha,
                // Busca el usuario relacionado y arma su nombre completo
                nombreCliente = _context.Users
                    .Where(u => u.Id == r.UsuarioId)
                    .Select(u => u.Nombre + " " + u.Apellido)
                    .FirstOrDefault() ?? "Usuario #" + r.UsuarioId
            }).ToListAsync();

            return Ok(lista); // Devuelve todas las reparaciones con código 200
        }

        [HttpPost] // Responde a POST api/reparaciones
        public async Task<IActionResult> Crear([FromBody] Reparacion nueva)
        {
            nueva.Fecha = DateTime.Now.ToString("yyyy-MM-dd"); // Asigna la fecha actual
            nueva.Estado = "Recibido"; 
            _context.Reparaciones.Add(nueva); // Agrega la reparación a la BD
            await _context.SaveChangesAsync(); // Guarda los cambios en la BD
            return Ok(nueva); 
        }

        [HttpPatch("{id}/estado")] // Responde a PATCH api/reparaciones/1/estado
        public async Task<IActionResult> CambiarEstado(int id, [FromBody] string nuevoEstado)
        {
            var rep = await _context.Reparaciones.FindAsync(id); // Busca la reparación por ID

            if (rep == null)
                return NotFound(new { mensaje = "Reparación no encontrada" }); 

            rep.Estado = nuevoEstado; // Actualiza el estado
            await _context.SaveChangesAsync(); // Guarda los cambios en la BD
            return Ok(rep); 
        }
    }
}