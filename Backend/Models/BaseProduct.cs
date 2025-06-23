using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class BaseProduct
    {
        public int Id { get; set; }
        
        [Required]
        public required string Name { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        [Required]
        public required string ImageUrl { get; set; }
        
        public int StockQuantity { get; set; }

        [Required]
        public required string Type { get; set; }

        [NotMapped]
        public string PriceDisplay => $"{Price:F2} BYN";
    }
} 