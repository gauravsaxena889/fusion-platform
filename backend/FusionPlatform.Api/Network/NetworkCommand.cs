using System.Net.Sockets;
using System.Text;
using Microsoft.AspNetCore.Mvc;

namespace FusionPlatform.Api.Network;

[ApiController]
[Route("api/network")]
public class NetworkCommand : ControllerBase
{
    [HttpPost("send")]
    public async Task<IActionResult> Send([FromBody] NetworkMessage request)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
            return BadRequest("Message cannot be empty.");

        using var client = new TcpClient();

        await client.ConnectAsync("127.0.0.1", 5000);

        using var stream = client.GetStream();

        var data = Encoding.UTF8.GetBytes(request.Message);

        await stream.WriteAsync(data);

        return Ok(new
        {
            message = request.Message,
            status = "Sent"
        });
    }
}

public class NetworkMessage
{
    public string Message { get; set; } = "";
}