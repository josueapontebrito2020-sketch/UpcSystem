using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Models;
using UpcSystemApi.DTOs;  // ← AGREGADO

namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccesoriosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AccesoriosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? categoria)
        {
            var lista = string.IsNullOrEmpty(categoria)
                ? await _context.Accesorios.Select(a => new AccesorioDTO
                {
                    Id = a.Id,
                    Emoji = a.Emoji,
                    Badge = a.Badge,
                    Nombre = a.Nombre,
                    Descripcion = a.Descripcion,
                    Precio = a.Precio,
                    Categoria = a.Categoria
                }).ToListAsync()
                : await _context.Accesorios.Where(a => a.Categoria == categoria).Select(a => new AccesorioDTO
                {
                    Id = a.Id,
                    Emoji = a.Emoji,
                    Badge = a.Badge,
                    Nombre = a.Nombre,
                    Descripcion = a.Descripcion,
                    Precio = a.Precio,
                    Categoria = a.Categoria
                }).ToListAsync();

            return Ok(lista);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var acc = await _context.Accesorios.FindAsync(id);
            if (acc == null)
                return NotFound(new { mensaje = "Accesorio no encontrado" });

            var dto = new AccesorioDTO
            {
                Id = acc.Id,
                Emoji = acc.Emoji,
                Badge = acc.Badge,
                Nombre = acc.Nombre,
                Descripcion = acc.Descripcion,
                Precio = acc.Precio,
                Categoria = acc.Categoria
            };

            return Ok(dto);
        }


        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] Accesorio nuevo)
        {
            _context.Accesorios.Add(nuevo);
            await _context.SaveChangesAsync();

            var dto = new AccesorioDTO
            {
                Id = nuevo.Id,
                Emoji = nuevo.Emoji,
                Badge = nuevo.Badge,
                Nombre = nuevo.Nombre,
                Descripcion = nuevo.Descripcion,
                Precio = nuevo.Precio,
                Categoria = nuevo.Categoria
            };

            return Ok(dto);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] Accesorio datos)
        {
            var acc = await _context.Accesorios.FindAsync(id);
            if (acc == null)
                return NotFound(new { mensaje = "Accesorio no encontrado" });

            acc.Emoji = datos.Emoji;
            acc.Badge = datos.Badge;
            acc.Nombre = datos.Nombre;
            acc.Descripcion = datos.Descripcion;
            acc.Precio = datos.Precio;
            acc.Categoria = datos.Categoria;

            await _context.SaveChangesAsync();

            var dto = new AccesorioDTO
            {
                Id = acc.Id,
                Emoji = acc.Emoji,
                Badge = acc.Badge,
                Nombre = acc.Nombre,
                Descripcion = acc.Descripcion,
                Precio = acc.Precio,
                Categoria = acc.Categoria
            };

            return Ok(dto);
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var acc = await _context.Accesorios.FindAsync(id);
            if (acc == null)
                return NotFound(new { mensaje = "Accesorio no encontrado" });

            _context.Accesorios.Remove(acc);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Accesorio eliminado correctamente" });
        }
    }
}