using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class UserSubscription
    {
        public int Id { get; set; }

        [Required]
        public required string UserId { get; set; }
        public required User User { get; set; }

        [Required]
        public required int SubscriptionId { get; set; }
        public required Subscription Subscription { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; }

        public decimal TotalPrice { get; set; }
        public string PriceDisplay { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public void UpdatePriceDisplay()
        {
            PriceDisplay = $"{TotalPrice:F2} BYN";
        }
    }
} 