import { configureStore, ThunkAction, Action, compose, applyMiddleware } from '@reduxjs/toolkit';
import counterReducer from '../features/counterSlice';
import thunk from 'redux-thunk';

export const store = configureStore({
  reducer: {
    counter: counterReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

