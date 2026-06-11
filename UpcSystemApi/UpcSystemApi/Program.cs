using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Middleware;
using UpcSystemApi.Models;
using UpcSystemApi.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


// CONTROLLERS Y FORMATO JSON
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// SWAGGER
builder.Services.AddEndpointsApiExplorer();    // descubre los endpoints automáticamente
builder.Services.AddSwaggerGen(c =>                         
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme  // agrega el botón key "Authorize" en Swagger
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement    // le dice a Swagger que los endpoints requieren token
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// BASE DE DATOS
//Registra la conexión a SQL Server.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// JWT HELPER Y AUTENTICACIÓN
builder.Services.AddScoped<JwtHelper>();   // 1. Registra el JwtHelper para que se pueda inyectar en los controllers

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,     // no verifica quién emitió el token
            ValidateAudience = false,   // no verifica para quién es el token
            ValidateLifetime = true,        // SÍ verifica que el token no esté expirado
            ValidateIssuerSigningKey = true,         // SÍ verifica que la firma sea válida
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"]))
        };
    });


// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")  // solo acepta peticiones de React
              .AllowAnyHeader()                        // acepta cualquier cabecera (Authorization, x-api-key, etc.)
              .AllowAnyMethod();                        // acepta GET, POST, PUT, DELETE, etc.
    });
});

var app = builder.Build();


// MIDDLEWARES
app.UseCors("AllowReact");                      // 1. Primero CORS — permite peticiones del React
app.UseMiddleware<ApiKeyMiddleware>();           // 2. Verifica que venga la API Key en el header
app.UseHttpsRedirection();                      // 3. Redirige HTTP → HTTPS

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();               // activa la documentación JSON de Swagger
    app.UseSwaggerUI();             // activa la interfaz visual en /swagger
}

app.UseAuthentication();        // 4. Verifica el token JWT
app.UseAuthorization();         // 5. Verifica los permisos ([Authorize], roles, etc.)
app.MapControllers();           // 6. Conecta las URLs con los controllers
app.Run();                      // 7. Arranca el servidor y se queda escuchando peticiones