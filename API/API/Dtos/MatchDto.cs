using System;
using System.Collections.Generic;

namespace API.Dtos
{
    public class MatchDto
    {
        public Guid? MatchId { get; set; }
        public DateTime? CreatedAtUtc { get; set; }
        public List<PlayerDto> Standings { get; set; }
    }
}
