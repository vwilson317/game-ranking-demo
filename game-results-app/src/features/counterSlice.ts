import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../app/store';
import { IPlayer, IMatch } from '../components/MatchTable';
import axios from 'axios';

interface CounterState {
  selectedPlayer: IPlayer,
  matches: IMatch[],
}

const initialState: CounterState = {
  selectedPlayer: {screenName: 'broStepUrGameup'} as IPlayer,
  matches: [] as IMatch[],
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setMatches: (state, action: PayloadAction<IMatch[]>)  => {
      state.matches = action.payload;
    },
    setSelectedPlayer: (state, action: PayloadAction<IPlayer>)  => {
      state.selectedPlayer = action.payload;
    }
  },
});

export const { setMatches, setSelectedPlayer } = counterSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectScreenName = (state: RootState) => state.counter !== undefined ? state.counter.selectedPlayer.screenName : undefined;
export const getMatches = (state: RootState) => state.counter.matches;

export default counterSlice.reducer;