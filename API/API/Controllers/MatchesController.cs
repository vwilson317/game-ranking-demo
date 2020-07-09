using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Hubs;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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
        private readonly IHubContext<MatchHub> _hub;

        public MatchesController(ILogger<MatchesController> logger, IMatchBusinessLogic matchBusinessLogic,
            IHubContext<MatchHub> hub)
        {
            _logger = logger;
            _matchBusinessLogic = matchBusinessLogic;
            _hub = hub;
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
                _hub.Clients.All.SendAsync(MatchHub.MESSAGE);
                return Created(new Uri($"http://localhost:5001/api/matches/{match.MatchId.Value}"), match);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return StatusCode(500, e);
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

        private static List<Player> GetRandomStanding(List<Player> players)
        {
            var random = new Random();
            var playerCopy = new List<Player>(players);
            var standings = new List<Player>();

            var numStandings = 3;
            var current = 0;
            while(current < numStandings)
            {
                var randomIndex = random.Next(playerCopy.Count);

                standings.Add(playerCopy[randomIndex]);
                playerCopy.RemoveAt(randomIndex);
                current++;
            }


            return standings;

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
    }
}
