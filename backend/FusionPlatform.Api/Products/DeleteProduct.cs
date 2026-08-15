using Microsoft.AspNetCore.Mvc;

namespace FusionPlatform.Api.Products;

[ApiController]
[Route("api/products")]
public class DeleteProductController : ControllerBase
{
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var product = ProductStore.Products.FirstOrDefault(p => p.Id == id);

        if (product is null)
        {
            return NotFound();
        }

        ProductStore.Products.Remove(product);

        return NoContent();
    }
}