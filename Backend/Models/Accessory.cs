using System.ComponentModel.DataAnnotations;

namespace Backend.Models;
public class Accessory : BaseProduct
{
    public Accessory()
    {
        Type = "Accessory";
    }
}