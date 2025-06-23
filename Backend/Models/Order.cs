using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public enum PaymentMethod
    {
        Cash,           // Наличными при получении
        Card,           // Оплата картой онлайн
        CardOnDelivery  // Оплата картой при получении
    }

    public enum DeliveryMethod
    {
        Delivery,      // Доставка
        Pickup         // Самовывоз
    }

    public enum OrderStatus
    {
        Pending,       // Ожидает оплаты
        Processing,    // В обработке
        Shipped,       // Отправлен
        Delivered,     // Доставлен
        Completed,     // Завершен
        Cancelled      // Отменен
    }

    public class Order
    {
        public Order()
        {
            OrderItems = new List<OrderItem>();
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public int Id { get; set; }

        [Required]
        public required string UserId { get; set; }
        public required User User { get; set; }

        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string PriceDisplay { get; set; } = string.Empty;
        public PaymentMethod PaymentMethod { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; }

        [Required]
        public required string DeliveryAddress { get; set; }

        [Required]
        public required string PickupPoint { get; set; }

        [Required]
        public required string PhoneNumber { get; set; }

        public string? Comment { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

        public void UpdatePriceDisplay()
        {
            PriceDisplay = $"{TotalAmount:N2} BYN";
        }
    }

    public class OrderItem
    {
        public int Id { get; set; }

        [Required]
        public required int OrderId { get; set; }
        public required Order Order { get; set; }

        [Required]
        public required int ProductId { get; set; }
        public required BaseProduct Product { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public decimal TotalPrice => Price * Quantity;
    }
} 