using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Models;

// ─────────────────────────────────────────────────────────────
// ACCESORIOS CONTROLLER
// Maneja las peticiones relacionadas a los accesorios de la tienda
// Permite traer todos los accesorios o filtrarlos por categoría
// ─────────────────────────────────────────────────────────────
namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")] 
    [ApiController] 
    public class AccesoriosController : ControllerBase
    {
        private readonly AppDbContext _context; // Variable para acceder a la BD

        // Constructor: recibe el DbContext automáticamente (inyección de dependencias)
        public AccesoriosController(AppDbContext context)
        {
            _context = context; // Guarda la conexión a la BD
        }

        [HttpGet] // Responde a GET api/accesorios y GET api/accesorios?categoria=fundas
        public async Task<IActionResult> GetAll([FromQuery] string? categoria)
        // [FromQuery] → lee el parámetro de la URL (ej: ?categoria=fundas)
        // string? → el signo ? indica que el parámetro es opcional
        {
            var lista = string.IsNullOrEmpty(categoria)
                ? await _context.Accesorios.ToListAsync() 
                : await _context.Accesorios.Where(a => a.Categoria == categoria).ToListAsync(); 

            return Ok(lista);
        }
    }
}