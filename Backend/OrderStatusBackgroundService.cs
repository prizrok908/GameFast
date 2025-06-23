using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Microsoft.Extensions.Logging;

public class OrderStatusBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly TimeSpan _interval = TimeSpan.FromMinutes(1);
    private readonly ILogger<OrderStatusBackgroundService> _logger;

    public OrderStatusBackgroundService(IServiceProvider serviceProvider, ILogger<OrderStatusBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("OrderStatusBackgroundService запущен");
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    var now = DateTime.UtcNow;

                    var orders = await db.Orders
                        .Where(o => o.Status == OrderStatus.Pending || o.Status == OrderStatus.Processing || o.Status == OrderStatus.Shipped)
                        .ToListAsync();

                    _logger.LogInformation($"Найдено {orders.Count} заказов для проверки");

                    foreach (var order in orders)
                    {
                        var minutes = (now - order.UpdatedAt).TotalMinutes;
                        if (minutes >= 5)
                        {
                            var oldStatus = order.Status;
                            switch (order.Status)
                            {
                                case OrderStatus.Pending:
                                    order.Status = OrderStatus.Processing;
                                    break;
                                case OrderStatus.Processing:
                                    order.Status = OrderStatus.Shipped;
                                    break;
                                case OrderStatus.Shipped:
                                    order.Status = OrderStatus.Completed;
                                    break;
                            }
                            order.UpdatedAt = now;
                            _logger.LogInformation($"Заказ {order.Id}: статус изменён с {oldStatus} на {order.Status}");
                        }
                    }

                    await db.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при обновлении статусов заказов");
            }

            _logger.LogInformation($"OrderStatusBackgroundService: следующая проверка через {_interval.TotalMinutes} минут");
            await Task.Delay(_interval, stoppingToken);
        }
    }
} 