namespace UpcSystemApi.Middleware
{
    using Microsoft.AspNetCore.Http;         // Para manejar peticiones y respuestas HTTP
    using Microsoft.Extensions.Configuration; // Para leer el appsettings.json (donde está la ApiKey)
    using Microsoft.Extensions.DependencyInjection; // Para obtener servicios registrados
    using System.Threading.Tasks;            // Para usar async/await

    public class ApiKeyMiddleware // Filtro que se ejecuta ANTES de que llegue a cualquier controller
    {
        private readonly RequestDelegate _next; // Guarda la referencia al siguiente paso del pipeline

        private const string APIKEYNAME = "x-api-key"; // Nombre del encabezado que debe venir en cada petición

        public ApiKeyMiddleware(RequestDelegate next)
        {
            _next = next; // Recibe e inyecta el siguiente middleware en la cadena
        }

        public async Task InvokeAsync(HttpContext context) // Se ejecuta automáticamente en CADA petición que llega
        {
            // Si la petición es OPTIONS (preflight de CORS del navegador), la deja pasar sin validar
            if (context.Request.Method == "OPTIONS")
            {
                await _next(context); // Pasa al siguiente middleware sin revisar la API Key
                return;
            }

            // Intenta leer el encabezado "x-api-key" de la petición
            // Si NO existe ese encabezado, rechaza con error 401
            if (!context.Request.Headers.TryGetValue(APIKEYNAME, out var extractedApiKey))
            {
                context.Response.StatusCode = 401; // Código de error: No autorizado
                await context.Response.WriteAsync("Error: No enviaste la API Key."); // Mensaje de error
                return; // Corta aquí, no llega al controller
            }

            // Lee la ApiKey correcta desde appsettings.json → "ApiKey": "Tuclave123"
            var appSettings = context.RequestServices.GetRequiredService<IConfiguration>();
            var apiKey = appSettings.GetValue<string>("ApiKey"); // Obtiene "Tuclave123"

            // Compara la ApiKey del encabezado con la del appsettings.json
            // Si NO coinciden, rechaza con error 401
            if (!apiKey.Equals(extractedApiKey))
            {
                context.Response.StatusCode = 401; // Código de error: No autorizado
                await context.Response.WriteAsync("Error: La API Key es incorrecta."); // Mensaje de error
                return; // Corta aquí, no llega al controller
            }

            await _next(context); // ✅ API Key válida → deja pasar la petición al controller correspondiente
        }
    }
}