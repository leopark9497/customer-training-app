import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { style } from "@mui/system";
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import NewTrainingForm from "../trainings/NewTrainingForm";
import { Training, TrainingGetType } from "../trainings/TrainingCard";
import { CustomerPostType } from "./customersApi";
import { fields, FormField } from "./NewCustomerForm";

export function Customer() {
  const [loading, setLoading] = useState<boolean>(true);
  const [details, setDetails] = useState<CustomerPostType>({
    firstname: "",
    lastname: "",
    streetaddress: "",
    postcode: "",
    city: "",
    phone: "",
  });
  const [trainings, setTrainings] = useState<Array<TrainingGetType>>([]);
  const { id } = useParams();

  useState(() => {
    axios
      .get(`https://customerrest.herokuapp.com/api/customers/${id}`)
      .then((response: any) => setDetails(response.data));
    axios
      .get(`https://customerrest.herokuapp.com/api/customers/${id}/trainings`)
      .then((response: any) => {
        if (!response.data.content[0].duration) {
          console.log(response);
          setTrainings([]);
        } else {
          setTrainings(response.data.content);
        }
      });
  });

  return (
    <div>
      <Typography variant="h4" component="h1" sx={{ paddingTop: 5 }}>
        Customer Details (ID: {id})
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <div>
          <Typography
            variant="h5"
            component="h2"
            sx={{ paddingBottom: 5, paddingTop: 5 }}
          >
            Personal information
          </Typography>
          {fields.map((field) => (
            <FormField
              value={details[field.id]}
              key={field.id}
              id={field.id}
              label={field.label}
              hook={(value: string) =>
                setDetails({ ...details, [field.id]: value })
              }
            />
          ))}
        </div>
        <Button
          onClick={async () => {
            axios
              .put(
                `https://customerrest.herokuapp.com/api/customers/${id}`,
                details
              )
              .then((response: any) => console.log(response.data));
          }}
        >
          Update
        </Button>
      </Box>
      <Box>
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
          <Typography
            variant="h5"
            component="h2"
            sx={{ paddingBottom: 5, paddingTop: 5 }}
          >
            Training
          </Typography>
          <NewTrainingForm />
        </Box>
        {!!trainings.length &&
          trainings.map((sortedTraining: TrainingGetType) => {
            return (
              <Training
                key={sortedTraining.date}
                information={sortedTraining}
              />
            );
          })}
          {!trainings.length &&
            <Typography>
                No training was added
            </Typography>
          }
      </Box>
    </div>
  );
}
