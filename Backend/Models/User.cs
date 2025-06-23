using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public enum UserRole
    {
        User,    // Обычный пользователь (может совершать покупки, управлять профилем)
        Admin    // Администратор (полный доступ к системе)
    }

    public class User
    {
        public User()
        {
            CartItems = new List<CartItem>();
            Orders = new List<Order>();
            Purchases = new List<Purchase>();
            Subscriptions = new List<UserSubscription>();
            AvatarUrl = null;
            RegisteredAt = DateTime.UtcNow;
        }

        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Username { get; set; }

        [Required]
        public required string Password { get; set; }

        public string PasswordHash { get; set; }

        [Required]
        [Column(TypeName = "TEXT")]
        public UserRole Role { get; set; } = UserRole.User;

        public string? AvatarUrl { get; set; }

        [Required]
        public DateTime RegisteredAt { get; set; }

        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

        public DateTime? LastLoginDate { get; set; }

        public List<CartItem> CartItems { get; set; }
        public List<Order> Orders { get; set; }
        public List<Purchase> Purchases { get; set; }
        public List<UserSubscription> Subscriptions { get; set; }
    }
} 