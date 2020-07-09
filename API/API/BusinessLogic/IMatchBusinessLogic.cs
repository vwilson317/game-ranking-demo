using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.DataAccess;
using API.Dtos;

namespace API.BusinessLogic
{
    public interface IMatchBusinessLogic
    {
        Task<IEnumerable<Match>> GetMatches();
        Match CreateMatch(MatchDto x);
        IEnumerable<Match> GetMatchesForPlayer(string playerScreen);
        IEnumerable<Match> GetMatch(Guid matchId);
    }
}
