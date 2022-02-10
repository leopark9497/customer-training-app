import { Box, Checkbox, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { RootState } from '../../app/store';
import { Customer, CustomerGetType } from './CustomerCard';
import {
  customersAsync, selectCustomers
} from './customersSlice';
import NewCustomerForm from './NewCustomerForm';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

export function Customers() {
  const customers = useAppSelector(selectCustomers);
  const dispatch = useAppDispatch();
  const status = useSelector((state: RootState) => state.customers.status)
  const [search, setSearch] = useState('');
  const [sortByName, setSortByName] = useState(false)


  useEffect(() => {dispatch(customersAsync())}, [dispatch]);

  if (status === 'fetchingCustomers') {
    return (
      <Box sx={{ position: 'absolute', top: '50%', right: '50%' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 2,
          marginTop: 2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <h1>Cutomers</h1>
        <NewCustomerForm />
      </Box>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}
      >
        <Checkbox onChange={event => setSortByName(!sortByName)}/>
        <Typography sx={{ marginRight: 2 }} >Sort by name</Typography>
        <PersonSearchIcon sx={{ marginRight: 1 }} color="primary" />
        <TextField
          sx={{ marginBottom: 2 }}
          id="search"
          label="Search by name"
          variant="standard"
          onChange={(event) => {
            setSearch(event.target.value);
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {customers.length !== 0 &&
          customers
            ?.filter((customer: CustomerGetType) => {
              if (search) {
                const containLastname = customer.lastname
                  .toLowerCase()
                  .trim()
                  .includes(search.toLowerCase().trim());

                const containFirstname = customer.firstname
                  .toLowerCase()
                  .trim()
                  .includes(search.toLowerCase().trim());

                return containLastname || containFirstname;
              }

              return true;
            })
            .sort((filteredCustomer1: CustomerGetType, filteredCustomer2: CustomerGetType) => {
              if (sortByName) {
                if (filteredCustomer1.firstname < filteredCustomer2.firstname) {
                  return -1;
                } else {
                  return 1
                }
              }

              return 0
            })
            .map((sortedCustomer: CustomerGetType) => {

              return (
                <Customer
                  key={sortedCustomer.phone + sortedCustomer.firstname}
                  information={sortedCustomer}
                />
              );
            })}
      </Box>
    </>
  );
}
