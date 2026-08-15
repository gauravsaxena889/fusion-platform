using FusionPlatform.Api.Data;
using FusionPlatform.Api.Network;
using Microsoft.AspNetCore.Mvc;

namespace FusionPlatform.Api.System;

[ApiController]
[Route("api/system")]
public class SystemStatus : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly NetworkAgent _networkAgent;

    public SystemStatus(
        AppDbContext db,
        NetworkAgent networkAgent)
    {
        _db = db;
        _networkAgent = networkAgent;
    }

    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        var databaseConnected = await _db.Database.CanConnectAsync();

        return Ok(new
        {
            api = "Connected",
            database = databaseConnected ? "Connected" : "Not Connected",
            networkAgent = _networkAgent.IsListening
                ? "Listening"
                : "Not Connected",
                lastNetworkMessage = _networkAgent.LastReceivedMessage
        });
    }
}