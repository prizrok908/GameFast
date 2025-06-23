using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;
using Backend.Data;
using System.Linq;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccessoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AccessoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAccessories()
        {
            var accessories = await _context.Accessories.ToListAsync();
            var result = accessories.Select(accessory => new
            {
                id = accessory.Id,
                name = accessory.Name,
                price = accessory.Price,
                priceDisplay = $"{accessory.Price:N2} BYN",
                imageUrl = accessory.ImageUrl,
                stockQuantity = accessory.StockQuantity
            });
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Accessory>> GetAccessory(int id)
        {
            var accessory = await _context.Accessories.FindAsync(id);

            if (accessory == null)
            {
                return NotFound();
            }

            return accessory;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAccessory(int id, Accessory accessory)
        {
            if (id != accessory.Id)
            {
                return BadRequest();
            }

            _context.Entry(accessory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AccessoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Accessory>> PostAccessory(Accessory accessory)
        {
            _context.Accessories.Add(accessory);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAccessory), new { id = accessory.Id }, accessory);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccessory(int id)
        {
            var accessory = await _context.Accessories.FindAsync(id);
            if (accessory == null)
            {
                return NotFound();
            }

            _context.Accessories.Remove(accessory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AccessoryExists(int id)
        {
            return _context.Accessories.Any(e => e.Id == id);
        }
    }
}