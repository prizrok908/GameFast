using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Backend
{
    public static class CorsMiddlewareExtensions
    {
        public static IServiceCollection AddVercelCors(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowVercel", policy =>
                {
                    policy.WithOrigins(
                            "https://game-fast.vercel.app",
                            "https://game-fast-denis-projects-a2553681.vercel.app"
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            return services;
        }

        public static IApplicationBuilder UseVercelCors(this IApplicationBuilder app)
        {
            app.UseCors("AllowVercel");
            return app;
        }
    }
} 