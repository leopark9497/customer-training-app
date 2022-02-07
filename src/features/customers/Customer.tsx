import { Card, CardContent, Typography, CardActions, Button } from "@mui/material"

export interface CustomerType {
    firstname: string,
    lastname: string,
    streetaddress: string,
    postcode: string,
    city: string,
    links: Array<{rel: 'self' | 'custom' | 'trainings', href: URL}>,
    content: Array<any>,
    phone: string
}

export function Customer ({ information}: { information: CustomerType}) {
    const {
        firstname,
        lastname,
        streetaddress,
        postcode,
        city,
        links,
        phone
    } = information
    return (
      <Card
        sx={{ minWidth: 275, maxWidth: 300, marginBottom: 3, marginRight: 1 }}
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
          <Button size="small">Trainings</Button>
          <Button size="small" color="warning">Remove</Button>
        </CardActions>
      </Card>
    );
}