using System;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace API.Hubs
{
    public class MatchHub : Hub
    {
        public const string MESSAGE = "NewResultsAvailable";
        public MatchHub()
        { }

        public async Task SendMessage()
        {
            await Clients.All.SendAsync(MESSAGE);
        }
    }
}   
