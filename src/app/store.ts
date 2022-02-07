import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import customerReducer from '../features/customers/customersSlice';

export const store = configureStore({
  reducer: {
    customers: customerReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
