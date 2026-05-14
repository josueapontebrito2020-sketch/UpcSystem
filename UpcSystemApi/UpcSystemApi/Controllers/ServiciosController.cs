using Microsoft.AspNetCore.Mvc;
using UpcSystemApi.Models;

namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiciosController : ControllerBase
    {
        // GET api/servicios
        [HttpGet]
        public IActionResult GetAll() => Ok(FakeDatabase.Servicios);
    }
}