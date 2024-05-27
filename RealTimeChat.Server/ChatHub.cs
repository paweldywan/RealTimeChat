using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace RealTimeChat.Server
{
    public class ChatHub : Hub
    {
        private static readonly ConcurrentDictionary<string, HashSet<string>> rooms = new();

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var currentGroup = rooms.FirstOrDefault(x => x.Value.Contains(Context.ConnectionId)).Key;

            await LeaveRoom(currentGroup);

            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinRoom(string roomName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);

            var added = rooms.TryAdd(roomName, []);

            if (added)
            {
                await Clients.All.SendAsync("ReceiveNewRoom", roomName);
            }

            _ = rooms[roomName].Add(Context.ConnectionId);

            await Clients.Group(roomName).SendAsync("ReceiveNewUser", Context.ConnectionId);

            await Clients.Group(roomName).SendAsync("Send", $"{Context.ConnectionId} has joined the room {roomName}");
        }

        public async Task LeaveRoom(string roomName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);

            rooms[roomName].Remove(Context.ConnectionId);

            await Clients.Group(roomName).SendAsync("ReceiveUserLeft", Context.ConnectionId);

            if (rooms[roomName].Count == 0)
            {
                var removed = rooms.TryRemove(roomName, out _);

                if (removed)
                {
                    await Clients.All.SendAsync("ReceiveRemovedRoom", roomName);
                }
            }

            await Clients.Group(roomName).SendAsync("Send", $"{Context.ConnectionId} has left the room {roomName}");
        }

        public Task SendMessageToRoom(string roomName, string user, string message) => Clients.Group(roomName).SendAsync("ReceiveMessage", user, message);

        public Task GetAvailableRooms()
        {
            var availableRooms = rooms.Keys.ToList();

            return Clients.Caller.SendAsync("ReceiveAvailableRooms", availableRooms);
        }

        public Task GetUsersInRoom(string roomName)
        {
            var usersInRoom = rooms[roomName].ToList();

            return Clients.Caller.SendAsync("ReceiveUsersInRoom", usersInRoom);
        }
    }
}
