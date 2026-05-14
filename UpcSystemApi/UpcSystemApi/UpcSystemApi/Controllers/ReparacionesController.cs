using Microsoft.AspNetCore.Mvc;
using UpcSystemApi.Models;

namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReparacionesController : ControllerBase
    {
        // GET api/reparaciones?usuarioId=2
        [HttpGet]
        public IActionResult GetByUsuario([FromQuery] int usuarioId)
        {
            var lista = FakeDatabase.Reparaciones
                .Where(r => r.UsuarioId == usuarioId)
                .ToList();
            return Ok(lista);
        }

        // GET api/reparaciones/todas  (para el panel del dueño)
        [HttpGet("todas")]
        public IActionResult GetTodas()
        {
            // ✅ Incluir nombre del cliente en cada reparación
            var lista = FakeDatabase.Reparaciones.Select(r =>
            {
                var usuario = FakeDatabase.Users.FirstOrDefault(u => u.Id == r.UsuarioId);
                return new
                {
                    r.Id,
                    r.UsuarioId,
                    r.Dispositivo,
                    r.Problema,
                    r.Tecnico,
                    r.Estado,
                    r.Fecha,
                    nombreCliente = usuario != null
                        ? $"{usuario.Nombre} {usuario.Apellido}".Trim()
                        : $"Usuario #{r.UsuarioId}"
                };
            }).ToList();

            return Ok(lista);
        }

        // POST api/reparaciones
        [HttpPost]
        public IActionResult Crear([FromBody] Reparacion nueva)
        {
            nueva.Id = FakeDatabase.Reparaciones.Count + 1;
            nueva.Fecha = DateTime.Now.ToString("yyyy-MM-dd");
            nueva.Estado = "Recibido";
            FakeDatabase.Reparaciones.Add(nueva);
            return Ok(nueva);
        }

        // PATCH api/reparaciones/1/estado
        [HttpPatch("{id}/estado")]
        public IActionResult CambiarEstado(int id, [FromBody] string nuevoEstado)
        {
            var rep = FakeDatabase.Reparaciones.FirstOrDefault(r => r.Id == id);
            if (rep == null)
                return NotFound(new { mensaje = "Reparación no encontrada" });

            rep.Estado = nuevoEstado;
            return Ok(rep);
        }
    }
}