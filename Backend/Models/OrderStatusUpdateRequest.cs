using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class OrderStatusUpdateRequest
    {
        [Required]
        public string Status { get; set; }
    }
} 