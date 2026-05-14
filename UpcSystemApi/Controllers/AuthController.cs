    using Microsoft.AspNetCore.Http;
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
                return Unauthorized();

            return Ok(new
            {
                user.Id,
                user.Email,
                user.Role
            });
        }
    }
}

