using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    public class Player
    {
        public string ScreenName { get; set; }
    }
    public class Match
    {
        public Guid? MatchId { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public List<Player> Standings { get; set; }// = new List<Player>();
    }

    [ApiController]
    [Route("api/[controller]")]
    public class MatchesController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<MatchesController> _logger;
        private readonly IMatchBusinessLogic _matchBusinessLogic;

        public MatchesController(ILogger<MatchesController> logger, IMatchBusinessLogic matchBusinessLogic)
        {
            _logger = logger;
            _matchBusinessLogic = matchBusinessLogic;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var matches = await _matchBusinessLogic.GetMatches();
            return Ok(matches);
        }

        [HttpGet]
        [Route("{matchId}")]
        public IActionResult Get(Guid matchId)
        {
            var matches = _matchBusinessLogic.GetMatch(matchId);
            return Ok(matches);
        }

        [HttpGet]
        [Route("{playerScreen}")]
        public IActionResult Get(string playerScreen)
        {
            var matches = _matchBusinessLogic.GetMatchesForPlayer(playerScreen);
            return Ok(matches);
        }

        [HttpPost]
        public IActionResult Post([FromBody]MatchDto matchDto)
        {
            try
            {
                var match = _matchBusinessLogic.CreateMatch(matchDto);
                return Created(new Uri($"api/matches/{match.MatchId}"), match);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return StatusCode(500);
            }
        }
    }

    public class MatchDto
    {
        public Guid? MatchId { get; set; }
        public DateTime? CreatedAtUtc { get; set; }
        public List<Player> Standings { get; set; }
    }


    public interface IMatchBusinessLogic
    {
        Task<IEnumerable<Match>> GetMatches();
        Match CreateMatch(MatchDto x);
        IEnumerable<Match> GetMatchesForPlayer(string playerScreen);
        IEnumerable<Match> GetMatch(Guid matchId);
    }
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

    public interface IMatchRepo
    {
        Task<IEnumerable<Match>> GetMatches();
        Match CreateMatch(Match match);
    }
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

    public class AppProfile : Profile
    {
        public AppProfile()
        {
            CreateMap<Match, MatchDto>().ReverseMap();
        }
    }

    //this replaces the db storage aspect
    public static class AppState
    {
        // The higher the concurrencyLevel, the higher the theoretical number of operations
        // that could be performed concurrently on the ConcurrentDictionary.  However, global
        // operations like resizing the dictionary take longer as the concurrencyLevel rises.
        // For the purposes of this example, we'll compromise at numCores * 2.
        private static int numProcs = Environment.ProcessorCount;
        private static int concurrencyLevel = numProcs * 2;

        // Construct the dictionary with the desired concurrencyLevel and initialCapacity
        private static ConcurrentDictionary<Guid, Match> cd;

        static AppState()
        {
            cd = new ConcurrentDictionary<Guid, Match>();
            var minutes = new int[] { 1, 2, 5, 7, 10, 63, 70, 80, 1500, 1528 };
            var defaultMatches = minutes.Select(x =>
                new Match
                {
                    MatchId = Guid.NewGuid(),
                    CreatedAtUtc = DateTime.UtcNow.Subtract(TimeSpan.FromMinutes(x)),
                    Standings = new List<Player>
                    {
                        new Player {ScreenName = "broStepUrGameup"},
                        new Player {ScreenName = "Shadou"},
                        new Player {ScreenName = "Saud89"},
                        new Player {ScreenName = "SherlockHomie"},
                    }
                }).ToList();

            defaultMatches.ForEach(x => cd.TryAdd(x.MatchId.Value, x));
        }

        public static Match Add(Match match)
        {
            match.MatchId = Guid.NewGuid();
            match.CreatedAtUtc = DateTime.UtcNow; //todo: possibly remove this
            cd[match.MatchId.Value] = match;

            return match;
        }

        public static async Task<List<Match>> GetAll()
        {
            return await Task.FromResult(cd.Values.ToList());
        }
    }
}
