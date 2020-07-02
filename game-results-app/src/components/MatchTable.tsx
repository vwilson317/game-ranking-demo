import React from 'react';
import axios from 'axios';
import { Table } from 'reactstrap';
import moment from 'moment';

interface IMatch {
  matchId: string,
  createdAtUtc: string,
  standings: IPlayer[]
}

export interface IPlayer{
  screenName: string
}

export default class MatchTable extends React.Component {
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

  getFormattedDate(date: string){
    return moment(date).startOf('hour').format("MMM Do YYYY") + " " + moment(date).fromNow();
  }

  getMatchRows() {
    return(this.state.matches.map(x => {
      return (<tr>
        <td>{this.getFormattedDate(x.createdAtUtc)}</td>
        <td className="text-center">{x.standings[0].screenName}</td>
        <td className="text-center">{x.standings[1].screenName}</td>
        <td className="text-center">{x.standings[2].screenName}</td>
      </tr>)
    })
    )
  }
  render() {
    return (
      <Table className="tablesorter" responsive>
      <thead className="text-primary">
        <tr>
          <th>Date</th>
          <th className="text-center">First place</th>
          <th className="text-center">Second place</th>
          <th className="text-center">Third place</th>
        </tr>
      </thead>
      <tbody>
        {this.getMatchRows()}
      </tbody>
    </Table>
    )
  }
}