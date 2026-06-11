using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace UpcSystemApi.Helpers
{
    public class JwtHelper
    {
        private readonly IConfiguration _config;

        public JwtHelper(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(string email, string role, string nombre, string apellido, int id)  
        {
            var key = Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("id", id.ToString()),       // ← id del usuario
                new Claim("nombre", nombre),          // ← nombre
                new Claim("apellido", apellido),      // ← apellido
                new Claim(ClaimTypes.Email, email),   // ← correo
                new Claim(ClaimTypes.Role, role),     // ← rol
            };

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],     // Quién emite el token → "UpcSystemApi"
                audience: _config["JwtSettings:Audience"], // Para quién es el token → "UpcSystemApp"
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    double.Parse(_config["JwtSettings:ExpiresInMinutes"]!)),
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(key),          // Usa la clave secreta
                    SecurityAlgorithms.HmacSha256)          // Con el algoritmo HmacSha256 para firmar
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}