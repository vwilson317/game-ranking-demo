using System.Collections.Generic;
using System.Threading.Tasks;
using API.Util;

namespace API.DataAccess
{
    public class MatchRepo : IMatchRepo
    {
        public Match CreateMatch(Match match)
        {
            return AppState.Add(match);
        }

        public async Task<IEnumerable<Match>> GetMatches()
        {
            var matches = await AppState.GetAll();
            return matches;
        }
    }
}
