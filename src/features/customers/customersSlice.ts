import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { CustomerType } from './Customer';
import { fetchCustomers } from './customersApi';

export interface CustomersState {
  value: Array<CustomerType>;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CustomersState = {
  value: [],
  status: 'idle',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const customersAsync = createAsyncThunk(
  'customers/fetchCustomers',
  async () => {
    const response = await fetchCustomers();
    
    return response.content
  }
);

export const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clear: (state) => {
        state.value = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(customersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(customersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value = action.payload;
      });
  },
});

export const { clear } = customersSlice.actions;

export const selectCustomers = (state: RootState) => state.customers.value;


export default customersSlice.reducer;
