using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Models;

namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")] // Ruta base: api/accesorios
    [ApiController] // Indica que es un controller de API
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
        {
            // Si no se envía categoría trae todos, si se envía filtra por ella
            var lista = string.IsNullOrEmpty(categoria)
                ? await _context.Accesorios.ToListAsync() // Sin filtro
                : await _context.Accesorios.Where(a => a.Categoria == categoria).ToListAsync(); // Con filtro

            return Ok(lista); // Devuelve los datos con código 200
        }
    }
}