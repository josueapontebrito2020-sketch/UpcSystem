using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Models;

namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController] 
    public class TecnicosController : ControllerBase
    {
        private readonly AppDbContext _context; 

        
        public TecnicosController(AppDbContext context)
        {
            _context = context; 
        }

        [HttpGet] // Responde a GET api/tecnicos
        public async Task<IActionResult> GetAll()
        {
            var tecnicos = await _context.Tecnicos.ToListAsync(); // Trae todos los técnicos de la BD
            return Ok(tecnicos); 
        }
    }
}