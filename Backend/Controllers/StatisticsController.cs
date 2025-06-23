using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StatisticsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Статистика по популярным товарам
        [HttpGet("purchases")]
        public async Task<IActionResult> GetPurchaseStats()
        {
            var stats = await _context.Purchases
                .Include(p => p.Product)
                .GroupBy(p => new { p.ProductId, p.Product.Name })
                .Select(g => new
                {
                    productId = g.Key.ProductId,
                    productName = g.Key.Name,
                    totalQuantity = g.Sum(p => p.Quantity)
                })
                .OrderByDescending(x => x.totalQuantity)
                .ToListAsync();

            return Ok(stats);
        }

        // Статистика по способам оплаты
        [HttpGet("payments")]
        public async Task<IActionResult> GetPaymentStats()
        {
            var stats = await _context.Purchases
                .GroupBy(p => p.PaymentMethod)
                .Select(g => new
                {
                    paymentMethod = g.Key,
                    count = g.Count()
                })
                .ToListAsync();

            return Ok(stats);
        }
    }
} 