
import axios from "axios"
export async function fetchCustomers() {
    try {
        const response = await axios.get('https://customerrest.herokuapp.com/api/customers')

        return response.data
    } catch(e) {
        console.log(e)
    }
}

