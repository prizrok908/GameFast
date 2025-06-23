using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Models; // Подключаем пространство имен, где находится наш класс Console
using Backend.Data;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsolesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ConsolesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/consoles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetConsoles()
        {
            var consoles = await _context.Consoles.ToListAsync();
            var result = consoles.Select(console => new
            {
                id = console.Id,
                name = console.Name,
                price = console.Price,
                priceDisplay = $"{console.Price:N2} BYN",
                imageUrl = console.ImageUrl,
                stockQuantity = console.StockQuantity
            });
            return Ok(result);
        }

        // GET: api/consoles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GameConsole>> GetConsole(int id)
        {
            var console = await _context.Consoles.FindAsync(id);

            if (console == null)
            {
                return NotFound();
            }

            return console;
        }

        // PUT: api/consoles/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConsole(int id, GameConsole console)
        {
            if (id != console.Id)
            {
                return BadRequest();
            }

            _context.Entry(console).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConsoleExists(id))
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

        // POST: api/consoles
        [HttpPost]
        public async Task<ActionResult<GameConsole>> PostConsole(GameConsole console)
        {
            _context.Consoles.Add(console);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetConsole), new { id = console.Id }, console);
        }

        // DELETE: api/consoles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsole(int id)
        {
            var console = await _context.Consoles.FindAsync(id);
            if (console == null)
            {
                return NotFound();
            }

            _context.Consoles.Remove(console);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ConsoleExists(int id)
        {
            return _context.Consoles.Any(e => e.Id == id);
        }
    }
}