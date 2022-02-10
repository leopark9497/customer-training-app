import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { CustomerGetType } from './CustomerCard';
import { addCustomer, CustomerPostType, deleteCustomer, fetchCustomers } from './customersApi';

export interface CustomersState {
  value: Array<CustomerGetType>;
  status: 'idle' | 'fetchingCustomers' | 'deletingCustomer' | 'addingCustomer';
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

export const deleteCustomerAsync = createAsyncThunk(
  'customers/deleteCustomer',
  async (customerUrl: string) => {
    const response = await deleteCustomer(customerUrl);
    
    return response
  }
);

export const addCustomerAsync = createAsyncThunk(
  'customers/addCustomer',
  async (customerDetails: CustomerPostType) => {
    const response = await addCustomer(customerDetails);
    
    return response
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
        state.status = 'fetchingCustomers';
      })
      .addCase(customersAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        state.value = action.payload;
      })
      .addCase(deleteCustomerAsync.pending, (state) => {
        state.status = 'deletingCustomer';
      })
      .addCase(deleteCustomerAsync.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(addCustomerAsync.pending, (state) => {
        state.status = 'addingCustomer';
      })
      .addCase(addCustomerAsync.fulfilled, (state) => {
        state.status = 'idle';
      });
  },
});

export const { clear } = customersSlice.actions;

export const selectCustomers = (state: RootState) => state.customers.value;


export default customersSlice.reducer;
