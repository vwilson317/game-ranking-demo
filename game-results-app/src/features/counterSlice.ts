import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../app/store';
import { IPlayer, IMatch } from '../components/MatchTable';
import axios from 'axios';
import {
  JsonHubProtocol,
  HubConnectionState,
  HubConnectionBuilder,
  LogLevel
} from '@microsoft/signalr';

interface CounterState {
  value: number;
  selectedPlayer: IPlayer,
  matches: IMatch[],
  connection: any
}

const initialState: CounterState = {
  value: 0,
  selectedPlayer: {screenName: 'Vwilson317'} as IPlayer,
  matches: [] as IMatch[],
  connection: null
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    setMatches: (state, action: PayloadAction<IMatch[]>)  => {
      state.matches = action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount, setMatches } = counterSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const getMatchesAsync = (): AppThunk => dispatch => {
  debugger
  axios.get(`api/matches`)
    .then(res => {
      const matches = res.data;
      dispatch(setMatches(matches));
    })

  // setTimeout(() => {
  //   dispatch(incrementByAmount(amount));
  // }, 1000);
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectScreenName = (state: RootState) => state.counter.selectedPlayer.screenName
export const selectCount = (state: RootState) => state.counter.value;
export const getMatches = (state: RootState) => state.counter.matches;

const isDev = process.env.NODE_ENV === 'development';

const startSignalRConnection = async (connection: any) => {
  try {
    await connection.start();
    console.assert(connection.state === HubConnectionState.Connected);
    console.log('SignalR connection established');
  } catch (err) {
    console.assert(connection.state === HubConnectionState.Disconnected);
    console.error('SignalR Connection Error: ', err);
    setTimeout(() => startSignalRConnection(connection), 5000);
  }
};

// Set up a SignalR connection to the specified hub URL, and actionEventMap.
// actionEventMap should be an object mapping event names, to eventHandlers that will
// be dispatched with the message body.
export const setupSignalRConnection = (connectionHub: any, actionEventMap: any = {}) : AppThunk => dispatch => {
  debugger
  const options = {
    logMessageContent: isDev,
    logger: isDev ? LogLevel.Warning : LogLevel.Error
  };
  // create the connection instance
  // withAutomaticReconnect will automatically try to reconnect
  // and generate a new socket connection if needed
  const connection = new HubConnectionBuilder()
    .withUrl(connectionHub, options)
    .withAutomaticReconnect()
    .withHubProtocol(new JsonHubProtocol())
    .configureLogging(LogLevel.Information)
    .build();

  // Note: to keep the connection open the serverTimeout should be
  // larger than the KeepAlive value that is set on the server
  // keepAliveIntervalInMilliseconds default is 15000 and we are using default
  // serverTimeoutInMilliseconds default is 30000 and we are using 60000 set below
  connection.serverTimeoutInMilliseconds = 60000;

  // re-establish the connection if connection dropped
  connection.onclose(error => {
    console.assert(connection.state === HubConnectionState.Disconnected);
    console.log('Connection closed due to error. Try refreshing this page to restart the connection', error);
  });

  connection.onreconnecting(error => {
    console.assert(connection.state === HubConnectionState.Reconnecting);
    console.log('Connection lost due to error. Reconnecting.', error);
  });

  connection.onreconnected(connectionId => {
    console.assert(connection.state === HubConnectionState.Connected);
    console.log('Connection reestablished. Connected with connectionId', connectionId);
  });
  startSignalRConnection(connection);

  connection.on('OnEvent', res => {
    const eventHandler = actionEventMap[res.eventType];
    eventHandler && dispatch(eventHandler(res));
  });

  return connection;
};

export default counterSlice.reducer;