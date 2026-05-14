using Microsoft.AspNetCore.Mvc;
using UpcSystemApi.Models;

namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest login)
        {
            var user = FakeDatabase.Users
                .FirstOrDefault(u => u.Email == login.Email && u.Password == login.Password);

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
                token = "fake-token-" + user.Id
            });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest datos)
        {
            bool existe = FakeDatabase.Users.Any(u => u.Email == datos.Email);
            if (existe)
                return BadRequest(new { mensaje = "Ese correo ya está registrado" });

            var nuevoUsuario = new User
            {
                Id = FakeDatabase.Users.Count + 1,
                Nombre = datos.Nombre,
                Apellido = datos.Apellido,
                Email = datos.Email,
                Password = datos.Password,
                Telefono = datos.Telefono,
                Ciudad = datos.Ciudad,
                Role = "user"
            };

            FakeDatabase.Users.Add(nuevoUsuario);

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
                token = "fake-token-" + nuevoUsuario.Id
            });
        }
    }
}