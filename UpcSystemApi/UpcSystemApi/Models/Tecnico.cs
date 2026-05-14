namespace UpcSystemApi.Models
{
	public class Tecnico
	{
		public int Id { get; set; }
		public string Avatar { get; set; }
		public string Nombre { get; set; }
		public string Rol { get; set; }
		public string Bio { get; set; }
		public List<string> Skills { get; set; }
		public double Rating { get; set; }
		public string RatingTexto { get; set; }
	}
}