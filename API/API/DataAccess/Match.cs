using System;
using System.Collections.Generic;

namespace API.DataAccess
{
    public class Match
    {
        public Guid? MatchId { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public List<Player> Standings { get; set; }// = new List<Player>();
    }
}
