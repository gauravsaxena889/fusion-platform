using Microsoft.EntityFrameworkCore;
using FusionPlatform.Api.Products;

namespace FusionPlatform.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
}