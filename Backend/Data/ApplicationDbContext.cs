using Microsoft.EntityFrameworkCore;
using Backend.Models; // Подключаем пространство имен, где находятся модели
using System.IO;

namespace Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<BaseProduct> Products { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<GameConsole> Consoles { get; set; }
        public DbSet<Accessory> Accessories { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<UserSubscription> UserSubscriptions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<BaseProduct>()
                .HasIndex(p => p.Name);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            // Конфигурация для decimal полей
            modelBuilder.Entity<BaseProduct>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)");

            // Настройка наследования
            modelBuilder.Entity<BaseProduct>(entity =>
            {
                entity.HasDiscriminator<string>("Type")
                    .HasValue<Game>("Game")
                    .HasValue<GameConsole>("Console")
                    .HasValue<Accessory>("Accessory")
                    .HasValue<Subscription>("Subscription");

                // Игнорируем все дополнительные свойства
                entity.Ignore(p => ((Game)p).Developer);
                entity.Ignore(p => ((Game)p).Publisher);
                entity.Ignore(p => ((Subscription)p).Description);
            });

            // Настройка связи между Order и OrderItem
            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderItems)
                .WithOne(i => i.Order)
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Настройка связи между User и Order
            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Настройка связи между User и CartItem
            modelBuilder.Entity<CartItem>()
                .HasOne(c => c.User)
                .WithMany(u => u.CartItems)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Настройка связи между User и Purchase
            modelBuilder.Entity<Purchase>()
                .HasOne(p => p.User)
                .WithMany(u => u.Purchases)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Настройка связи между User и UserSubscription
            modelBuilder.Entity<UserSubscription>()
                .HasOne(us => us.User)
                .WithMany(u => u.Subscriptions)
                .HasForeignKey(us => us.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var dbPath = Path.Combine(Directory.GetCurrentDirectory(), "database.sqlite");
                optionsBuilder.UseSqlite($"Data Source={dbPath}");
            }
        }
    }
}