using Microsoft.AspNetCore.Mvc;
using UpcSystemApi.Models;

namespace UpcSystemApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TecnicosController : ControllerBase
    {
        // GET api/tecnicos
        [HttpGet]
        public IActionResult GetAll() => Ok(FakeDatabase.Tecnicos);
    }
}