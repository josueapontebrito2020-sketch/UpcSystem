namespace UpcSystemApi.Models
{
    public class Mensaje
    {
        public int Id { get; set; }
        public int ReparacionId { get; set; }  // para saber qué equipo
        public int UsuarioId { get; set; }     // para filtrar el chat por usuario
        public string Autor { get; set; }
        public string Texto { get; set; }
        public string Hora { get; set; }
    }
}