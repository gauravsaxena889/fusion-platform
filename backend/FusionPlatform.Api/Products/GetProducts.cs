using FusionPlatform.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FusionPlatform.Api.Products;

[ApiController]
[Route("api/products")]
public class GetProducts : ControllerBase
{
    private readonly AppDbContext _db;

    public GetProducts(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var products = await _db.Products.ToListAsync();

        return Ok(products);
    }
}