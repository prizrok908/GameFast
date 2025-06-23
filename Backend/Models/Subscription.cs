using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Subscription : BaseProduct
    {
        public Subscription()
        {
            Type = "Subscription";
        }

        public string? Description { get; set; }

        public int DurationInMonths { get; set; }

        // Доступные длительности подписок в месяцах
        public static readonly int[] AvailableDurations = new[] { 1, 3, 6, 12 };
    }
} 