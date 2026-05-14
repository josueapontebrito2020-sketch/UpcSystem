using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Middleware;
using UpcSystemApi.Models;

var builder = WebApplication.CreateBuilder(args); // Crea e inicializa la aplicación web

// Registra todos los controllers y configura cómo se serializa el JSON
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase; // Las propiedades en JSON salen en camelCase (ej: nombreCliente)
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true; // Acepta JSON sin importar si viene en mayúsculas o minúsculas
    });

builder.Services.AddEndpointsApiExplorer(); // Necesario para que Swagger detecte los endpoints
builder.Services.AddSwaggerGen();           // Genera la documentación visual de la API en /swagger

// Conecta la aplicación con la base de datos SQL Server
// La cadena de conexión viene de appsettings.json → "ConnectionStrings" → "DefaultConnection"
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configura CORS: permite que el frontend en React pueda hacerle peticiones a la API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Solo permite peticiones desde el puerto de Vite/React
              .AllowAnyHeader()  // Acepta cualquier encabezado (incluyendo x-api-key)
              .AllowAnyMethod(); // Acepta GET, POST, PATCH, DELETE, etc.
    });
});

var app = builder.Build(); // Construye la aplicación con todo lo registrado arriba

app.UseCors("AllowReact");             // ✅ Activa CORS — debe ir PRIMERO antes del middleware
app.UseMiddleware<ApiKeyMiddleware>(); // ✅ Activa el guardián de la API Key en cada petición

app.UseHttpsRedirection(); // Redirige HTTP a HTTPS automáticamente

if (app.Environment.IsDevelopment()) // Solo en modo desarrollo
{
    app.UseSwagger();   // Activa Swagger
    app.UseSwaggerUI(); // Activa la interfaz visual de Swagger en /swagger
}

app.UseAuthorization(); // Activa el sistema de autorización (roles, permisos)
app.MapControllers();   // Registra todas las rutas de los controllers (api/auth, api/reparaciones, etc.)
app.Run();              // Arranca el servidor y se queda escuchando peticiones