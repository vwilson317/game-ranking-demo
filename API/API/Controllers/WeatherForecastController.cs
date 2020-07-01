using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        public Guid MatchId { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public List<Player> Players { get; set; } = new List<Player>();
    }

    [ApiController]
    [Route("[controller]")]
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
        public IActionResult Get()
        {
            var matches = _matchBusinessLogic.GetMatches();
            return Ok(matches);
        }

        [HttpGet]
        public IActionResult Get(Guid matchId)
        {
            var matches = _matchBusinessLogic.GetMatch(matchId);
            return Ok(matches);
        }

        [HttpGet]
        public IActionResult Get(string playerScreen)
        {
            var matches = _matchBusinessLogic.GetMatchesForPlayer(playerScreen);
            return Ok(matches);
        }

        [HttpPost]
        public IActionResult Post(MatchDto matchDto)
        {
            try
            {
                var match = _matchBusinessLogic.CreateMatch(matchDto);
                return Created(new Uri($"api/matches/{match.MatchId}"), match);
            }
            catch(Exception e)
            {
                _logger.LogError(e.Message);
                return StatusCode(500);
            }
        }
    }

    public class MatchDto {

    }


    public interface IMatchBusinessLogic
    {
        IEnumerable<Match> GetMatches();
        Match CreateMatch(MatchDto x);
        IEnumerable<Match> GetMatchesForPlayer(string playerScreen);
        IEnumerable<Match> GetMatch(Guid matchId);
    }
    public class MatchBusinessLogic : IMatchBusinessLogic
    {
        public Match CreateMatch(MatchDto x)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Match> GetMatch(Guid matchId)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Match> GetMatches()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Match> GetMatchesForPlayer(string playerScreen)
        {
            throw new NotImplementedException();
        }
    }

    public interface IMatchRepo
    {
        IEnumerable<Match> GetMatches();
        Match CreateMatch(Match match);
    }
    public class MatchRepo : IMatchRepo
    {
        public Match CreateMatch(Match match)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Match> GetMatches()
        {
            throw new NotImplementedException();
        }
    }
}
