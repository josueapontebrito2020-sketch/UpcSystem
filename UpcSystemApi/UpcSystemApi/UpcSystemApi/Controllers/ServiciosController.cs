using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Models;

namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")] // Ruta base: api/servicios
    [ApiController] // Indica que es un controller de API
    public class ServiciosController : ControllerBase
    {
        private readonly AppDbContext _context; // Variable para acceder a la BD

        // Constructor: recibe el DbContext automáticamente (inyección de dependencias)
        public ServiciosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var servicios = await _context.Servicios.ToListAsync(); // Trae todos los servicios de la BD
            return Ok(servicios); // Devuelve los datos con código 200
        }
    }
}