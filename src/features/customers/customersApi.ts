
import axios from "axios"

export interface CustomerPostType {
    firstname: string,
    lastname: string,
    streetaddress: string,
    postcode: string,
    city: string,
    phone: string
}

export async function fetchCustomers() {
    try {
        const response = await axios.get('https://customerrest.herokuapp.com/api/customers')

        return response.data
    } catch(e) {
        console.log(e)
    }
}

export async function deleteCustomer(customerUrl: string) {
    try {
        const response = await axios.delete(customerUrl)

        return response.data
    } catch(e) {
        console.log(e)
    }
}

export async function addCustomer(customerDetails: CustomerPostType) {
    try {
        const response = await axios
            .post('https://customerrest.herokuapp.com/api/customers', customerDetails)

        return response.data
    } catch(e) {
        console.log(e)
    }
}