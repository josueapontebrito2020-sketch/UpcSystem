using Microsoft.EntityFrameworkCore;
using UpcSystemApi.Middleware;
using UpcSystemApi.Models;
using UpcSystemApi.Helpers;                              
using Microsoft.AspNetCore.Authentication.JwtBearer;    
using Microsoft.IdentityModel.Tokens;                   
using System.Text;                                      

var builder = WebApplication.CreateBuilder(args);

// ─────────────────────────────────────────────────────────────
// CONTROLLERS Y FORMATO JSON
// ─────────────────────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// ─────────────────────────────────────────────────────────────
// SWAGGER
// ─────────────────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ─────────────────────────────────────────────────────────────
// BASE DE DATOS
// ─────────────────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ─────────────────────────────────────────────────────────────
// JWT HELPER Y AUTENTICACIÓN                                  ← NUEVO BLOQUE
// ─────────────────────────────────────────────────────────────
builder.Services.AddScoped<JwtHelper>();                 // ← NUEVO: registra el helper

builder.Services.AddAuthentication("Bearer")            // ← NUEVO: activa JWT
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"]))
        };
    });

// ─────────────────────────────────────────────────────────────
// CORS
// ─────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// ─────────────────────────────────────────────────────────────
// MIDDLEWARES — EL ORDEN IMPORTA
// ─────────────────────────────────────────────────────────────
app.UseCors("AllowReact");
app.UseMiddleware<ApiKeyMiddleware>();
app.UseHttpsRedirection();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();  // ← NUEVO: debe ir ANTES de UseAuthorization
app.UseAuthorization();
app.MapControllers();
app.Run();