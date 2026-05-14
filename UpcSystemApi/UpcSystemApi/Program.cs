using UpcSystemApi.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Permite que React en localhost:5173 pueda llamar a la API
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

// Agregamos esta línea para activar la seguridad:
app.UseMiddleware<ApiKeyMiddleware>();

app.UseHttpsRedirection();
// ... resto del código

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReact");  // <-- debe ir ANTES de UseAuthorization
app.UseAuthorization();
app.MapControllers();
app.Run();