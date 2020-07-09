import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Table } from 'reactstrap';
import moment from 'moment';

import { useSelector, useDispatch } from 'react-redux';
import { setSelectedPlayer, getMatches } from '../features/counterSlice';
import { useHistory } from 'react-router';

export interface IMatch {
  matchId?: string,
  createdAtUtc: string,
  standings: IPlayer[]
}

export interface IPlayer {
  screenName: string
}

const MatchTable = (props: any) => {
  let matches = useSelector(getMatches);
  const dispatch = useDispatch();
  const history = useHistory();
  const screenName = props.screenName;

  const getFormattedDate = (date: string) => {
    return moment(date).startOf('hour').format("MMM Do YYYY") + " " + moment(date).fromNow();
  }

  const rowClick = (screenName: string) => {
    history.push('/user-matches/' + screenName)
    dispatch(setSelectedPlayer({screenName: screenName}));
  }

  const getMatchRows = () => {
    if(screenName){
      //todo: move to server side
      matches = matches.filter(x => x.standings.map(x=> x.screenName).includes(screenName));
    }
    if (matches) {
      return (matches.map(x => {
        return (
          <tr >
            <td>{getFormattedDate(x.createdAtUtc)}</td>
            {getScreenName(x)}
          </tr>
        )
      }
      ))
    }
  }

  const rowStyle = {
    cursor: 'pointer'
  }

  const getScreenName = (match: IMatch): any => {
    return (match.standings.map((x, index) => { 
      if(index < 3) {
        return <td onClick={() => rowClick(x.screenName)} className="text-center" style={rowStyle}>{x.screenName}</td>
      }
    }))
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