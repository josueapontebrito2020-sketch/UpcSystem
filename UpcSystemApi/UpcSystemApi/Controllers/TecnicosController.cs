using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Models;
using UpcSystemApi.DTOs;  

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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var lista = await _context.Tecnicos.Select(t => new TecnicoDTO
            {
                Id = t.Id,
                Avatar = t.Avatar,
                Nombre = t.Nombre,
                Rol = t.Rol,
                Bio = t.Bio,
                Skills = t.Skills,
                Rating = t.Rating,
                RatingTexto = t.RatingTexto
            }).ToListAsync();

            return Ok(lista);
        }

        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var tec = await _context.Tecnicos.FindAsync(id);
            if (tec == null)
                return NotFound(new { mensaje = "Técnico no encontrado" });

            var dto = new TecnicoDTO
            {
                Id = tec.Id,
                Avatar = tec.Avatar,
                Nombre = tec.Nombre,
                Rol = tec.Rol,
                Bio = tec.Bio,
                Skills = tec.Skills,
                Rating = tec.Rating,
                RatingTexto = tec.RatingTexto
            };

            return Ok(dto);
        }

        
        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] Tecnico nuevo)
        {
            _context.Tecnicos.Add(nuevo);
            await _context.SaveChangesAsync();

            var dto = new TecnicoDTO
            {
                Id = nuevo.Id,
                Avatar = nuevo.Avatar,
                Nombre = nuevo.Nombre,
                Rol = nuevo.Rol,
                Bio = nuevo.Bio,
                Skills = nuevo.Skills,
                Rating = nuevo.Rating,
                RatingTexto = nuevo.RatingTexto
            };

            return Ok(dto);
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] Tecnico datos)
        {
            var tec = await _context.Tecnicos.FindAsync(id);
            if (tec == null)
                return NotFound(new { mensaje = "Técnico no encontrado" });

            tec.Avatar = datos.Avatar;
            tec.Nombre = datos.Nombre;
            tec.Rol = datos.Rol;
            tec.Bio = datos.Bio;
            tec.Skills = datos.Skills;
            tec.Rating = datos.Rating;
            tec.RatingTexto = datos.RatingTexto;

            await _context.SaveChangesAsync();

            var dto = new TecnicoDTO
            {
                Id = tec.Id,
                Avatar = tec.Avatar,
                Nombre = tec.Nombre,
                Rol = tec.Rol,
                Bio = tec.Bio,
                Skills = tec.Skills,
                Rating = tec.Rating,
                RatingTexto = tec.RatingTexto
            };

            return Ok(dto);
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var tec = await _context.Tecnicos.FindAsync(id);
            if (tec == null)
                return NotFound(new { mensaje = "Técnico no encontrado" });

            _context.Tecnicos.Remove(tec);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Técnico eliminado correctamente" });
        }
    }
}