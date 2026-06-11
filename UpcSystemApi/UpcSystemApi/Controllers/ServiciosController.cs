using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Models;

// ─────────────────────────────────────────────────────────────
// SERVICIOS CONTROLLER
// Maneja las peticiones relacionadas a los servicios del negocio
// Devuelve todos los servicios disponibles para mostrarlos en el Home
// ─────────────────────────────────────────────────────────────
namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")] 
    [ApiController] 
    public class ServiciosController : ControllerBase
    {
        private readonly AppDbContext _context; 

        
        public ServiciosController(AppDbContext context)
        {
            _context = context; 
        }

        [HttpGet] // Responde a GET api/servicios
        public async Task<IActionResult> GetAll()
        {
            var servicios = await _context.Servicios.ToListAsync(); // Trae todos los servicios de la BD
            return Ok(servicios); 
        }
    } 
} 