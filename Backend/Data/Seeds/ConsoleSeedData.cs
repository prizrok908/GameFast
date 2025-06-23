using System;
using Backend.Models;

namespace Backend.Data.Seeds
{
    public static class ConsoleSeedData
    {
        public static List<GameConsole> GetConsoles()
        {
            return new List<GameConsole>
            {
                new GameConsole
                {
                    Id = 1,
                    Name = "PlayStation 5",
                    Price = 499.99m,
                    Type = "Console",
                    ImageUrl = "/images/consoles/ps5.jpg",
                    StockQuantity = 10
                },
                new GameConsole
                {
                    Id = 2,
                    Name = "PlayStation 5 Digital Edition",
                    Price = 399.99m,
                    Type = "Console",
                    ImageUrl = "/images/consoles/ps5-digital.jpg",
                    StockQuantity = 15
                },
                new GameConsole
                {
                    Id = 3,
                    Name = "PlayStation 4 Pro",
                    Price = 399.99m,
                    Type = "Console",
                    ImageUrl = "/images/consoles/ps4-pro.jpg",
                    StockQuantity = 20
                }
            };
        }
    }
} 