using AutoMapper;
using API.DataAccess;
using API.Dtos;

namespace API.AutoMapper
{
    public class AppProfile : Profile
    {
        public AppProfile()
        {
            CreateMap<Match, MatchDto>().ReverseMap();
            CreateMap<Player, PlayerDto>().ReverseMap();
        }
    }
}
