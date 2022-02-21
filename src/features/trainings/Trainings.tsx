import { Box, Checkbox, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { RootState } from '../../app/store';
import { Training, TrainingGetType } from './TrainingCard';
import {
  trainingsAsync, selectTrainings
} from './trainingSlice';
import NewTrainingForm from './NewTrainingForm';
import SearchIcon from '@mui/icons-material/Search';

export function Trainings() {
  const trainings = useAppSelector(selectTrainings);
  const dispatch = useAppDispatch();
  const status = useSelector((state: RootState) => state.trainings.status)
  const [search, setSearch] = useState('');
  const [sortByName, setSortByName] = useState(false)


  useEffect(() => {dispatch(trainingsAsync())}, [dispatch]);

  if (status === 'fetchingTrainings') {
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
        <h1>Trainings</h1>
        <NewTrainingForm />
      </Box>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}
      >
        <Checkbox onChange={event => setSortByName(!sortByName)}/>
        <Typography sx={{ marginRight: 2 }} >Sort by duration</Typography>
        <SearchIcon sx={{ marginRight: 1 }} color="primary" />
        <TextField
          sx={{ marginBottom: 2 }}
          id="search"
          label="Search by activity"
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
        {trainings.length !== 0 &&
          trainings
            ?.filter((training: TrainingGetType) => {
              if (search) {
                const containActivity = training.activity
                  .toLowerCase()
                  .trim()
                  .includes(search.toLowerCase().trim());

                return containActivity;
              }

              return true;
            })
            .sort((filteredTraining1: TrainingGetType, filteredTraining2: TrainingGetType) => {
              if (sortByName) {
                if (filteredTraining1.duration < filteredTraining2.duration) {
                  return -1;
                } else {
                  return 1
                }
              }

              return 0
            })
            .map((sortedTraining: TrainingGetType) => {

              return (
                <Training
                  key={sortedTraining.date + sortedTraining.date}
                  information={sortedTraining}
                />
              );
            })}
      </Box>
    </>
  );
}
