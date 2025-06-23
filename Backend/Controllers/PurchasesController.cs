using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PurchasesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PurchasesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/purchases
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUserPurchases()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var purchases = await _context.Purchases
                .Include(p => p.Product)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.PurchaseDate)
                .Select(p => new
                {
                    id = p.Id,
                    userId = p.UserId,
                    productId = p.ProductId,
                    productName = p.Product.Name,
                    price = p.Price,
                    priceDisplay = $"{p.Price:N2} BYN",
                    imageUrl = p.Product.ImageUrl,
                    quantity = p.Quantity,
                    purchaseDate = p.PurchaseDate,
                    productType = p.Product.Type,
                    paymentMethod = p.PaymentMethod.ToString(),
                    deliveryMethod = p.DeliveryMethod.ToString(),
                    deliveryAddress = p.DeliveryAddress,
                    pickupPoint = p.PickupPoint
                })
                .ToListAsync();

            return purchases;
        }

        // GET: api/Purchases/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetPurchase(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var purchase = await _context.Purchases
                .Include(p => p.Product)
                .Where(p => p.Id == id && p.UserId == userId)
                .Select(p => new
                {
                    id = p.Id,
                    userId = p.UserId,
                    productId = p.ProductId,
                    productName = p.Product.Name,
                    price = p.Price,
                    priceDisplay = $"{p.Price:N2} BYN",
                    imageUrl = p.Product.ImageUrl,
                    quantity = p.Quantity,
                    purchaseDate = p.PurchaseDate,
                    productType = p.Product.Type
                })
                .FirstOrDefaultAsync();

            if (purchase == null)
            {
                return NotFound();
            }

            return purchase;
        }
    }
} 