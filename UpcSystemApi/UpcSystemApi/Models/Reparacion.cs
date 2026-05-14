namespace UpcSystemApi.Models
{
    public class Reparacion
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public string Dispositivo { get; set; }
        public string Problema { get; set; }
        public string Tecnico { get; set; }
        public string Estado { get; set; }
        public string Fecha { get; set; }
    }
}