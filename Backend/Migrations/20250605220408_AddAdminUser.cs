using System;
using Microsoft.EntityFrameworkCore.Migrations;
using BCrypt.Net;

#nullable disable

namespace Backend.Migrations
{
    public partial class AddAdminUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Добавляем администратора
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Username", "Password", "PasswordHash", "Role", "RegisteredAt", "RegistrationDate" },
                values: new object[] {
                    Guid.NewGuid().ToString(),
                    "admin@admin.com",
                    "admin",
                    "admin123", // Это пароль в открытом виде
                    BCrypt.Net.BCrypt.HashPassword("admin123"), // Хешированный пароль
                    1, // 1 = Admin в enum UserRole
                    DateTime.UtcNow,
                    DateTime.UtcNow
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Email",
                keyValue: "admin@admin.com");
        }
    }
} 