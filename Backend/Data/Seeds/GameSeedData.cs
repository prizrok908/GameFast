using System;
using Backend.Models;

namespace Backend.Data.Seeds
{
    public static class GameSeedData
    {
        public static List<Game> GetGames()
        {
            return new List<Game>
            {
                new Game
                {
                    Id = 1,
                    Name = "God of War Ragnarök",
                    Price = 79.99m,
                    Type = "Game",
                    ImageUrl = "/images/games/god-of-war.jpg",
                    StockQuantity = 50,
                    Developer = "Santa Monica Studio",
                    Publisher = "Sony Interactive Entertainment"
                },
                new Game
                {
                    Id = 2,
                    Name = "Horizon Forbidden West",
                    Price = 69.99m,
                    Type = "Game",
                    ImageUrl = "/images/games/horizon.jpg",
                    StockQuantity = 30,
                    Developer = "Guerrilla Games",
                    Publisher = "Sony Interactive Entertainment"
                },
                new Game
                {
                    Id = 10,
                    Name = "Marvel's Spider-Man 2",
                    Price = 69.99m,
                    Type = "Game",
                    ImageUrl = "/images/games/spider-man-2.jpg",
                    StockQuantity = 40,
                    Developer = "Insomniac Games",
                    Publisher = "Sony Interactive Entertainment"
                },
                new Game
                {
                    Id = 11,
                    Name = "Final Fantasy XVI",
                    Price = 69.99m,
                    Type = "Game",
                    ImageUrl = "/images/games/ff16.jpg",
                    StockQuantity = 25,
                    Developer = "Square Enix",
                    Publisher = "Square Enix"
                }
            };
        }
    }
} 