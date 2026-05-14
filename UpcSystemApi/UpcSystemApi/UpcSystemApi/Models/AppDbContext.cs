using Microsoft.EntityFrameworkCore;

namespace UpcSystemApi.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Reparacion> Reparaciones { get; set; }
        public DbSet<Mensaje> Mensajes { get; set; }
        public DbSet<Tecnico> Tecnicos { get; set; }
        public DbSet<Servicio> Servicios { get; set; }
        public DbSet<Accesorio> Accesorios { get; set; }
    }
}
