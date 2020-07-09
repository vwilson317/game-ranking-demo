import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Table } from 'reactstrap';
import moment from 'moment';

import { useSelector } from 'react-redux';
import { getMatches } from '../features/counterSlice';

export interface IMatch {
  matchId?: string,
  createdAtUtc: string,
  standings: IPlayer[]
}

export interface IPlayer {
  screenName: string
}

const MatchTable = () => {
  //const [matches, setMatches] = useState<IMatch[]>();

  const matches = useSelector(getMatches);
  // useEffect(() => {
  //   matches = getMatchesAsync();
  // }, [matches]);

  const getFormattedDate = (date: string) => {
    return moment(date).startOf('hour').format("MMM Do YYYY") + " " + moment(date).fromNow();
  }

  const getMatchRows = () => {
    if (matches) {
      return (matches.map(x => {
        return (<tr>
          <td>{getFormattedDate(x.createdAtUtc)}</td>
          <td className="text-center">{x.standings[0].screenName}</td>
          <td className="text-center">{x.standings[1].screenName}</td>
          <td className="text-center">{x.standings[2].screenName}</td>
        </tr>)
      }))
    }
  }

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
        {getMatchRows()}
      </tbody>
    </Table>
  )
}

export default MatchTable;