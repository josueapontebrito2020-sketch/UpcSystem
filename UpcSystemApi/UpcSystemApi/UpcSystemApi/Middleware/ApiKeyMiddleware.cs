namespace UpcSystemApi.Middleware
{
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using System.Threading.Tasks;

    public class ApiKeyMiddleware
    {
        private readonly RequestDelegate _next;
        private const string APIKEYNAME = "x-api-key"; // Así se llamará el encabezado

        public ApiKeyMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // ✅ Dejar pasar las peticiones preflight de CORS sin validar API Key
            if (context.Request.Method == "OPTIONS")
            {
                await _next(context);
                return;
            }

            if (!context.Request.Headers.TryGetValue(APIKEYNAME, out var extractedApiKey))
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Error: No enviaste la API Key.");
                return;
            }

            var appSettings = context.RequestServices.GetRequiredService<IConfiguration>();
            var apiKey = appSettings.GetValue<string>("ApiKey");

            if (!apiKey.Equals(extractedApiKey))
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Error: La API Key es incorrecta.");
                return;
            }

            await _next(context);
        }
    }
}
