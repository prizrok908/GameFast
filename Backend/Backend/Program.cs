using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Добавляем сервисы в контейнер
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Настраиваем CORS для доступа с Vercel
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVercel", policy =>
    {
        policy.WithOrigins("https://game-fast.vercel.app", 
                           "https://game-fast-denis-projects-a2553681.vercel.app")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Настраиваем HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Используем CORS перед авторизацией
app.UseCors("AllowVercel");

app.UseAuthorization();

app.MapControllers();

app.Run(); 