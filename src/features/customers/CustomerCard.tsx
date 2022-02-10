import { Card, CardContent, Typography, CardActions, Button, Modal } from "@mui/material"
import { useDispatch } from "react-redux";
import { customersAsync, deleteCustomerAsync } from "./customersSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box } from "@mui/system";

export interface CustomerGetType {
    firstname: string,
    lastname: string,
    streetaddress: string,
    postcode: string,
    city: string,
    links: Array<{rel: 'self' | 'custom' | 'trainings', href: string}>,
    content: Array<any>,
    phone: string
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 400,
  width: '90%',
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export function Customer ({ information}: { information: CustomerGetType}) {
    const { firstname, lastname, streetaddress, postcode, city, links, phone } =
      information;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openDeleteModal, setOpenDeleteModel] = useState(false);
    const handleOpenDeleteModel = () => setOpenDeleteModel(true)
    const handleCloseDeleteModel = () => setOpenDeleteModel(false)

    return (
      <Card
        sx={{ minWidth: 275, maxWidth: 300, marginBottom: 3 }}
        variant="outlined"
      >
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {streetaddress}, {postcode}, {city}
          </Typography>
          <Typography variant="h5" component="div">
            {firstname} {lastname}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary"></Typography>
          <Typography variant="body2">Phone number: {phone}</Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              navigate(`/customers/${links[0].href.split("/")[5]}`, {
                state: { links },
              })
            }
          >
            Details
          </Button>
          <>
            <Button
              size="small"
              color="warning"
              onClick={handleOpenDeleteModel}
            >
              Remove
            </Button>
            <Modal
              open={openDeleteModal}
              onClose={handleCloseDeleteModel}
            >
              <Box sx={style}>
                <Typography sx={{ paddingBottom: 2 }}>
                  Are you sure to permanently delete <b>{firstname} {lastname}</b>?
                </Typography>
                <Button
                  sx={{ marginRight: 2 }}
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={async () => {
                    await dispatch(deleteCustomerAsync(links[0].href));
                    dispatch(customersAsync());
                  }}
                >
                  Yes
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={handleCloseDeleteModel}
                >
                  No
                </Button>
              </Box>
            </Modal>
          </>
        </CardActions>
      </Card>
    );
}