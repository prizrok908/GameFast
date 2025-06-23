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
using Microsoft.Extensions.Logging;

namespace Backend.Controllers
{
    public class AddToCartRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public int? SubscriptionDuration { get; set; }
    }

    public class UpdateCartItemRequest
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public int? SubscriptionDuration { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CartController> _logger;

        public CartController(ApplicationDbContext context, ILogger<CartController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/cart
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUserCart()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var cartItems = await _context.CartItems
                .Include(ci => ci.Product)
                .Where(ci => ci.UserId == userId)
                .Select(ci => new
                {
                    id = ci.Id,
                    userId = ci.UserId,
                    productId = ci.ProductId,
                    productName = ci.Product.Name,
                    price = ci.Product.Price,
                    priceDisplay = $"{ci.Product.Price:N2} BYN",
                    imageUrl = ci.Product.ImageUrl,
                    quantity = ci.Quantity,
                    type = ci.Product.Type,
                    subscriptionDuration = ci.SubscriptionDuration
                })
                .ToListAsync();

            return cartItems;
        }

        // GET: api/Cart/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CartItem>> GetCartItem(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var cartItem = await _context.CartItems
                .Include(ci => ci.Product)
                .FirstOrDefaultAsync(ci => ci.Id == id && ci.UserId == userId);

            if (cartItem == null)
            {
                return NotFound();
            }

            return cartItem;
        }

        // POST: api/Cart
        [HttpPost]
        public async Task<ActionResult<CartItem>> AddToCart(AddToCartRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            if (request.Quantity <= 0)
            {
                return BadRequest("Quantity must be greater than 0");
            }

            // Находим пользователя
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return NotFound($"User with ID {userId} not found");
            }

            // Находим продукт
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId);
            if (product == null)
            {
                Console.WriteLine($"Product not found: {request.ProductId}");
                return NotFound($"Product with ID {request.ProductId} not found");
            }

            // Проверяем наличие достаточного количества товара
            if (product.StockQuantity < request.Quantity)
            {
                return BadRequest($"Недостаточно товара на складе. Доступно: {product.StockQuantity}");
            }

            // Проверяем, есть ли уже такой товар в корзине
            var existingItem = await _context.CartItems
                .Include(ci => ci.User)
                .Include(ci => ci.Product)
                .FirstOrDefaultAsync(ci => 
                    ci.UserId == userId && 
                    ci.ProductId == request.ProductId &&
                    (product.Type != "Subscription" || ci.SubscriptionDuration == request.SubscriptionDuration)); // Для подписок учитываем длительность

            if (existingItem != null)
            {
                Console.WriteLine($"Updating existing cart item: {existingItem.Id}");
                // Проверяем, не превышает ли новое количество доступное количество на складе
                if (product.StockQuantity < existingItem.Quantity + request.Quantity)
                {
                    return BadRequest($"Недостаточно товара на складе. Доступно: {product.StockQuantity}");
                }
                // Если товар уже есть в корзине, увеличиваем количество
                existingItem.Quantity += request.Quantity;
                existingItem.UpdatedAt = DateTime.UtcNow;
                _context.Entry(existingItem).State = EntityState.Modified;
            }
            else
            {
                Console.WriteLine("Adding new cart item");
                // Если товара нет в корзине, добавляем новый
                var cartItem = new CartItem
                {
                    UserId = userId,
                    User = user,
                    ProductId = request.ProductId,
                    Product = product,
                    Quantity = request.Quantity,
                    SubscriptionDuration = request.SubscriptionDuration,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.CartItems.Add(cartItem);
            }

            try 
            {
                await _context.SaveChangesAsync();
                Console.WriteLine("Cart updated successfully");
                return Ok(new { message = "Item added to cart successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving cart: {ex.Message}");
                return BadRequest($"Error saving cart: {ex.Message}");
            }
        }

        // PUT: api/Cart/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCartItem(int id, [FromBody] UpdateCartItemRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                if (id != request.Id)
                {
                    return BadRequest("ID не совпадает");
                }

                if (userId != request.UserId)
                {
                    return BadRequest("Пользователь не имеет доступа к этому элементу корзины");
                }

                if (request.Quantity <= 0)
                {
                    return BadRequest("Количество должно быть больше 0");
                }

                var existingItem = await _context.CartItems
                    .Include(ci => ci.Product)
                    .FirstOrDefaultAsync(ci => ci.Id == id && ci.UserId == userId);

                if (existingItem == null)
                {
                    return NotFound("Элемент корзины не найден");
                }

                // Проверяем наличие товара на складе
                if (existingItem.Product.StockQuantity < request.Quantity)
                {
                    return BadRequest($"Недостаточно товара на складе. Доступно: {existingItem.Product.StockQuantity}");
                }

                // Обновляем только количество и время обновления
                existingItem.Quantity = request.Quantity;
                existingItem.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Возвращаем обновленные данные
                return Ok(new
                {
                    id = existingItem.Id,
                    userId = existingItem.UserId,
                    productId = existingItem.ProductId,
                    productName = existingItem.Product.Name,
                    price = existingItem.Product.Price,
                    priceDisplay = $"{existingItem.Product.Price:N2} BYN",
                    imageUrl = existingItem.Product.ImageUrl,
                    quantity = existingItem.Quantity,
                    type = existingItem.Product.Type,
                    subscriptionDuration = existingItem.SubscriptionDuration,
                    updatedAt = existingItem.UpdatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при обновлении количества товара в корзине");
                return StatusCode(500, new { message = "Внутренняя ошибка сервера при обновлении корзины" });
            }
        }

        // DELETE: api/Cart/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCartItem(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var cartItem = await _context.CartItems.FirstOrDefaultAsync(ci => ci.Id == id && ci.UserId == userId);
            if (cartItem == null)
            {
                return NotFound();
            }

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        public class CheckoutRequest
        {
            public string? UserId { get; set; }
            public required string PaymentMethod { get; set; }
            public required string DeliveryMethod { get; set; }
            public string? DeliveryAddress { get; set; }
            public string? PickupPoint { get; set; }
            public required string PhoneNumber { get; set; }
            public string? Comment { get; set; }
            public List<int> SelectedItems { get; set; } = new List<int>();
        }

        // POST: api/Cart/Checkout
        [HttpPost("Checkout")]
        public async Task<ActionResult<Order>> Checkout([FromBody] CheckoutRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            request.UserId = userId;

            // Получаем только выбранные товары из корзины
            var selectedCartItems = await _context.CartItems
                .Include(ci => ci.Product)
                .Where(ci => ci.UserId == userId && request.SelectedItems.Contains(ci.Id))
                .ToListAsync();

            if (!selectedCartItems.Any())
            {
                return BadRequest("Не выбраны товары для оформления");
            }

            try
            {
                // Создаем новый заказ
                var order = new Order
                {
                    UserId = userId,
                    User = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId),
                    OrderDate = DateTime.UtcNow,
                    TotalAmount = selectedCartItems.Sum(ci => ci.Product.Price * ci.Quantity),
                    PaymentMethod = Enum.Parse<PaymentMethod>(request.PaymentMethod),
                    DeliveryMethod = Enum.Parse<DeliveryMethod>(request.DeliveryMethod),
                    DeliveryAddress = request.DeliveryAddress ?? string.Empty,
                    PickupPoint = request.PickupPoint ?? string.Empty,
                    PhoneNumber = request.PhoneNumber,
                    Comment = request.Comment ?? string.Empty,
                    Status = OrderStatus.Pending,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                order.UpdatePriceDisplay();

                _context.Orders.Add(order);

                // Создаем элементы заказа и записи о покупках только для выбранных товаров
                foreach (var cartItem in selectedCartItems)
                {
                    // Уменьшаем количество товара на складе
                    cartItem.Product.StockQuantity -= cartItem.Quantity;
                    if (cartItem.Product.StockQuantity < 0)
                        cartItem.Product.StockQuantity = 0;
                    _context.Products.Update(cartItem.Product);

                    // Создаем запись о покупке
                    var purchase = new Purchase
                    {
                        UserId = userId,
                        User = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId),
                        ProductId = cartItem.ProductId,
                        Product = cartItem.Product,
                        PurchaseDate = DateTime.UtcNow,
                        Price = cartItem.Product.Price,
                        Quantity = cartItem.Quantity,
                        PaymentMethod = order.PaymentMethod,
                        DeliveryMethod = order.DeliveryMethod,
                        DeliveryAddress = order.DeliveryAddress,
                        PickupPoint = order.PickupPoint,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    _context.Purchases.Add(purchase);

                    // Если это подписка, создаем запись UserSubscription
                    if (cartItem.Product.Type == "Subscription")
                    {
                        var subscription = new UserSubscription
                        {
                            UserId = userId,
                            User = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId),
                            SubscriptionId = cartItem.ProductId,
                            Subscription = (Subscription)cartItem.Product,
                            StartDate = DateTime.UtcNow,
                            EndDate = DateTime.UtcNow.AddMonths(cartItem.SubscriptionDuration ?? 1),
                            IsActive = true,
                            TotalPrice = cartItem.Product.Price * cartItem.Quantity
                        };
                        subscription.UpdatePriceDisplay();

                        _context.UserSubscriptions.Add(subscription);
                    }
                }

                // Удаляем только выбранные товары из корзины
                _context.CartItems.RemoveRange(selectedCartItems);

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    id = order.Id,
                    totalAmount = order.TotalAmount,
                    priceDisplay = order.PriceDisplay,
                    status = order.Status,
                    paymentMethod = order.PaymentMethod,
                    deliveryMethod = order.DeliveryMethod,
                    deliveryAddress = order.DeliveryAddress,
                    pickupPoint = order.PickupPoint
                });
            }
            catch (Exception ex)
            {
                return BadRequest($"Ошибка при оформлении заказа: {ex.Message}");
            }
        }

        private bool CartItemExists(int id)
        {
            return _context.CartItems.Any(e => e.Id == id);
        }
    }
} 