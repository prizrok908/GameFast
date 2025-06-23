using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Purchase
    {
        public int Id { get; set; }

        [Required]
        public required string UserId { get; set; }
        public required User User { get; set; }

        [Required]
        public required int ProductId { get; set; }
        public required BaseProduct Product { get; set; }

        [Required]
        public DateTime PurchaseDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public PaymentMethod PaymentMethod { get; set; }

        [Required]
        public DeliveryMethod DeliveryMethod { get; set; }

        public string? DeliveryAddress { get; set; }
        public string? PickupPoint { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
} 