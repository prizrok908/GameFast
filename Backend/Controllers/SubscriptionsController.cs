using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Data;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubscriptionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public class SubscriptionPurchaseRequest
        {
            public string UserId { get; set; }
            public int SubscriptionId { get; set; }
            public int DurationMonths { get; set; }
        }

        public SubscriptionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Subscriptions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetSubscriptions()
        {
            var subscriptions = await _context.Products
                .Where(p => p.Type == "Subscription")
                .Select(s => new
                {
                    id = s.Id,
                    name = s.Name,
                    price = s.Price,
                    priceDisplay = s.PriceDisplay,
                    imageUrl = s.ImageUrl,
                    stockQuantity = s.StockQuantity
                })
                .ToListAsync();

            return subscriptions;
        }

        // GET: api/Subscriptions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetSubscription(int id)
        {
            var subscription = await _context.Products
                .Where(p => p.Type == "Subscription" && p.Id == id)
                .Select(s => new
                {
                    id = s.Id,
                    name = s.Name,
                    price = s.Price,
                    priceDisplay = s.PriceDisplay,
                    imageUrl = s.ImageUrl,
                    stockQuantity = s.StockQuantity,
                    displayName = s.Name,
                    monthlyPrice = s.Price
                })
                .FirstOrDefaultAsync();

            if (subscription == null)
            {
                return NotFound();
            }

            return subscription;
        }

        // GET: api/Subscriptions/User/5
        [HttpGet("User/{userId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetUserSubscriptions(string userId)
        {
            var userSubscriptions = await _context.UserSubscriptions
                .Include(us => us.Subscription)
                .Where(us => us.UserId == userId)
                .Select(us => new
                {
                    id = us.Id,
                    userId = us.UserId,
                    subscriptionId = us.SubscriptionId,
                    subscriptionName = us.Subscription.Name,
                    startDate = us.StartDate,
                    endDate = us.EndDate,
                    isActive = us.IsActive,
                    totalPrice = us.TotalPrice,
                    priceDisplay = us.PriceDisplay
                })
                .ToListAsync();

            return userSubscriptions;
        }

        // POST: api/Subscriptions/Purchase
        [HttpPost("Purchase")]
        public async Task<ActionResult<UserSubscription>> PurchaseSubscription([FromBody] SubscriptionPurchaseRequest request)
        {
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var subscription = await _context.Products.OfType<Subscription>().FirstOrDefaultAsync(s => s.Id == request.SubscriptionId);
            if (subscription == null)
            {
                return NotFound("Subscription not found");
            }

            // Проверяем, есть ли у пользователя активная подписка такого же типа
            var existingSubscription = await _context.UserSubscriptions
                .Include(us => us.Subscription)
                .Where(us => us.UserId == request.UserId && us.SubscriptionId == request.SubscriptionId && us.IsActive)
                .FirstOrDefaultAsync();

            if (existingSubscription != null)
            {
                // Продлеваем существующую подписку
                existingSubscription.EndDate = existingSubscription.EndDate.AddMonths(request.DurationMonths);
                _context.Entry(existingSubscription).State = EntityState.Modified;
            }
            else
            {
                // Создаем новую подписку
                var userSubscription = new UserSubscription
                {
                    UserId = request.UserId,
                    User = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId),
                    SubscriptionId = request.SubscriptionId,
                    Subscription = subscription,
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddMonths(request.DurationMonths),
                    IsActive = true,
                    TotalPrice = subscription.Price * request.DurationMonths
                };
                userSubscription.UpdatePriceDisplay();

                _context.UserSubscriptions.Add(userSubscription);
            }

            // Создаем запись о покупке
            var purchase = new Purchase
            {
                UserId = request.UserId,
                User = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId),
                ProductId = request.SubscriptionId,
                Product = subscription,
                PurchaseDate = DateTime.UtcNow,
                Price = subscription.Price,
                Quantity = request.DurationMonths
            };

            _context.Purchases.Add(purchase);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubscriptionExists(request.SubscriptionId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        // GET: api/Subscriptions/Active/5
        [HttpGet("Active/{subscriptionId}")]
        public async Task<ActionResult<object>> GetActiveSubscription(int subscriptionId)
        {
            var subscription = await _context.Products
                .FirstOrDefaultAsync(p => p.Type == "Subscription" && p.Id == subscriptionId);

            if (subscription == null)
            {
                return NotFound();
            }

            return new
            {
                id = subscription.Id,
                name = subscription.Name,
                price = subscription.Price,
                priceDisplay = $"{subscription.Price:C2}",
                imageUrl = subscription.ImageUrl,
                stock = subscription.StockQuantity
            };
        }

        // GET: api/Subscriptions/available-durations
        [HttpGet("available-durations")]
        public ActionResult<int[]> GetAvailableDurations()
        {
            return Subscription.AvailableDurations;
        }

        // GET: api/Subscriptions/plans
        [HttpGet("plans")]
        public async Task<IActionResult> GetPlans()
        {
            var subscriptions = await _context.Products
                .Where(p => p.Type == "Subscription")
                .Select(s => new
                {
                    id = s.Id,
                    name = s.Name,
                    price = s.Price,
                    priceDisplay = $"{s.Price:C2}",
                    imageUrl = s.ImageUrl,
                    stock = s.StockQuantity
                })
                .ToListAsync();

            return Ok(subscriptions);
        }

        private bool SubscriptionExists(int id)
        {
            return _context.Products.Any(e => e.Type == "Subscription" && e.Id == id);
        }
    }
} 