using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.DataAccess
{
    public interface IMatchRepo
    {
        Task<IEnumerable<Match>> GetMatches();
        Match CreateMatch(Match match);
    }
}
