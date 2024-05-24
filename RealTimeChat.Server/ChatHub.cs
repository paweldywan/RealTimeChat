using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace RealTimeChat.Server
{
    public class ChatHub : Hub
    {
        private static readonly ConcurrentDictionary<string, string> users = new();

        private static readonly ConcurrentDictionary<string, HashSet<string>> rooms = new();

        public Task SendMessage(string user, string message) => Clients.All.SendAsync("ReceiveMessage", user, message);

        public override Task OnConnectedAsync()
        {
            users.TryAdd(Context.ConnectionId, "Online");

            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            users[Context.ConnectionId] = "Offline";

            return base.OnDisconnectedAsync(exception);
        }

        public Task CheckUserStatus(string connectionId)
        {
            _ = users.TryGetValue(connectionId, out string? status);

            return Clients.Caller.SendAsync("ReceiveStatus", status);
        }

        public async Task JoinRoom(string roomName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);

            rooms.TryAdd(roomName, []);

            rooms[roomName].Add(Context.ConnectionId);

            await Clients.Group(roomName).SendAsync("Send", $"{Context.ConnectionId} has joined the room {roomName}");
        }

        public async Task LeaveRoom(string roomName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);

            rooms[roomName].Remove(Context.ConnectionId);

            if (rooms[roomName].Count == 0)
            {
                rooms.TryRemove(roomName, out _);
            }

            await Clients.Group(roomName).SendAsync("Send", $"{Context.ConnectionId} has left the room {roomName}");
        }

        public Task SendMessageToRoom(string roomName, string message) => Clients.Group(roomName).SendAsync("ReceiveMessage", message);

        public Task GetAvailableRooms()
        {
            var availableRooms = rooms.Keys.ToList();

            return Clients.Caller.SendAsync("ReceiveAvailableRooms", availableRooms);
        }
    }

}
