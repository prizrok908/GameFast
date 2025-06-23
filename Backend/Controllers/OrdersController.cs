using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<OrdersController> _logger;

        public class CreateOrderRequest
        {
            public required string UserId { get; set; }
            public required List<OrderItem> Items { get; set; }
            public decimal TotalAmount { get; set; }
            public required PaymentMethod PaymentMethod { get; set; }
            public required DeliveryMethod DeliveryMethod { get; set; }
            public string? DeliveryAddress { get; set; }
            public string? PickupPoint { get; set; }
            public required string PhoneNumber { get; set; }
            public string? Comment { get; set; }
        }

        public OrdersController(ApplicationDbContext context, ILogger<OrdersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetOrders()
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.User)
                .Select(o => new
                {
                    id = o.Id,
                    userId = o.UserId,
                    username = o.User.Username,
                    orderDate = o.OrderDate,
                    totalAmount = o.TotalAmount,
                    priceDisplay = o.PriceDisplay,
                    paymentMethod = o.PaymentMethod.ToString(),
                    deliveryMethod = o.DeliveryMethod.ToString(),
                    deliveryAddress = o.DeliveryAddress,
                    pickupPoint = o.PickupPoint,
                    phoneNumber = o.PhoneNumber,
                    comment = o.Comment,
                    status = o.Status.ToString(),
                    items = o.OrderItems.Select(oi => new
                    {
                        id = oi.Id,
                        productId = oi.ProductId,
                        productName = oi.Product.Name,
                        quantity = oi.Quantity,
                        price = oi.Price,
                        priceDisplay = $"{oi.Price:N2} BYN",
                        imageUrl = oi.Product.ImageUrl,
                        type = oi.Product.Type
                    })
                })
                .ToListAsync();
        }

        // GET: api/Orders/User/{userId}
        [HttpGet("User/{userId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetUserOrders(string userId)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    id = o.Id,
                    userId = o.UserId,
                    orderDate = o.OrderDate,
                    totalAmount = o.TotalAmount,
                    priceDisplay = o.PriceDisplay,
                    paymentMethod = o.PaymentMethod,
                    deliveryMethod = o.DeliveryMethod,
                    deliveryAddress = o.DeliveryAddress,
                    pickupPoint = o.PickupPoint,
                    phoneNumber = o.PhoneNumber,
                    comment = o.Comment,
                    status = o.Status,
                    items = o.OrderItems.Select(oi => new
                    {
                        id = oi.Id,
                        productId = oi.ProductId,
                        productName = oi.Product.Name,
                        quantity = oi.Quantity,
                        price = oi.Price,
                        priceDisplay = $"{oi.Price:N2} BYN",
                        imageUrl = oi.Product.ImageUrl,
                        type = oi.Product.Type
                    })
                })
                .ToListAsync();
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Select(o => new
                {
                    id = o.Id,
                    userId = o.UserId,
                    orderDate = o.OrderDate,
                    totalAmount = o.TotalAmount,
                    priceDisplay = o.PriceDisplay,
                    paymentMethod = o.PaymentMethod,
                    deliveryMethod = o.DeliveryMethod,
                    deliveryAddress = o.DeliveryAddress,
                    pickupPoint = o.PickupPoint,
                    phoneNumber = o.PhoneNumber,
                    comment = o.Comment,
                    status = o.Status,
                    items = o.OrderItems.Select(oi => new
                    {
                        id = oi.Id,
                        productId = oi.ProductId,
                        productName = oi.Product.Name,
                        quantity = oi.Quantity,
                        price = oi.Price,
                        priceDisplay = $"{oi.Price:N2} BYN"
                    })
                })
                .FirstOrDefaultAsync(o => o.id == id);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        // PUT: api/Orders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, Order order)
        {
            if (id != order.Id)
            {
                return BadRequest();
            }

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // PUT: api/Orders/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatusUpdateRequest request)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound();

            if (!Enum.TryParse<OrderStatus>(request.Status, out var newStatus))
                return BadRequest("Invalid status");

            order.Status = newStatus;
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Order status updated successfully" });
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
} 