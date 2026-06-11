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
    public class ReparacionesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReparacionesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetByUsuario([FromQuery] int usuarioId)
        {
            var lista = await _context.Reparaciones
                .Where(r => r.UsuarioId == usuarioId)
                .Select(r => new ReparacionDTO
                {
                    Id = r.Id,
                    UsuarioId = r.UsuarioId,
                    Dispositivo = r.Dispositivo,
                    Problema = r.Problema,
                    Tecnico = r.Tecnico,
                    Estado = r.Estado,
                    Fecha = r.Fecha
                }).ToListAsync();

            return Ok(lista);
        }

        [HttpGet("todas")]
        public async Task<IActionResult> GetTodas()
        {
            var lista = await _context.Reparaciones.Select(r => new
            {
                r.Id,
                r.UsuarioId,
                r.Dispositivo,
                r.Problema,
                r.Tecnico,
                r.Estado,
                r.Fecha,
                nombreCliente = _context.Users
                    .Where(u => u.Id == r.UsuarioId)
                    .Select(u => u.Nombre + " " + u.Apellido)
                    .FirstOrDefault() ?? "Usuario #" + r.UsuarioId
            }).ToListAsync();

            return Ok(lista);
        }

        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var rep = await _context.Reparaciones.FindAsync(id);
            if (rep == null)
                return NotFound(new { mensaje = "Reparación no encontrada" });

            var dto = new ReparacionDTO
            {
                Id = rep.Id,
                UsuarioId = rep.UsuarioId,
                Dispositivo = rep.Dispositivo,
                Problema = rep.Problema,
                Tecnico = rep.Tecnico,
                Estado = rep.Estado,
                Fecha = rep.Fecha
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] Reparacion nueva)
        {
            nueva.Fecha = DateTime.Now.ToString("yyyy-MM-dd");
            nueva.Estado = "Recibido";
            _context.Reparaciones.Add(nueva);
            await _context.SaveChangesAsync();

            var dto = new ReparacionDTO
            {
                Id = nueva.Id,
                UsuarioId = nueva.UsuarioId,
                Dispositivo = nueva.Dispositivo,
                Problema = nueva.Problema,
                Tecnico = nueva.Tecnico,
                Estado = nueva.Estado,
                Fecha = nueva.Fecha
            };

            return Ok(dto);
        }

        [HttpPatch("{id}/estado")]
        public async Task<IActionResult> CambiarEstado(int id, [FromBody] string nuevoEstado)
        {
            var rep = await _context.Reparaciones.FindAsync(id);
            if (rep == null)
                return NotFound(new { mensaje = "Reparación no encontrada" });

            rep.Estado = nuevoEstado;
            await _context.SaveChangesAsync();

            var dto = new ReparacionDTO
            {
                Id = rep.Id,
                UsuarioId = rep.UsuarioId,
                Dispositivo = rep.Dispositivo,
                Problema = rep.Problema,
                Tecnico = rep.Tecnico,
                Estado = rep.Estado,
                Fecha = rep.Fecha
            };

            return Ok(dto);
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] Reparacion datos)
        {
            var rep = await _context.Reparaciones.FindAsync(id);
            if (rep == null)
                return NotFound(new { mensaje = "Reparación no encontrada" });

            rep.Dispositivo = datos.Dispositivo;
            rep.Problema = datos.Problema;
            rep.Tecnico = datos.Tecnico;
            rep.Estado = datos.Estado;

            await _context.SaveChangesAsync();

            var dto = new ReparacionDTO
            {
                Id = rep.Id,
                UsuarioId = rep.UsuarioId,
                Dispositivo = rep.Dispositivo,
                Problema = rep.Problema,
                Tecnico = rep.Tecnico,
                Estado = rep.Estado,
                Fecha = rep.Fecha
            };

            return Ok(dto);
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var rep = await _context.Reparaciones.FindAsync(id);
            if (rep == null)
                return NotFound(new { mensaje = "Reparación no encontrada" });

            _context.Reparaciones.Remove(rep);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Reparación eliminada correctamente" });
        }
    }
}