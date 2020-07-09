using System;
using System.Threading.Tasks;
using API.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using API.BusinessLogic;
using API.Dtos;

namespace API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class MatchesController : ControllerBase
    {
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
}
