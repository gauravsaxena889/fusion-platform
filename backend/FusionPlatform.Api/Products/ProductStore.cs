namespace FusionPlatform.Api.Products;

public static class ProductStore
{
    public static List<Product> Products { get; } =
    [
        new Product { Id = 1, Name = "Laptop", Price = 50000 },
        new Product { Id = 2, Name = "Keyboard", Price = 2000 },
        new Product { Id = 3, Name = "Mouse", Price = 1000 }
    ];
}