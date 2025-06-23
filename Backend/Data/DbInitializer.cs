using Backend.Models;
using Backend.Data.Seeds;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(ApplicationDbContext context)
        {
            // Убедимся, что база данных создана
            await context.Database.EnsureCreatedAsync();

            // Обновляем пользователей без даты регистрации
            var usersWithoutDate = await context.Users
                .Where(u => u.RegisteredAt == default)
                .ToListAsync();

            if (usersWithoutDate.Any())
            {
                foreach (var user in usersWithoutDate)
                {
                    user.RegisteredAt = DateTime.UtcNow;
                }
                await context.SaveChangesAsync();
            }

            // Проверяем, есть ли уже данные в базе
            if (await context.Products.AnyAsync())
            {
                return; // База данных уже заполнена
            }

            // Получаем все продукты из ProductSeedData
            var products = ProductSeedData.GetProducts();

            // Добавляем продукты в контекст
            await context.Products.AddRangeAsync(products);

            // Сохраняем изменения
            await context.SaveChangesAsync();
        }
    }
} 