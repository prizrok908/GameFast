using System.ComponentModel.DataAnnotations;

namespace Backend.Models;
public class Game : BaseProduct
{
    public Game()
    {
        Type = "Game";
    }

    public string? Developer { get; set; }
    public string? Publisher { get; set; }
}