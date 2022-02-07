import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Customer, CustomerType } from './Customer';
import {
  customersAsync, selectCustomers
} from './customersSlice';

export function Customers() {
  const customers = useAppSelector(selectCustomers);
  const dispatch = useAppDispatch();

  useEffect(() => {dispatch(customersAsync())}, [dispatch])

  return (
    <>
      <h1>Cutomers</h1>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {customers.map((customer: CustomerType) => {
          return (
            <Customer
              key={customer.phone + customer.firstname}
              information={customer}
            />
          );
        })}
      </Box>
    </>
  );
}
