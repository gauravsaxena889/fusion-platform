using FusionPlatform.Api.Data;
using Microsoft.AspNetCore.Mvc;

namespace FusionPlatform.Api.Products;

[ApiController]
[Route("api/products")]
public class PostProduct : ControllerBase
{
    private readonly AppDbContext _db;

    public PostProduct(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> Create(Product product)
    {
        _db.Products.Add(product);

        await _db.SaveChangesAsync();

        return Created(
            $"api/products/{product.Id}",
            product);
    }
}