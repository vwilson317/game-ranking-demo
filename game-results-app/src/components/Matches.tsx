import React from 'react';
import axios from 'axios';

interface IMatch{
  matchId: string
}

export default class MatchesList extends React.Component {
  state = {
    matches: [] as IMatch[]
  }

  componentDidMount() {
    axios.get(`api/matches`)
      .then(res => {
        const matches = res.data;
        this.setState({ matches });
      })
  }

  render() {
    return (
      <ul>
        { this.state.matches.map((match: IMatch) => <li key={match.matchId}>{match.matchId}</li>)}
      </ul>
    )
  }
}