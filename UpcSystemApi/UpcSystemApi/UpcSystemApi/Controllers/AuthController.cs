using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Models;

namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")] // Ruta base: api/auth
    [ApiController] // Indica que es un controller de API
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context; // Variable para acceder a la BD

        // Constructor: recibe el DbContext automáticamente (inyección de dependencias)
        public AuthController(AppDbContext context)
        {
            _context = context; // Guarda la conexión a la BD
        }

        [HttpPost("login")] // Responde a POST api/auth/login
        public async Task<IActionResult> Login([FromBody] LoginRequest login)
        {
            // Busca el usuario en la BD que coincida con el email y contraseña
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == login.Email && u.Password == login.Password);

            // Si no existe devuelve error 401
            if (user == null)
                return Unauthorized(new { mensaje = "Correo o contraseña incorrectos" });

            return Ok(new
            {
                user.Id,
                user.Email,
                user.Role,
                user.Nombre,
                user.Apellido,
                user.Telefono,
                user.Ciudad,
                token = "fake-token-" + user.Id // Token simulado
            });
        }

        [HttpPost("register")] // Responde a POST api/auth/register
        public async Task<IActionResult> Register([FromBody] RegisterRequest datos)
        {
            // Verifica si el correo ya está registrado en la BD
            bool existe = await _context.Users.AnyAsync(u => u.Email == datos.Email);
            if (existe)
                return BadRequest(new { mensaje = "Ese correo ya está registrado" });

            // Crea el nuevo usuario
            var nuevoUsuario = new User
            {
                Nombre = datos.Nombre,
                Apellido = datos.Apellido,
                Email = datos.Email,
                Password = datos.Password,
                Telefono = datos.Telefono,
                Ciudad = datos.Ciudad,
                Role = "user" // Por defecto todo registro es un usuario normal
            };

            _context.Users.Add(nuevoUsuario); // Agrega el usuario a la BD
            await _context.SaveChangesAsync(); // Guarda los cambios en la BD

            return Ok(new
            {
                mensaje = "Cuenta creada exitosamente",
                nuevoUsuario.Id,
                nuevoUsuario.Email,
                nuevoUsuario.Nombre,
                nuevoUsuario.Apellido,
                nuevoUsuario.Role,
                nuevoUsuario.Telefono,
                nuevoUsuario.Ciudad,
                token = "fake-token-" + nuevoUsuario.Id // Token simulado
            });
        }
    }
}