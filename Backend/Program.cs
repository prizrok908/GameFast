using Microsoft.EntityFrameworkCore;
using Backend.Data;
using System.Text.Json.Serialization;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Swagger;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// Configure JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "your-256-bit-secret"))
        };
    });

// Add CORS with updated settings
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
        if (allowedOrigins != null && allowedOrigins.Length > 0)
        {
            builder.WithOrigins(allowedOrigins)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowedToAllowWildcardSubdomains()
                .AllowCredentials();
        }
        else
        {
            // Fallback к статическим значениям, если конфигурация не загрузилась
            builder.WithOrigins(
                "http://localhost:3000", 
                "https://gamefast-frontend.vercel.app",
                "https://gamefast-frontend-git-frontend-prizrak908.vercel.app",
                "https://gamefast-frontend-prizrak908.vercel.app",
                "https://game-fast.vercel.app"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .SetIsOriginAllowedToAllowWildcardSubdomains()
            .AllowCredentials();
        }
    });
});

// Настраиваем контекст базы данных
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Регистрируем фоновый сервис для авто-обновления статусов заказов
builder.Services.AddHostedService<OrderStatusBackgroundService>();

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "PlayStation Store API", Version = "v1" });
    
    // Добавляем поддержку JWT в Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Инициализируем базу данных
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        await DbInitializer.Initialize(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while initializing the database.");
    }
}

// Настраиваем статические файлы
app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads")),
    RequestPath = "/uploads"
});

// Используем CORS до аутентификации
app.UseCors();

// Настраиваем HTTPS
app.UseHttpsRedirection();

// Аутентификация и авторизация
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run(); 