using System;
using Backend.Models;

namespace Backend.Data.Seeds
{
    public static class SubscriptionSeedData
    {
        public static Subscription[] GetSubscriptions()
        {
            return new Subscription[]
            {
                new Subscription
                {
                    Name = "PlayStation Plus Essential",
                    Price = 9.99M,
                    ImageUrl = "/images/subscriptions/ps-plus-essential.jpg",
                    StockQuantity = 999,
                    Type = "Subscription",
                    Description = "Online multiplayer access and monthly games",
                    DurationInMonths = 1
                },
                new Subscription
                {
                    Name = "PlayStation Plus Extra",
                    Price = 14.99M,
                    ImageUrl = "/images/subscriptions/ps-plus-extra.jpg",
                    StockQuantity = 999,
                    Type = "Subscription",
                    Description = "Essential benefits plus game catalog",
                    DurationInMonths = 1
                },
                new Subscription
                {
                    Name = "PlayStation Plus Premium",
                    Price = 17.99M,
                    ImageUrl = "/images/subscriptions/ps-plus-premium.jpg",
                    StockQuantity = 999,
                    Type = "Subscription",
                    Description = "Extra benefits plus classics and cloud streaming",
                    DurationInMonths = 1
                }
            };
        }
    }
} 