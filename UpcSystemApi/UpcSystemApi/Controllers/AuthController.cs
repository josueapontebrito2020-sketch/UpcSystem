using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Models;
using UpcSystemApi.Helpers;
using UpcSystemApi.DTOs;

namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;  // para hablar con la base de datos
        private readonly JwtHelper _jwtHelper;   // para generar tokens JWT

        public AuthController(AppDbContext context, JwtHelper jwtHelper)
        {
            _context = context;             // ASP.NET inyecta la BD automáticamente
            _jwtHelper = jwtHelper;         // ASP.NET inyecta el JwtHelper automáticamente
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest login)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == login.Email && u.Password == login.Password);   //Busca en la tabla Users un registro donde el email Y la contraseña coincidan. Si no encuentra nada devuelve null.

            if (user == null)
                return Unauthorized(new { mensaje = "Correo o contraseña incorrectos" });

            var token = _jwtHelper.GenerateToken(user.Email, user.Role, user.Nombre!, user.Apellido!, user.Id);  

            var userDto = new UserDTO
            {
                Id = user.Id,
                Nombre = user.Nombre,
                Apellido = user.Apellido,
                Email = user.Email,
                Telefono = user.Telefono,
                Ciudad = user.Ciudad,
                Role = user.Role
            };

            return Ok(new { user = userDto, token });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest datos)
        {
            bool existe = await _context.Users.AnyAsync(u => u.Email == datos.Email);  //AnyAsync devuelve true si encuentra al menos un usuario con ese email. 
            if (existe)
                return BadRequest(new { mensaje = "Ese correo ya está registrado" });

            var nuevoUsuario = new User
            {
                Nombre = datos.Nombre,
                Apellido = datos.Apellido,
                Email = datos.Email,
                Password = datos.Password,
                Telefono = datos.Telefono,
                Ciudad = datos.Ciudad,
                Role = "user"
            };

            _context.Users.Add(nuevoUsuario);  // agrega a la lista en memoria
            await _context.SaveChangesAsync(); // ejecuta el INSERT en la BD

            var token = _jwtHelper.GenerateToken(nuevoUsuario.Email, nuevoUsuario.Role, nuevoUsuario.Nombre!, nuevoUsuario.Apellido!, nuevoUsuario.Id);  //genera el token y devuelve 200 OK con el mensaje, los datos del usuario y el token.

            var userDto = new UserDTO
            {
                Id = nuevoUsuario.Id,
                Nombre = nuevoUsuario.Nombre,
                Apellido = nuevoUsuario.Apellido,
                Email = nuevoUsuario.Email,
                Telefono = nuevoUsuario.Telefono,
                Ciudad = nuevoUsuario.Ciudad,
                Role = nuevoUsuario.Role
            };

            return Ok(new { mensaje = "Cuenta creada exitosamente", user = userDto, token });
        }
    }
}