using Microsoft.AspNetCore.Mvc;
using UpcSystemApi.Models;

namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccesoriosController : ControllerBase
    {
        // GET api/accesorios
        // GET api/accesorios?categoria=fundas
        [HttpGet]
        public IActionResult GetAll([FromQuery] string? categoria)
        {
            var lista = string.IsNullOrEmpty(categoria)
                ? FakeDatabase.Accesorios
                : FakeDatabase.Accesorios.Where(a => a.Categoria == categoria).ToList();

            return Ok(lista);
        }
    }
}