using Microsoft.AspNetCore.Mvc;
using UpcSystemApi.Models;

namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MensajesController : ControllerBase
    {
        // GET api/mensajes?usuarioId=2
        [HttpGet]
        public IActionResult GetByUsuario([FromQuery] int usuarioId)
        {
            var lista = FakeDatabase.Mensajes
                .Where(m => m.UsuarioId == usuarioId)
                .ToList();

            return Ok(lista);
        }

        // POST api/mensajes
        [HttpPost]
        public IActionResult Enviar([FromBody] Mensaje nuevo)
        {
            nuevo.Id = FakeDatabase.Mensajes.Any()
                ? FakeDatabase.Mensajes.Max(m => m.Id) + 1
                : 1;
            nuevo.Hora = DateTime.Now.ToString("HH:mm");

            FakeDatabase.Mensajes.Add(nuevo);
            return Ok(nuevo);
        }
    }
}