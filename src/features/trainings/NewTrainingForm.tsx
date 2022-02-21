import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { CircularProgress, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { addTrainingAsync, trainingsAsync } from './trainingSlice';
import { TrainingPostType } from './trainingsApi';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 440,
  width: '80%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const textFieldStyle = {
    width: '45%',
    paddingRight: 15,
    paddingBottom: 15
}

const fields = [
  {
    id: 'date',
    label: 'Date'
  },
  {
    id: 'activity',
    label: 'Activity'
  },
  {
    id: 'duration',
    label: 'Duration'
  },
  {
    id: 'customer',
    label: 'Customer ID'
  }
]
function FormField({id, label, hook}: {id: string, label: String, hook: Function}) {

  return (
    <TextField
      required
      style={textFieldStyle}
      id={id}
      label={label}
      variant="outlined"
      onChange={(event) => {
          hook(event.target.value);
        }
      }
    />
  );
}

export default function NewTrainingForm() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const asyncStatus = useSelector((state: RootState) => state.trainings.status);
  const dispatch = useDispatch();
  const [trainingDetails, setTrainingDetails] = React.useState<TrainingPostType>({
    date: '',
    activity: '',
    duration: '',
    customer: '',
  });

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleOpen}
      >
        Add a new training
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="New cusomter form"
      >
        <Box sx={style} component="form" noValidate autoComplete="off">
          <div>
            <Typography variant="h5" component="h2" sx={{ paddingBottom: 5 }}>
              New training
            </Typography>
            {fields.map((field) => (
              <FormField
                key={field.id}
                id={field.id}
                label={field.label}
                hook={(value: string) =>
                  setTrainingDetails({ ...trainingDetails, [field.id]: value })
                }
              />
            ))}
          </div>
          {asyncStatus !== "addingTraining" ? (
            <Button
              onClick={async () => {
                await dispatch(addTrainingAsync(trainingDetails));
                dispatch(trainingsAsync());
              }}
            >
              Submit
            </Button>
          ) : (
            <CircularProgress />
          )}
        </Box>
      </Modal>
    </div>
  );
}