using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using API.DataAccess;
using API.Dtos;

namespace API.BusinessLogic
{
    public class MatchBusinessLogic : IMatchBusinessLogic
    {
        private readonly IMatchRepo _matchRepo;
        private readonly IMapper _mapper;

        public MatchBusinessLogic(IMatchRepo matchRepo, IMapper mapper)
        {
            _matchRepo = matchRepo;
            _mapper = mapper;
        }
        public Match CreateMatch(MatchDto x)
        {
            var entity = _mapper.Map<Match>(x);
            return _matchRepo.CreateMatch(entity);
        }

        public IEnumerable<Match> GetMatch(Guid matchId)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Match>> GetMatches()
        {
            var entites = await _matchRepo.GetMatches();
            return entites.Select(x => _mapper.Map<Match>(x))
                .OrderByDescending(x => x.CreatedAtUtc);
        }

        public IEnumerable<Match> GetMatchesForPlayer(string playerScreen)
        {
            throw new NotImplementedException();
        }
    }
}
