using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Data;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Cors;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using BCrypt.Net;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AuthController> _logger;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, ILogger<AuthController> logger, IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // POST: api/Auth/register
        [HttpPost("register")]
        public async Task<ActionResult<object>> Register(RegisterRequest request)
        {
            try
            {
                _logger.LogInformation("Attempting to register user with email: {Email}", request.Email);

                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.Username))
                {
                    return BadRequest(new { message = "Email, пароль и имя пользователя обязательны" });
                }

                if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                {
                    return BadRequest(new { message = "Пользователь с таким email уже существует" });
                }

                if (await _context.Users.AnyAsync(u => u.Username == request.Username))
                {
                    return BadRequest(new { message = "Пользователь с таким именем уже существует" });
                }

                var user = new User
                {
                    Username = request.Username,
                    Email = request.Email,
                    Password = request.Password,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    Role = UserRole.User,
                    RegistrationDate = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var token = GenerateJwtToken(user);

                var response = new
                {
                    token = token,
                    user = new
                    {
                        id = user.Id,
                        email = user.Email,
                        username = user.Username,
                        role = user.Role.ToString(),
                        registeredAt = user.RegistrationDate,
                        avatarUrl = user.AvatarUrl
                    }
                };

                _logger.LogInformation("User registered successfully: {Email}", request.Email);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering user: {Email}", request.Email);
                return StatusCode(500, new { message = "Внутренняя ошибка сервера при регистрации" });
            }
        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<ActionResult<object>> Login(LoginRequest request)
        {
            try
            {
                _logger.LogInformation("Attempting to log in user: {Email}", request.Email);

                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    return BadRequest(new { message = "Email и пароль обязательны" });
                }

                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    return Unauthorized(new { message = "Неверный email или пароль" });
                }

                user.LastLoginDate = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                var token = GenerateJwtToken(user);

                var response = new
                {
                    token = token,
                    user = new
                    {
                        id = user.Id,
                        email = user.Email,
                        username = user.Username,
                        role = user.Role.ToString(),
                        registeredAt = user.RegistrationDate,
                        avatarUrl = user.AvatarUrl
                    }
                };

                _logger.LogInformation("User logged in successfully: {Email}", request.Email);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging in user: {Email}", request.Email);
                return StatusCode(500, new { message = "Внутренняя ошибка сервера при входе" });
            }
        }

        // GET: api/Auth/profile
        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<object>> GetProfile()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Пользователь не авторизован" });
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "Пользователь не найден" });
                }

                var purchasesCount = await _context.Purchases.CountAsync(p => p.UserId == userId);
                var totalSpent = await _context.Purchases
                    .Where(p => p.UserId == userId)
                    .SumAsync(p => p.Price * p.Quantity);

                var response = new
                {
                    id = user.Id,
                    email = user.Email,
                    username = user.Username,
                    role = user.Role.ToString(),
                    registeredAt = user.RegistrationDate,
                    avatarUrl = user.AvatarUrl,
                    purchasesCount = purchasesCount,
                    totalSpent = totalSpent
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user profile");
                return StatusCode(500, new { message = "Внутренняя ошибка сервера" });
            }
        }

        // DELETE: api/Auth/delete-account
        [HttpDelete("delete-account")]
        [Authorize]
        public async Task<IActionResult> DeleteAccount()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Пользователь не авторизован" });
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "Пользователь не найден" });
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Аккаунт успешно удален" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user account");
                return StatusCode(500, new { message = "Внутренняя ошибка сервера" });
            }
        }

        // POST: api/Auth/CreateAdmin
        [HttpPost("CreateAdmin")]
        public async Task<ActionResult<object>> CreateAdmin(RegisterRequest request)
        {
            // Проверяем, есть ли уже администратор
            if (await _context.Users.AnyAsync(u => u.Role == UserRole.Admin))
            {
                return BadRequest("Администратор уже существует");
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                Password = request.Password,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = UserRole.User,
                RegistrationDate = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            var adminUser = new User
            {
                Username = "admin",
                Email = "admin@example.com",
                Password = "admin123",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = UserRole.Admin,
                RegistrationDate = DateTime.UtcNow
            };

            _context.Users.Add(adminUser);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                token,
                user = new
                {
                    id = user.Id,
                    username = user.Username,
                    email = user.Email,
                    role = user.Role.ToString(),
                    avatarUrl = user.AvatarUrl
                }
            });
        }
    }

    public class LoginRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    public class RegisterRequest
    {
        public required string Email { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
} 