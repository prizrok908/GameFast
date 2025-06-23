using System;
using Backend.Models;

namespace Backend.Data.Seeds
{
    public static class ProductSeedData
    {
        public static List<BaseProduct> GetProducts()
        {
            var products = new List<BaseProduct>();

            // Add games
            products.Add(new Game
            {
                Id = 1,
                Name = "God of War Ragnarök",
                Price = 79.99m,
                Type = "Game",
                ImageUrl = "/images/games/god-of-war.jpg",
                StockQuantity = 50
            });

            products.Add(new Game
            {
                Id = 2,
                Name = "Horizon Forbidden West",
                Price = 69.99m,
                Type = "Game",
                ImageUrl = "/images/games/horizon.jpg",
                StockQuantity = 30
            });

            // Add consoles
            products.Add(new GameConsole
            {
                Id = 3,
                    Name = "PlayStation 5",
                Price = 499.99m,
                    Type = "Console",
                    ImageUrl = "/images/consoles/ps5.jpg",
                StockQuantity = 10
            });

            products.Add(new GameConsole
            {
                Id = 4,
                    Name = "PlayStation 5 Digital Edition",
                Price = 399.99m,
                    Type = "Console",
                    ImageUrl = "/images/consoles/ps5-digital.jpg",
                    StockQuantity = 15
            });

            // Add accessories
            products.Add(new Accessory
                {
                Id = 5,
                Name = "DualSense Wireless Controller",
                Price = 69.99m,
                    Type = "Accessory",
                    ImageUrl = "/images/accessories/dualsense.jpg",
                StockQuantity = 100
            });

            products.Add(new Accessory
            {
                Id = 6,
                    Name = "PULSE 3D Wireless Headset",
                Price = 99.99m,
                    Type = "Accessory",
                    ImageUrl = "/images/accessories/pulse-3d.jpg",
                StockQuantity = 75
            });

            // Add subscriptions
            products.Add(new Subscription
            {
                Id = 7,
                Name = "PlayStation Plus Essential",
                Price = 9.99m,
                Type = "Subscription",
                ImageUrl = "/images/subscriptions/ps-plus-essential.jpg",
                StockQuantity = 999
            });

            products.Add(new Subscription
            {
                Id = 8,
                Name = "PlayStation Plus Extra",
                Price = 14.99m,
                Type = "Subscription",
                ImageUrl = "/images/subscriptions/ps-plus-extra.jpg",
                StockQuantity = 999
            });

            products.Add(new Subscription
            {
                Id = 9,
                Name = "PlayStation Plus Premium",
                Price = 17.99m,
                Type = "Subscription",
                ImageUrl = "/images/subscriptions/ps-plus-premium.jpg",
                StockQuantity = 999
            });

            return products;
        }
    }
} 