using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class CartItem
    {
        public int Id { get; set; }

        [Required]
        public required string UserId { get; set; }
        public required User User { get; set; }

        [Required]
        public required int ProductId { get; set; }
        public required BaseProduct Product { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
        public int Quantity { get; set; }

        // Длительность подписки в месяцах (только для подписок)
        public int? SubscriptionDuration { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
} 