using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Models;

namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")] // Ruta base: api/tecnicos
    [ApiController] // Indica que es un controller de API
    public class TecnicosController : ControllerBase
    {
        private readonly AppDbContext _context; // Variable para acceder a la BD

        // Constructor: recibe el DbContext automáticamente (inyección de dependencias)
        public TecnicosController(AppDbContext context)
        {
            _context = context; // Guarda la conexión a la BD
        }

        [HttpGet] // Responde a GET api/tecnicos
        public async Task<IActionResult> GetAll()
        {
            var tecnicos = await _context.Tecnicos.ToListAsync(); // Trae todos los técnicos de la BD
            return Ok(tecnicos); // Devuelve los datos con código 200
        }
    }
}