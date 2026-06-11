using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Models;
using UpcSystemApi.DTOs;  

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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var lista = await _context.Servicios.Select(s => new ServicioDTO
            {
                Id = s.Id,
                Icono = s.Icono,
                Titulo = s.Titulo,
                Descripcion = s.Descripcion,
                PrecioDesde = s.PrecioDesde
            }).ToListAsync();

            return Ok(lista);
        }

        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var srv = await _context.Servicios.FindAsync(id);
            if (srv == null)
                return NotFound(new { mensaje = "Servicio no encontrado" });

            var dto = new ServicioDTO
            {
                Id = srv.Id,
                Icono = srv.Icono,
                Titulo = srv.Titulo,
                Descripcion = srv.Descripcion,
                PrecioDesde = srv.PrecioDesde
            };

            return Ok(dto);
        }

        
        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] Servicio nuevo)
        {
            _context.Servicios.Add(nuevo);
            await _context.SaveChangesAsync();

            var dto = new ServicioDTO
            {
                Id = nuevo.Id,
                Icono = nuevo.Icono,
                Titulo = nuevo.Titulo,
                Descripcion = nuevo.Descripcion,
                PrecioDesde = nuevo.PrecioDesde
            };

            return Ok(dto);
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] Servicio datos)
        {
            var srv = await _context.Servicios.FindAsync(id);
            if (srv == null)
                return NotFound(new { mensaje = "Servicio no encontrado" });

            srv.Icono = datos.Icono;
            srv.Titulo = datos.Titulo;
            srv.Descripcion = datos.Descripcion;
            srv.PrecioDesde = datos.PrecioDesde;

            await _context.SaveChangesAsync();

            var dto = new ServicioDTO
            {
                Id = srv.Id,
                Icono = srv.Icono,
                Titulo = srv.Titulo,
                Descripcion = srv.Descripcion,
                PrecioDesde = srv.PrecioDesde
            };

            return Ok(dto);
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var srv = await _context.Servicios.FindAsync(id);
            if (srv == null)
                return NotFound(new { mensaje = "Servicio no encontrado" });

            _context.Servicios.Remove(srv);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Servicio eliminado correctamente" });
        }
    }
}