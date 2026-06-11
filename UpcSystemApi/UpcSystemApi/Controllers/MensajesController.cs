using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Models;
using UpcSystemApi.DTOs;

namespace UpcSystemApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MensajesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MensajesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetByUsuario([FromQuery] int usuarioId)
        {
            var lista = await _context.Mensajes
                .Where(m => m.UsuarioId == usuarioId)
                .Select(m => new MensajeDTO
                {
                    Id = m.Id,
                    ReparacionId = m.ReparacionId,
                    UsuarioId = m.UsuarioId,
                    Autor = m.Autor,
                    Texto = m.Texto,
                    Hora = m.Hora
                }).ToListAsync();

            return Ok(lista);
        }

        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var msg = await _context.Mensajes.FindAsync(id);
            if (msg == null)
                return NotFound(new { mensaje = "Mensaje no encontrado" });

            var dto = new MensajeDTO
            {
                Id = msg.Id,
                ReparacionId = msg.ReparacionId,
                UsuarioId = msg.UsuarioId,
                Autor = msg.Autor,
                Texto = msg.Texto,
                Hora = msg.Hora
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Enviar([FromBody] Mensaje nuevo)
        {
            nuevo.Hora = DateTime.Now.ToString("HH:mm");
            _context.Mensajes.Add(nuevo);
            await _context.SaveChangesAsync();

            var dto = new MensajeDTO
            {
                Id = nuevo.Id,
                ReparacionId = nuevo.ReparacionId,
                UsuarioId = nuevo.UsuarioId,
                Autor = nuevo.Autor,
                Texto = nuevo.Texto,
                Hora = nuevo.Hora
            };

            return Ok(dto);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] Mensaje datos)
        {
            var msg = await _context.Mensajes.FindAsync(id);
            if (msg == null)
                return NotFound(new { mensaje = "Mensaje no encontrado" });

            msg.Texto = datos.Texto;
            await _context.SaveChangesAsync();

            var dto = new MensajeDTO
            {
                Id = msg.Id,
                ReparacionId = msg.ReparacionId,
                UsuarioId = msg.UsuarioId,
                Autor = msg.Autor,
                Texto = msg.Texto,
                Hora = msg.Hora
            };

            return Ok(dto);
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var msg = await _context.Mensajes.FindAsync(id);
            if (msg == null)
                return NotFound(new { mensaje = "Mensaje no encontrado" });

            _context.Mensajes.Remove(msg);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Mensaje eliminado correctamente" });
        }
    }
}