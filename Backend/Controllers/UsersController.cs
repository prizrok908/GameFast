using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Data;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UsersController> _logger;
        private readonly IWebHostEnvironment _environment;
        private readonly string _uploadsPath;
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
        private const int _maxFileSize = 5 * 1024 * 1024; // 5 MB

        public UsersController(
            ApplicationDbContext context,
            ILogger<UsersController> logger,
            IWebHostEnvironment environment)
        {
            _context = context;
            _logger = logger;
            _environment = environment;
            _uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "avatars");
            Directory.CreateDirectory(_uploadsPath);
        }

        // GET: api/Users
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    id = u.Id,
                    username = u.Username,
                    email = u.Email,
                    role = u.Role.ToString(),
                    registrationDate = u.RegistrationDate,
                    lastLoginDate = u.LastLoginDate,
                    avatarUrl = u.AvatarUrl
                })
                .ToListAsync();

            return users;
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<object>> GetUser(string id)
        {
            var user = await _context.Users
                .Select(u => new
                {
                    id = u.Id,
                    username = u.Username,
                    email = u.Email,
                    role = u.Role.ToString(),
                    registrationDate = u.RegistrationDate,
                    lastLoginDate = u.LastLoginDate,
                    avatarUrl = u.AvatarUrl
                })
                .FirstOrDefaultAsync(u => u.id == id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5/role
        [HttpPut("{id}/role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUserRole(string id, [FromBody] string role)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            // Проверяем, что роль валидная
            if (!System.Enum.TryParse<UserRole>(role, out var newRole))
            {
                return BadRequest("Недопустимая роль");
            }

            user.Role = newRole;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(user.AvatarUrl))
            {
                var fileName = Path.GetFileName(user.AvatarUrl);
                var filePath = Path.Combine(_uploadsPath, fileName);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Users/Current
        [HttpGet("Current")]
        public async Task<ActionResult<object>> GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users
                .Select(u => new
                {
                    id = u.Id,
                    username = u.Username,
                    email = u.Email,
                    role = u.Role.ToString(),
                    avatarUrl = u.AvatarUrl
                })
                .FirstOrDefaultAsync(u => u.id == userId);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPost("Avatar")]
        public async Task<ActionResult<string>> UploadAvatar([FromForm] string userId, IFormFile avatar)
        {
            try
            {
                if (avatar == null || avatar.Length == 0)
                {
                    return BadRequest("Файл не был загружен");
                }

                if (avatar.Length > _maxFileSize)
                {
                    return BadRequest("Размер файла не должен превышать 5 МБ");
                }

                var extension = Path.GetExtension(avatar.FileName).ToLowerInvariant();
                if (!_allowedExtensions.Contains(extension))
                {
                    return BadRequest($"Недопустимый формат файла. Разрешены только: {string.Join(", ", _allowedExtensions)}");
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound("Пользователь не найден");
                }

                // Удаляем старый аватар, если он существует
                if (!string.IsNullOrEmpty(user.AvatarUrl))
                {
                    try
                    {
                        var oldFileName = Path.GetFileName(user.AvatarUrl);
                        var oldFilePath = Path.Combine(_uploadsPath, oldFileName);
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Ошибка при удалении старого аватара");
                        // Продолжаем выполнение, так как это не критическая ошибка
                    }
                }

                // Генерируем уникальное имя файла
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(_uploadsPath, fileName);

                // Проверяем, существует ли директория
                if (!Directory.Exists(_uploadsPath))
                {
                    Directory.CreateDirectory(_uploadsPath);
                }

                // Сохраняем файл
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await avatar.CopyToAsync(stream);
                }

                // Проверяем, что файл действительно был сохранен
                if (!System.IO.File.Exists(filePath))
                {
                    throw new Exception("Файл не был сохранен");
                }

                // Обновляем URL аватара пользователя
                user.AvatarUrl = $"/uploads/avatars/{fileName}";
                await _context.SaveChangesAsync();

                return Ok(new { avatarUrl = user.AvatarUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при загрузке аватара");
                return StatusCode(500, "Произошла ошибка при загрузке аватара. Пожалуйста, попробуйте позже.");
            }
        }
    }
} 