using System;
using Backend.Models;

namespace Backend.Data.Seeds
{
    public static class AccessorySeedData
    {
        public static List<Accessory> GetAccessories()
        {
            return new List<Accessory>
            {
                new Accessory
                {
                    Id = 1,
                    Name = "DualSense Wireless Controller",
                    Price = 69.99m,
                    Type = "Accessory",
                    ImageUrl = "/images/accessories/dualsense.jpg",
                    StockQuantity = 100
                },
                new Accessory
                {
                    Id = 2,
                    Name = "PULSE 3D Wireless Headset",
                    Price = 99.99m,
                    Type = "Accessory",
                    ImageUrl = "/images/accessories/pulse-3d.jpg",
                    StockQuantity = 75
                },
                new Accessory
                {
                    Id = 3,
                    Name = "DualSense Charging Station",
                    Price = 29.99m,
                    Type = "Accessory",
                    ImageUrl = "/images/accessories/charging-station.jpg",
                    StockQuantity = 50
                },
                new Accessory
                {
                    Id = 4,
                    Name = "HD Camera",
                    Price = 59.99m,
                    Type = "Accessory",
                    ImageUrl = "/images/accessories/hd-camera.jpg",
                    StockQuantity = 40
                },
                new Accessory
                {
                    Id = 5,
                    Name = "Media Remote",
                    Price = 29.99m,
                    Type = "Accessory",
                    ImageUrl = "/images/accessories/media-remote.jpg",
                    StockQuantity = 60
                }
            };
        }
    }
} 