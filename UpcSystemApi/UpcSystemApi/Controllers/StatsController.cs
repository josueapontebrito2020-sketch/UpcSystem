using Microsoft.AspNetCore.Authorization;  
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Models;

namespace UpcSystemApi.Controllers
{
    [Authorize]  
    [Route("api/[controller]")]
    [ApiController]
    public class StatsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetStats()
        {
            return Ok(new
            {
                totalReparaciones = await _context.Reparaciones.CountAsync(),
                enProgreso = await _context.Reparaciones.CountAsync(r => r.Estado == "En reparación"),
                completadas = await _context.Reparaciones.CountAsync(r => r.Estado == "Completado"),
                totalClientes = await _context.Users.CountAsync(u => u.Role == "user"),
                ingresoHoy = 840000
            });
        }
    }
}