import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { TrainingGetType } from './TrainingCard';
import { addTraining, TrainingPostType, deleteTraining, fetchTrainings } from './trainingsApi';

export interface TrainingsState {
  value: Array<TrainingGetType>;
  status: 'idle' | 'fetchingTrainings' | 'deletingTraining' | 'addingTraining';
}

const initialState: TrainingsState = {
  value: [],
  status: 'idle',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const trainingsAsync = createAsyncThunk(
  'trainings/fetchTrainings',
  async () => {
    const response = await fetchTrainings();
    
    return response.content
  }
);

export const deleteTrainingAsync = createAsyncThunk(
  'trainings/deleteTraining',
  async (trainingUrl: string) => {
    const response = await deleteTraining(trainingUrl);
    
    return response
  }
);

export const addTrainingAsync = createAsyncThunk(
  'trainings/addTraining',
  async (trainingDetails: TrainingPostType) => {
    const response = await addTraining(trainingDetails);
    
    return response
  }
);

export const trainingsSlice = createSlice({
  name: 'trainings',
  initialState,
  reducers: {
    clear: (state) => {
        state.value = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(trainingsAsync.pending, (state) => {
        state.status = 'fetchingTrainings';
      })
      .addCase(trainingsAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        state.value = action.payload;
      })
      .addCase(deleteTrainingAsync.pending, (state) => {
        state.status = 'deletingTraining';
      })
      .addCase(deleteTrainingAsync.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(addTrainingAsync.pending, (state) => {
        state.status = 'addingTraining';
      })
      .addCase(addTrainingAsync.fulfilled, (state) => {
        state.status = 'idle';
      });
  },
});

export const { clear } = trainingsSlice.actions;

export const selectTrainings = (state: RootState) => state.trainings.value;


export default trainingsSlice.reducer;
