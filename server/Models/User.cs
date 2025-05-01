using System.Numerics;
using Microsoft.AspNetCore.Mvc.ModelBinding;

public class User
{
    public int Id { get; set;}
    public string Username {get; set;} = string.Empty;
    public string PasswordHash {get; set;} = string.Empty;
    public List<Todo> Todos {get; set;} = new();

}