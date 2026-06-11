namespace UpcSystemApi.Models
{
    public class Mensaje
    {
        public int Id { get; set; }
        public int ReparacionId { get; set; }
        public int UsuarioId { get; set; }
        public string Autor { get; set; }
        public string Texto { get; set; }
        public string? Hora { get; set; }  
    }
}