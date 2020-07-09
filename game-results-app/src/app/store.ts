import { configureStore, ThunkAction, Action, compose, applyMiddleware } from '@reduxjs/toolkit';
import appReducer from '../features/appSlice';
import thunk from 'redux-thunk';

export const store = configureStore({
  reducer: {
    app: appReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

