using System.Net;
using System.Net.Sockets;
using System.Text;

namespace FusionPlatform.Api.Network;

public class NetworkAgent
{
    private readonly TcpListener _listener;

   public bool IsListening { get; private set; }

public string? LastReceivedMessage { get; private set; }

    public NetworkAgent()
    {
        _listener = new TcpListener(IPAddress.Loopback, 5000);
    }

    public void Start()
    {
        if (IsListening)
            return;

        _listener.Start();
        IsListening = true;

        _ = ListenAsync();
    }

    public void Stop()
    {
        if (!IsListening)
            return;

        _listener.Stop();
        IsListening = false;
    }

    private async Task ListenAsync()
    {
        while (IsListening)
        {
            try
            {
                var client = await _listener.AcceptTcpClientAsync();

                _ = HandleClientAsync(client);
            }
            catch
            {
                if (IsListening)
                    throw;
            }
        }
    }

    private async Task HandleClientAsync(TcpClient client)
    {
        using (client)
        using (var stream = client.GetStream())
        {
            var buffer = new byte[4096];

            var bytesRead = await stream.ReadAsync(buffer);

           if (bytesRead > 0)
{
    var message = Encoding.UTF8.GetString(buffer, 0, bytesRead);

    LastReceivedMessage = message;

    Console.WriteLine(
        $">>> NETWORK MESSAGE RECEIVED: {message} <<<");
}
        }
    }
}