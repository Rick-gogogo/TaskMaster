using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

public class MyDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseSqlServer("Server=localhost;Database=sqlserver;User Id=SA;Password=Passw0rd;TrustServerCertificate=True;");

        return new AppDbContext(optionsBuilder.Options);
    }
}