using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Models;

namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")] // Ruta base: api/stats
    [ApiController] // Indica que es un controller de API
    public class StatsController : ControllerBase
    {
        private readonly AppDbContext _context; // Variable para acceder a la BD

        // Constructor: recibe el DbContext automáticamente (inyección de dependencias)
        public StatsController(AppDbContext context)
        {
            _context = context; // Guarda la conexión a la BD
        }

        [HttpGet] // Responde a GET api/stats
        public async Task<IActionResult> GetStats()
        {
            return Ok(new
            {
                totalReparaciones = await _context.Reparaciones.CountAsync(), // Cuenta todas las reparaciones
                enProgreso = await _context.Reparaciones.CountAsync(r => r.Estado == "En reparación"), // Cuenta las activas
                completadas = await _context.Reparaciones.CountAsync(r => r.Estado == "Completado"), // Cuenta las completadas
                totalClientes = await _context.Users.CountAsync(u => u.Role == "user"), // Cuenta los clientes
                ingresoHoy = 840000 // Valor fijo por ahora (se puede calcular después)
            });
        }
    }
}