import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { CircularProgress, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { addCustomerAsync, customersAsync } from './customersSlice';
import { CustomerPostType } from './customersApi';

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
    id: 'firstname',
    label: 'First name'
  },
  {
    id: 'lastname',
    label: 'Last name'
  },
  {
    id: 'phone',
    label: 'Phone numbers'
  },
  {
    id: 'streetaddress',
    label: 'Street Address'
  },
  {
    id: 'postcode',
    label: 'Postcode'
  },
  {
    id: 'city',
    label: 'City'
  },
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

export default function NewCustomerForm() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const asyncStatus = useSelector((state: RootState) => state.customers.status);
  const dispatch = useDispatch();
  const [customerDetails, setCustomerDetails] = React.useState<CustomerPostType>({
    firstname: '',
    lastname: '',
    phone: '',
    streetaddress: '',
    postcode: '',
    city: ''
  });

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleOpen}
      >
        Add a new customer
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="New cusomter form"
      >
        <Box sx={style} component="form" noValidate autoComplete="off">
          <div>
            <Typography variant="h5" component="h2" sx={{ paddingBottom: 5 }}>
              New customer
            </Typography>
            {fields.map((field) => (
              <FormField
                key={field.id}
                id={field.id}
                label={field.label}
                hook={(value: string) =>
                  setCustomerDetails({ ...customerDetails, [field.id]: value })
                }
              />
            ))}
          </div>
          {asyncStatus !== "addingCustomer" ? (
            <Button
              onClick={async () => {
                await dispatch(addCustomerAsync(customerDetails));
                dispatch(customersAsync());
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