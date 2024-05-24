using Microsoft.AspNetCore.SignalR;

namespace RealTimeChat.Server
{
    public class ChatHub : Hub
    {
        public Task SendMessage(string user, string message) => Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}
