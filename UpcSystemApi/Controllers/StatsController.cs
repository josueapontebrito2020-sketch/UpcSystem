using Microsoft.AspNetCore.Mvc;
using UpcSystemApi.Models;

namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatsController : ControllerBase
    {
        // GET api/stats
        [HttpGet]
        public IActionResult GetStats()
        {
            return Ok(new
            {
                totalReparaciones = FakeDatabase.Reparaciones.Count,
                enProgreso = FakeDatabase.Reparaciones.Count(r => r.Estado == "En reparación"),
                completadas = FakeDatabase.Reparaciones.Count(r => r.Estado == "Completado"),
                totalClientes = FakeDatabase.Users.Count(u => u.Role == "user"),
                ingresoHoy = 840000
            });
        }
    }
}