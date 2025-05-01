using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using server.Models.DTOs;
namespace TaskMaster.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration){
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            //check if already exists
            if(_context.Users.Any(u => u.Username == request.Username)){
                return BadRequest("Username already exists.");
            }
            var user = new User{
                Username = request.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };
           
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok("User registered successfully");
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request){
            //1. find user
            var existingUser = _context.Users.SingleOrDefault(u=>u.Username == request.Username);
            //2. user exsisted
            if(existingUser == null || !BCrypt.Net.BCrypt.Verify(request.Password,existingUser.PasswordHash)){
                return Unauthorized("Invalid username or password");
            }
            

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["jwt:Key"]!);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, existingUser.Username),
                    new Claim("UserId",existingUser.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new {Token = tokenHandler.WriteToken(token)});
        }
}
