using Microsoft.AspNetCore.Mvc;

namespace FusionPlatform.Api.Products;

[ApiController]
[Route("api/products")]
public class PutProductController : ControllerBase
{
    [HttpPut("{id}")]
    public IActionResult Update(int id, Product updatedProduct)
    {
        var product = ProductStore.Products.FirstOrDefault(p => p.Id == id);

        if (product is null)
        {
            return NotFound();
        }

        product.Name = updatedProduct.Name;
        product.Price = updatedProduct.Price;

        return Ok(product);
    }
}