import { Box, Button, Checkbox, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { RootState } from "../../app/store";
import { Customer, CustomerGetType } from "./CustomerCard";
import { customersAsync, selectCustomers } from "./customersSlice";
import NewCustomerForm from "./NewCustomerForm";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { AsyncParser } from "json2csv";

function download(filename: string, text: string) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/csv;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export function Customers() {
  const customers = useAppSelector(selectCustomers);
  const dispatch = useAppDispatch();
  const status = useSelector((state: RootState) => state.customers.status);
  const [search, setSearch] = useState("");
  const [sortByName, setSortByName] = useState(false);

  const handleDownloadCustomers = () => {
    const fields = [
      "firstname",
      "lastname",
      "phone",
      "streetaddress",
      "postcode",
      "city",
    ];
    const opts = { fields };
    const transformOpts = { highWaterMark: 8192 };
    let csv = "";
    const asyncParser = new AsyncParser(opts, transformOpts);

    asyncParser.processor
      .on("data", (chunk) => (csv += chunk.toString()))
      .on("end", () => {
        download("customers.csv", csv);
      })
      .on("error", (err) => console.error(err));
    asyncParser.input.push(JSON.stringify(customers));
    asyncParser.input.push(null);
  };

  useEffect(() => {
    dispatch(customersAsync());
  }, [dispatch]);

  if (status === "fetchingCustomers") {
    return (
      <Box sx={{ position: "absolute", top: "50%", right: "50%" }}>
        <CircularProgress />
      </Box>
    );
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
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Button onClick={handleDownloadCustomers} variant="contained" sx={{ marginRight: 2 }} color={'secondary'}>
            Download Customers CSV
          </Button>
          <NewCustomerForm />
        </Box>
      </Box>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}
      >
        <Checkbox onChange={(event) => setSortByName(!sortByName)} />
        <Typography sx={{ marginRight: 2 }}>Sort by name</Typography>
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
            .sort(
              (
                filteredCustomer1: CustomerGetType,
                filteredCustomer2: CustomerGetType
              ) => {
                if (sortByName) {
                  if (
                    filteredCustomer1.firstname < filteredCustomer2.firstname
                  ) {
                    return -1;
                  } else {
                    return 1;
                  }
                }

                return 0;
              }
            )
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
