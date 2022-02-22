import { Box, Typography, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import _ from "lodash";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../app/store";
import { TrainingsCalendar } from "../trainings/Calendar";
import Chart, { ActivityDuration } from "../trainings/Chart";
import NewTrainingForm from "../trainings/NewTrainingForm";
import { Training, TrainingGetType } from "../trainings/TrainingCard";
import { CustomerPostType } from "./customersApi";
import { fields, FormField } from "./NewCustomerForm";

export function Customer() {
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
  const status = useSelector((state: RootState) => state.trainings.status);
  const [graphData, setGraphData] = useState<Array<ActivityDuration>>([]);
  const [width, setWidth] = useState(800);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWidth(ref.current ? ref.current.offsetWidth : 900);
  }, [ref]);

  useEffect(() => {
    const data = _.chain(trainings)
      .groupBy("activity")
      .map((value, key) => ({
        activity: key,
        duration:
          value.length >= 2
            ? value.reduce((accumulator, curValue) => {
                return accumulator + curValue.duration;
              }, 0)
            : value[0].duration,
      }))
      .value();

    setGraphData(data);
  }, [trainings]);

  useEffect(() => {
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
  }, [status]);

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
            Trainings
          </Typography>
          <NewTrainingForm />
        </Box>
        <Box
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {!!trainings.length &&
            trainings.map((sortedTraining: TrainingGetType) => {
              return (
                <Training
                  key={sortedTraining.date}
                  information={sortedTraining}
                />
              );
            })}
          {!trainings.length && <Typography>No training was added</Typography>}
        </Box>
        <Typography
          variant="h5"
          component="h2"
          sx={{ paddingBottom: 5, paddingTop: 5 }}
        >
          Calendar
        </Typography>
        <TrainingsCalendar
          events={trainings.map((training) => {
            return {
              start: moment(training.date).format(),
              end: moment(training.date)
                .add(training.duration, "minute")
                .format(),
              title: training.activity,
            };
          })}
        />
      </Box>
      <Box sx={{ marginTop: 2, marginBottom: 2 }} ref={ref}>
        <Typography
          variant="h5"
          component="h2"
          sx={{ paddingBottom: 5, paddingTop: 5 }}
        >
          Statistics
        </Typography>
        <Chart width={width} height={(width / 16) * 9} data={graphData} />
      </Box>
    </div>
  );
}
