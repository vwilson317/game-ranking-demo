using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DataAccess;

namespace API.Util
{
    //this replaces the db storage aspect
    public static class AppState
    {
        private static ConcurrentDictionary<Guid, Match> cd;

        static AppState()
        {
            cd = new ConcurrentDictionary<Guid, Match>();
            var minutes = new int[] { 1, 2, 5, 7, 10, 63, 70, 80, 1500, 1528 };
            var players = new List<Player>
                    {
                        new Player {ScreenName = "broStepUrGameup"},
                        new Player {ScreenName = "Shadou"},
                        new Player {ScreenName = "Saud89"},
                        new Player {ScreenName = "SherlockHomie"},
                        new Player {ScreenName = "Random1"},
                        new Player {ScreenName = "MattyIce"},
                        new Player {ScreenName = "JohnSnow"},
                        new Player {ScreenName = "thatOneGuy"},
                    };

            var defaultMatches = minutes.Select(x =>
                new Match
                {
                    MatchId = Guid.NewGuid(),
                    CreatedAtUtc = DateTime.UtcNow.Subtract(TimeSpan.FromMinutes(x)),
                    Standings = GetRandomStanding(players)
                }).ToList();

            defaultMatches.ForEach(x => cd.TryAdd(x.MatchId.Value, x));
        }

        public static Match Add(Match match)
        {
            match.MatchId = Guid.NewGuid();
            match.CreatedAtUtc = DateTime.UtcNow;
            cd[match.MatchId.Value] = match;

            return match;
        }

        public static async Task<List<Match>> GetAll()
        {
            return await Task.FromResult(cd.Values.ToList());
        }

        private static List<Player> GetRandomStanding(List<Player> players)
        {
            var random = new Random();
            var playerCopy = new List<Player>(players);
            var standings = new List<Player>();

            var numStandings = 3;
            var current = 0;
            while (current < numStandings)
            {
                var randomIndex = random.Next(playerCopy.Count);

                standings.Add(playerCopy[randomIndex]);
                playerCopy.RemoveAt(randomIndex);
                current++;
            }


            return standings;

        }
    }
}
