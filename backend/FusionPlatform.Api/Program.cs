using FusionPlatform.Api.Data;
using Microsoft.EntityFrameworkCore;
using FusionPlatform.Api.Network;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddSingleton<NetworkAgent>();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(
    "http://localhost:5173",
    "http://localhost:8081")
    .AllowAnyHeader()
    .AllowAnyMethod();
            
    });
});

builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));
     

var app = builder.Build();
var networkAgent = app.Services.GetRequiredService<NetworkAgent>();
networkAgent.Start();

Console.WriteLine(">>> NETWORK AGENT LISTENING ON PORT 5000 <<<");



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseAuthorization();

app.MapControllers();

app.Run();
