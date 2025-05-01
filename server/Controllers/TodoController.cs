using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
namespace server.Controllers;

[Route("api/todo")]
[ApiController]
[Authorize]
public class TodoController : ControllerBase
{
    private readonly AppDbContext _context;
    public TodoController(AppDbContext context){
        _context = context;
    }
    [HttpGet]  
    public async Task<IActionResult> GetTodos()
    {
        var userId = int.Parse(User.FindFirstValue("UserId")!);
        var todos = await _context.Todos.Where(t => t.UserId == userId).ToListAsync();
        return Ok(todos);
    }
    [HttpPost]
    public async Task<IActionResult> AddTodo([FromBody] Todo todo)
    {
        var userId = int.Parse(User.FindFirstValue("UserId")!);
        
        todo.UserId = userId;

        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();
        return Ok(todo);

    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTodo(int id, [FromBody] Todo updatedTodo)
    {
        var existingTodo = await _context.Todos.FindAsync(id);
        if(existingTodo == null || existingTodo.UserId != int.Parse(User.FindFirstValue("UserId")!))
        {
            return NotFound("Todo not found or doesn't belong to the user");
        }
        existingTodo.Title = updatedTodo.Title;
        existingTodo.IsDone = updatedTodo.IsDone;

        await _context.SaveChangesAsync();
        return Ok(existingTodo);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodo(int id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if(todo == null || todo.UserId != int.Parse(User.FindFirstValue("UserId")!))
        {
            return NotFound("Todo not found or does not belong to the user");
        }
        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    
}