using Microsoft.EntityFrameworkCore;

// ─────────────────────────────────────────────────────────────
// APP DB CONTEXT - CONEXIÓN A LA BASE DE DATOS
// Es el puente entre la API y SQL Server
// Cada DbSet representa una tabla en la base de datos
// ─────────────────────────────────────────────────────────────
namespace UpcSystemApi.Models
{
    public class AppDbContext : DbContext
    {
        // Constructor: recibe la configuración de conexión desde Program.cs
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Cada DbSet representa una tabla en SQL Server
        // EF Core usa estas propiedades para leer y escribir datos
        public DbSet<User> Users { get; set; }           
        public DbSet<Reparacion> Reparaciones { get; set; } 
        public DbSet<Mensaje> Mensajes { get; set; }     
        public DbSet<Tecnico> Tecnicos { get; set; }     
        public DbSet<Servicio> Servicios { get; set; }   
        public DbSet<Accesorio> Accesorios { get; set; } 
    }
}
