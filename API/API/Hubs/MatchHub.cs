using System;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace API.Hubs
{
    public class MatchHub : Hub
    {
        public MatchHub()
        { }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
